// @ts-nocheck
'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function GlobeContent() {
  const groupRef = useRef<THREE.Group>(null!);
  const markersRef = useRef<THREE.Group>(null!);

  // Create continent-like shapes
  const continentPositions = useMemo(() => [
    // Asia
    { lat: 30, lng: 100, size: 0.8 },
    // Europe
    { lat: 50, lng: 10, size: 0.5 },
    // Africa
    { lat: 0, lng: 20, size: 0.7 },
    // North America
    { lat: 45, lng: -100, size: 0.7 },
    // South America
    { lat: -15, lng: -60, size: 0.6 },
    // Australia
    { lat: -25, lng: 135, size: 0.4 },
  ], []);

  // Convert lat/lng to 3D position
  const latLngToVector3 = (lat: number, lng: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  // NURI Farm locations
  const farmLocations = [
    { name: 'Korea', lat: 37.5, lng: 127, color: '#FFD700' },
    { name: 'USA', lat: 40.7, lng: -74, color: '#FFD700' },
    { name: 'Germany', lat: 52.5, lng: 13.4, color: '#FFD700' },
  ];

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
    if (markersRef.current) {
      markersRef.current.children.forEach((child, i) => {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.3;
        child.scale.set(scale, scale, scale);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main globe - ocean blue */}
      <Sphere args={[2, 64, 32]}>
        <meshPhongMaterial
          color="#2A5A8A"
          emissive="#1a3a5a"
          emissiveIntensity={0.1}
          shininess={30}
        />
      </Sphere>

      {/* Continents (simplified as patches) */}
      {continentPositions.map((cont, i) => {
        const pos = latLngToVector3(cont.lat, cont.lng, 2.02);
        return (
          <mesh key={i} position={pos} lookAt={[0, 0, 0]}>
            <circleGeometry args={[cont.size * 0.3, 32]} />
            <meshStandardMaterial
              color="#4a7c59"
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>
        );
      })}

      {/* Grid lines for latitude/longitude */}
      <mesh>
        <sphereGeometry args={[2.01, 36, 18]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe={true}
          transparent={true}
          opacity={0.08}
        />
      </mesh>

      {/* NURI Farm markers */}
      <group ref={markersRef}>
        {farmLocations.map((location, i) => {
          const pos = latLngToVector3(location.lat, location.lng, 2.1);
          return (
            <group key={i} position={pos}>
              {/* Marker dot */}
              <mesh>
                <sphereGeometry args={[0.03, 16, 16]} />
                <meshStandardMaterial
                  color={location.color}
                  emissive={location.color}
                  emissiveIntensity={1}
                />
              </mesh>
              {/* Glow ring */}
              <mesh>
                <ringGeometry args={[0.05, 0.08, 32]} />
                <meshBasicMaterial
                  color={location.color}
                  transparent
                  opacity={0.3}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Atmosphere effect */}
      <mesh scale={2.15}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#4A90E2"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Inner glow */}
      <mesh scale={1.98}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.05}
        />
      </mesh>
    </group>
  );
}

export default function EnhancedGlobe() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        {/* Lighting setup */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 3, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-3, -1, -5]} intensity={0.4} color="#88ccff" />
        <pointLight position={[10, 10, 10]} intensity={0.5} />

        <GlobeContent />

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={3}
          maxDistance={8}
          enableRotate={true}
          autoRotate={false}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}