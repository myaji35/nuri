// @ts-nocheck
'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3-geo';
import * as THREE from 'three';

export default function GlobeWithBorders() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    let cleanup: (() => void) | null = null;
    let animationId: number;

    const initGlobe = async () => {
      try {
        setIsLoading(true);

        // Dynamic imports
        const THREE = await import('three');
        const { geoPath, geoOrthographic } = await import('d3-geo');

        if (!mountRef.current) return;

        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;

        // Scene setup
        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x000000, 1, 100);

        // Camera
        const camera = new THREE.PerspectiveCamera(
          50,
          width / height,
          0.1,
          1000
        );
        camera.position.z = 5;

        // Renderer
        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        mountRef.current.appendChild(renderer.domElement);

        // Globe sphere with texture
        const textureLoader = new THREE.TextureLoader();
        const globeGeometry = new THREE.SphereGeometry(2, 64, 64);

        // Create a gradient material for the globe
        const globeMaterial = new THREE.ShaderMaterial({
          uniforms: {
            uTime: { value: 0 }
          },
          vertexShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;

            void main() {
              vUv = uv;
              vNormal = normalize(normalMatrix * normal);
              vPosition = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            uniform float uTime;

            void main() {
              // Create ocean-like colors
              vec3 oceanColor1 = vec3(0.05, 0.15, 0.35);  // Deep ocean
              vec3 oceanColor2 = vec3(0.1, 0.25, 0.45);   // Mid ocean
              vec3 landColor = vec3(0.15, 0.3, 0.2);      // Land hint

              // Create pseudo-random continent patterns
              float continent = sin(vPosition.x * 3.0) * cos(vPosition.y * 2.0 + uTime * 0.1) * sin(vPosition.z * 2.5);
              continent = smoothstep(-0.5, 0.5, continent);

              vec3 color = mix(oceanColor1, oceanColor2, vUv.y);
              color = mix(color, landColor, continent * 0.3);

              // Add lighting effect
              vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));
              float diffuse = max(dot(vNormal, lightDir), 0.0);
              color *= (0.6 + diffuse * 0.4);

              gl_FragColor = vec4(color, 1.0);
            }
          `,
          side: THREE.FrontSide
        });

        const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
        scene.add(globeMesh);

        // Create country borders using lines - Enhanced with more visible grid
        const createCountryBorders = () => {
          const borderGroup = new THREE.Group();

          // Create latitude lines (more visible)
          for (let lat = -80; lat <= 80; lat += 15) {
            const points = [];

            for (let lon = 0; lon <= 360; lon += 3) {
              const phi = (90 - lat) * (Math.PI / 180);
              const theta = lon * (Math.PI / 180);

              const x = 2.01 * Math.sin(phi) * Math.cos(theta);
              const y = 2.01 * Math.cos(phi);
              const z = 2.01 * Math.sin(phi) * Math.sin(theta);

              points.push(new THREE.Vector3(x, y, z));
            }

            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const lineMaterial = new THREE.LineBasicMaterial({
              color: 0xFFFFFF,
              transparent: true,
              opacity: 0.4,
              linewidth: 1
            });
            const line = new THREE.Line(lineGeometry, lineMaterial);
            borderGroup.add(line);
          }

          // Create longitude lines (more visible)
          for (let lon = 0; lon < 360; lon += 15) {
            const points = [];

            for (let lat = -90; lat <= 90; lat += 3) {
              const phi = (90 - lat) * (Math.PI / 180);
              const theta = lon * (Math.PI / 180);

              const x = 2.01 * Math.sin(phi) * Math.cos(theta);
              const y = 2.01 * Math.cos(phi);
              const z = 2.01 * Math.sin(phi) * Math.sin(theta);

              points.push(new THREE.Vector3(x, y, z));
            }

            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const lineMaterial = new THREE.LineBasicMaterial({
              color: 0xFFFFFF,
              transparent: true,
              opacity: 0.4,
              linewidth: 1
            });
            const line = new THREE.Line(lineGeometry, lineMaterial);
            borderGroup.add(line);
          }

          return borderGroup;
        };

        const borders = createCountryBorders();
        scene.add(borders);

        // Store country border group reference
        let countryBorderGroup: THREE.Group | null = null;

        // Load and add actual country boundaries
        const loadCountryBoundaries = async () => {
          try {
            const response = await fetch('/world-110m.json');
            const worldData = await response.json();

            // Import topojson dynamically
            const topojson = await import('topojson-client');

            // Convert TopoJSON to GeoJSON
            const countries = topojson.feature(worldData, worldData.objects.countries);

            countryBorderGroup = new THREE.Group();

            // Create line material for country borders
            const countryLineMaterial = new THREE.LineBasicMaterial({
              color: 0xFFFFFF,  // White for country borders
              transparent: true,
              opacity: 0.8,
              linewidth: 1
            });

            // Process each country
            // @ts-ignore - topojson types
            if (countries.features) {
              // @ts-ignore - topojson types
              countries.features.forEach((feature: any) => {
                if (feature.geometry.type === 'Polygon') {
                  feature.geometry.coordinates.forEach((ring: number[][]) => {
                    const points: THREE.Vector3[] = [];
                    ring.forEach(coord => {
                      const [lon, lat] = coord;
                      const phi = (90 - lat) * (Math.PI / 180);
                      const theta = (lon + 180) * (Math.PI / 180);

                      const x = -(2.02 * Math.sin(phi) * Math.cos(theta));
                      const y = 2.02 * Math.cos(phi);
                      const z = 2.02 * Math.sin(phi) * Math.sin(theta);

                      points.push(new THREE.Vector3(x, y, z));
                    });

                    if (points.length > 1) {
                      const geometry = new THREE.BufferGeometry().setFromPoints(points);
                      const line = new THREE.Line(geometry, countryLineMaterial);
                      countryBorderGroup?.add(line);
                    }
                  });
                } else if (feature.geometry.type === 'MultiPolygon') {
                  feature.geometry.coordinates.forEach((polygon: number[][][]) => {
                    polygon.forEach((ring: number[][]) => {
                      const points: THREE.Vector3[] = [];
                      ring.forEach(coord => {
                        const [lon, lat] = coord;
                        const phi = (90 - lat) * (Math.PI / 180);
                        const theta = (lon + 180) * (Math.PI / 180);

                        const x = -(2.02 * Math.sin(phi) * Math.cos(theta));
                        const y = 2.02 * Math.cos(phi);
                        const z = 2.02 * Math.sin(phi) * Math.sin(theta);

                        points.push(new THREE.Vector3(x, y, z));
                      });

                      if (points.length > 1) {
                        const geometry = new THREE.BufferGeometry().setFromPoints(points);
                        const line = new THREE.Line(geometry, countryLineMaterial);
                        countryBorderGroup?.add(line);
                      }
                    });
                  });
                }
              });
            }

            if (countryBorderGroup) {
              scene.add(countryBorderGroup);
            }

          } catch (error) {
            console.error('Failed to load country boundaries:', error);
          }
        };

        loadCountryBoundaries();

        // Add NURI farm locations as markers
        const addMarkers = () => {
          const markerGroup = new THREE.Group();

          const locations = [
            { name: 'NURI 여주', lat: 37.3, lon: 127.6, color: 0xffd700 },
            { name: 'NURI 호치민', lat: 10.8, lon: 106.7, color: 0xffd700 },
            { name: 'NURI 캘리포니아', lat: 37.3, lon: -121.9, color: 0xffd700 },
            { name: 'Seoul HQ', lat: 37.5665, lon: 126.9780, color: 0xff6b6b },
          ];

          locations.forEach(({ name, lat, lon, color }) => {
            // Convert lat/lon to 3D coordinates
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lon + 180) * (Math.PI / 180);

            const x = -(2.05 * Math.sin(phi) * Math.cos(theta));
            const y = 2.05 * Math.cos(phi);
            const z = 2.05 * Math.sin(phi) * Math.sin(theta);

            // Create marker
            const markerGeometry = new THREE.SphereGeometry(0.03, 16, 16);
            const markerMaterial = new THREE.MeshBasicMaterial({
              color: color,
            });
            const marker = new THREE.Mesh(markerGeometry, markerMaterial);
            marker.position.set(x, y, z);

            // Create pulsing ring
            const ringGeometry = new THREE.RingGeometry(0.05, 0.08, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
              color: color,
              transparent: true,
              opacity: 0.5,
              side: THREE.DoubleSide
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.position.set(x, y, z);
            ring.lookAt(new THREE.Vector3(0, 0, 0));

            markerGroup.add(marker);
            markerGroup.add(ring);
          });

          return markerGroup;
        };

        const markers = addMarkers();
        scene.add(markers);

        // Atmosphere glow effect
        const atmosphereGeometry = new THREE.SphereGeometry(2.5, 32, 32);
        const atmosphereMaterial = new THREE.ShaderMaterial({
          vertexShader: `
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
              gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
            }
          `,
          blending: THREE.AdditiveBlending,
          side: THREE.BackSide,
          transparent: true
        });
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        scene.add(atmosphere);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 3, 5);
        scene.add(directionalLight);

        // Mouse interaction with drag support
        let mouseX = 0;
        let mouseY = 0;
        let targetRotationX = 0;
        let targetRotationY = 0;
        let isDragging = false;
        let previousMouseX = 0;
        let previousMouseY = 0;
        let userRotationY = 0;
        let userRotationX = 0;
        let autoRotate = true;

        const handleMouseDown = (event: MouseEvent) => {
          isDragging = true;
          autoRotate = false; // Stop auto-rotation when user starts dragging
          previousMouseX = event.clientX;
          previousMouseY = event.clientY;
        };

        const handleMouseMove = (event: MouseEvent) => {
          if (!mountRef.current) return;
          const rect = mountRef.current.getBoundingClientRect();
          mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

          if (isDragging) {
            const deltaX = event.clientX - previousMouseX;
            const deltaY = event.clientY - previousMouseY;

            userRotationY += deltaX * 0.005;
            userRotationX += deltaY * 0.005;

            // Limit vertical rotation
            userRotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, userRotationX));

            previousMouseX = event.clientX;
            previousMouseY = event.clientY;
          }
        };

        const handleMouseUp = () => {
          isDragging = false;
          // Resume auto-rotation after 2 seconds of no interaction
          setTimeout(() => {
            if (!isDragging) {
              autoRotate = true;
            }
          }, 2000);
        };

        const handleMouseLeave = () => {
          isDragging = false;
        };

        mountRef.current.addEventListener('mousedown', handleMouseDown);
        mountRef.current.addEventListener('mousemove', handleMouseMove);
        mountRef.current.addEventListener('mouseup', handleMouseUp);
        mountRef.current.addEventListener('mouseleave', handleMouseLeave);

        // Animation
        let time = 0;
        const animate = () => {
          animationId = requestAnimationFrame(animate);
          time += 0.01;

          // Update shader uniforms
          if (globeMaterial.uniforms) {
            globeMaterial.uniforms.uTime.value = time;
          }

          // Smooth rotation with auto-rotate and user control
          if (autoRotate && !isDragging) {
            targetRotationY += 0.002; // Auto-rotation speed
          } else {
            targetRotationY = userRotationY;
            targetRotationX = userRotationX;
          }

          // Direct assignment for immediate response (no mouse tracking effect)
          globeMesh.rotation.y = targetRotationY;
          globeMesh.rotation.x = targetRotationX;

          borders.rotation.y = globeMesh.rotation.y;
          borders.rotation.x = globeMesh.rotation.x;

          // Rotate country borders
          if (countryBorderGroup) {
            countryBorderGroup.rotation.y = globeMesh.rotation.y;
            countryBorderGroup.rotation.x = globeMesh.rotation.x;
          }

          markers.rotation.y = globeMesh.rotation.y;
          markers.rotation.x = globeMesh.rotation.x;

          // Pulse markers
          markers.children.forEach((child, index) => {
            if (index % 2 === 1) { // Rings only
              const scale = 1 + Math.sin(time * 3) * 0.2;
              child.scale.set(scale, scale, scale);
              if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
                child.material.opacity = 0.5 - Math.sin(time * 3) * 0.3;
              }
            }
          });

          renderer.render(scene, camera);
        };

        animate();
        setIsLoading(false);

        // Handle resize
        const handleResize = () => {
          if (!mountRef.current) return;
          const newWidth = mountRef.current.clientWidth;
          const newHeight = mountRef.current.clientHeight;

          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        cleanup = () => {
          if (animationId) cancelAnimationFrame(animationId);
          window.removeEventListener('resize', handleResize);
          if (mountRef.current) {
            mountRef.current.removeEventListener('mousedown', handleMouseDown);
            mountRef.current.removeEventListener('mousemove', handleMouseMove);
            mountRef.current.removeEventListener('mouseup', handleMouseUp);
            mountRef.current.removeEventListener('mouseleave', handleMouseLeave);
            if (renderer.domElement && mountRef.current.contains(renderer.domElement)) {
              mountRef.current.removeChild(renderer.domElement);
            }
          }
          renderer.dispose();
          globeGeometry.dispose();
          atmosphereGeometry.dispose();
        };

      } catch (err) {
        console.error('Failed to initialize globe:', err);
        setError(err instanceof Error ? err.message : 'Failed to load globe');
        setIsLoading(false);
      }
    };

    initGlobe();

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white/80 text-center">
          <p>Error loading globe</p>
          <p className="text-sm opacity-70">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-lg">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <div>Loading 3D Globe...</div>
          </div>
        </div>
      )}
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}