// @ts-nocheck
'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import * as topojson from 'topojson-client';

interface WorldData {
  type: string;
  arcs: number[][][];
  objects: {
    countries: {
      type: string;
      geometries: any[];
    };
    land: {
      type: string;
      geometries: any[];
    };
  };
  transform: {
    scale: number[];
    translate: number[];
  };
}

function CountryBoundaries({ worldData }: { worldData: WorldData | null }) {
  const linesRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!worldData || !linesRef.current) return;

    // Clear existing children
    while (linesRef.current.children.length > 0) {
      linesRef.current.remove(linesRef.current.children[0]);
    }

    try {
      // Convert TopoJSON to GeoJSON
      const countries = topojson.feature(worldData, worldData.objects.countries);

      // Create line material for country borders
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xFFFFFF,  // White for better visibility
        linewidth: 2,
        transparent: true,
        opacity: 0.9,
      });

      // Process each country
      if (countries.features) {
        countries.features.forEach((feature: any) => {
          if (feature.geometry.type === 'Polygon') {
            feature.geometry.coordinates.forEach((ring: number[][]) => {
              const points: THREE.Vector3[] = [];
              ring.forEach(coord => {
                const [lon, lat] = coord;
                const phi = (90 - lat) * (Math.PI / 180);
                const theta = (lon + 180) * (Math.PI / 180);

                const x = -(1.82 * Math.sin(phi) * Math.cos(theta));
                const y = 1.82 * Math.cos(phi);
                const z = 1.82 * Math.sin(phi) * Math.sin(theta);

                points.push(new THREE.Vector3(x, y, z));
              });

              if (points.length > 1) {
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, lineMaterial);
                linesRef.current?.add(line);
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

                  const x = -(1.82 * Math.sin(phi) * Math.cos(theta));
                  const y = 1.82 * Math.cos(phi);
                  const z = 1.82 * Math.sin(phi) * Math.sin(theta);

                  points.push(new THREE.Vector3(x, y, z));
                });

                if (points.length > 1) {
                  const geometry = new THREE.BufferGeometry().setFromPoints(points);
                  const line = new THREE.Line(geometry, lineMaterial);
                  linesRef.current?.add(line);
                }
              });
            });
          }
        });
      }
    } catch (error) {
      console.error('Error processing world data:', error);
    }
  }, [worldData]);

  return <group ref={linesRef} />;
}

function RotatingGlobe({ worldData }: { worldData: WorldData | null }) {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);

  // Rotation animation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003; // Constant rotation speed
    }
  });

  // Create marker positions (example locations)
  const markerPositions = useMemo(() => {
    const positions = [
      { lat: 37.5665, lon: 126.9780, name: "Seoul" },  // Seoul
      { lat: 35.6762, lon: 139.6503, name: "Tokyo" },  // Tokyo
      { lat: 1.3521, lon: 103.8198, name: "Singapore" },  // Singapore
      { lat: -33.8688, lon: 151.2093, name: "Sydney" },  // Sydney
    ];

    return positions.map(pos => {
      const phi = (90 - pos.lat) * (Math.PI / 180);
      const theta = (pos.lon + 180) * (Math.PI / 180);

      const x = -(1.85 * Math.sin(phi) * Math.cos(theta));
      const y = 1.85 * Math.cos(phi);
      const z = 1.85 * Math.sin(phi) * Math.sin(theta);

      return { x, y, z, name: pos.name };
    });
  }, []);

  return (
    <group ref={groupRef}>
      {/* Main globe with dark blue color */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.8, 64, 32]} />
        <meshStandardMaterial
          color="#1e3a5f"  // Dark blue for ocean
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Country boundaries */}
      <CountryBoundaries worldData={worldData} />

      {/* Atmosphere glow */}
      <mesh scale={2.0}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#4472C4"
          transparent={true}
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Markers with pulsing effect */}
      {markerPositions.map((pos, index) => (
        <group key={index}>
          {/* Marker sphere */}
          <mesh position={[pos.x, pos.y, pos.z]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshBasicMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
          </mesh>
          {/* Pulsing ring */}
          <mesh position={[pos.x, pos.y, pos.z]}>
            <ringGeometry args={[0.05, 0.07, 32]} />
            <meshBasicMaterial
              color="#FFD700"
              transparent={true}
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function GlobeWithCountries() {
  const [worldData, setWorldData] = useState<WorldData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load TopoJSON data
    fetch('/world-110m.json')
      .then(response => response.json())
      .then(data => {
        setWorldData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading world data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#fff', textAlign: 'center' }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div>Loading Globe...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 40 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-5, -5, -5]} intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.3} />
        <RotatingGlobe worldData={worldData} />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={3.5}
          maxDistance={7}
          enableRotate={true}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}