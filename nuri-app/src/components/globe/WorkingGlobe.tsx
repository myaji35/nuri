// @ts-nocheck
'use client';

import { useEffect, useRef, useState } from 'react';

export default function WorkingGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    let cleanup: (() => void) | null = null;

    const initThree = async () => {
      try {
        setIsLoading(true);

        // Dynamic import
        const THREE = await import('three');

        if (!mountRef.current) return;

        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;

        // Scene
        const scene = new THREE.Scene();

        // Camera
        const camera = new THREE.PerspectiveCamera(
          45,
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
        mountRef.current.appendChild(renderer.domElement);

        // Globe mesh
        const globeGeometry = new THREE.SphereGeometry(2, 48, 32);
        const globeMaterial = new THREE.MeshPhongMaterial({
          color: 0x1e3a5f,
          shininess: 15,
        });
        const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
        scene.add(globeMesh);

        // Country borders (wireframe)
        const borderGeometry = new THREE.SphereGeometry(2.01, 36, 18);
        const borderMaterial = new THREE.MeshBasicMaterial({
          color: 0x90ee90,
          wireframe: true,
          transparent: true,
          opacity: 0.25,
        });
        const borderMesh = new THREE.Mesh(borderGeometry, borderMaterial);
        scene.add(borderMesh);

        // Add marker points
        const markerGeometry = new THREE.SphereGeometry(0.05, 12, 12);
        const markerMaterial = new THREE.MeshBasicMaterial({
          color: 0xffd700,
          emissive: 0xffd700,
        });

        // Sample marker positions (lat/lon to 3D)
        const markers = [
          { lat: 37.5, lon: 127 },   // Seoul
          { lat: 40.7, lon: -74 },    // New York
          { lat: 51.5, lon: -0.1 },   // London
        ];

        markers.forEach(({ lat, lon }) => {
          const phi = (90 - lat) * (Math.PI / 180);
          const theta = (lon + 180) * (Math.PI / 180);

          const x = -(2.05 * Math.sin(phi) * Math.cos(theta));
          const y = 2.05 * Math.cos(phi);
          const z = 2.05 * Math.sin(phi) * Math.sin(theta);

          const marker = new THREE.Mesh(markerGeometry, markerMaterial.clone());
          marker.position.set(x, y, z);
          scene.add(marker);
        });

        // Atmosphere glow
        const atmosphereGeometry = new THREE.SphereGeometry(2.2, 32, 32);
        const atmosphereMaterial = new THREE.MeshBasicMaterial({
          color: 0x4472c4,
          transparent: true,
          opacity: 0.1,
          side: THREE.BackSide,
        });
        const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        scene.add(atmosphereMesh);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 3, 5);
        scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.3);
        pointLight.position.set(-10, -10, -10);
        scene.add(pointLight);

        // Mouse controls
        let mouseX = 0;
        let mouseY = 0;
        const handleMouseMove = (event: MouseEvent) => {
          mouseX = (event.clientX / window.innerWidth) * 2 - 1;
          mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Animation loop
        const animate = () => {
          requestAnimationFrame(animate);

          // Auto-rotate
          globeMesh.rotation.y += 0.003;
          borderMesh.rotation.y += 0.003;

          // Mouse interaction
          globeMesh.rotation.x = mouseY * 0.2;
          borderMesh.rotation.x = mouseY * 0.2;

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

        // Cleanup function
        cleanup = () => {
          window.removeEventListener('resize', handleResize);
          window.removeEventListener('mousemove', handleMouseMove);
          if (mountRef.current && renderer.domElement) {
            mountRef.current.removeChild(renderer.domElement);
          }
          renderer.dispose();
          globeGeometry.dispose();
          globeMaterial.dispose();
          borderGeometry.dispose();
          borderMaterial.dispose();
          markerGeometry.dispose();
          atmosphereGeometry.dispose();
          atmosphereMaterial.dispose();
        };

      } catch (err) {
        console.error('Failed to initialize Three.js globe:', err);
        setError(err instanceof Error ? err.message : 'Failed to load globe');
        setIsLoading(false);
      }
    };

    initThree();

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white text-center">
          <p>Error loading globe</p>
          <p className="text-sm opacity-70">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
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