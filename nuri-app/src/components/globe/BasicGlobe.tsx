// @ts-nocheck
'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function RotatingGlobe() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main globe - dark blue ocean */}
      <mesh>
        <sphereGeometry args={[2, 64, 32]} />
        <meshStandardMaterial
          color="#1e3a5f"
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Grid lines for countries/continents */}
      <mesh>
        <sphereGeometry args={[2.01, 36, 18]} />
        <meshBasicMaterial
          color="#90EE90"
          wireframe={true}
          transparent={true}
          opacity={0.2}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh scale={2.1}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#4472C4"
          transparent={true}
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Sample markers */}
      <mesh position={[0, 2.05, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#FFD700" />
      </mesh>
      <mesh position={[1.5, 1.3, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#FFD700" />
      </mesh>
      <mesh position={[-1, 1, 1.5]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#FFD700" />
      </mesh>
    </group>
  );
}

export default function BasicGlobe() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{
        width: '100%',
        height: '100%',
        background: 'transparent'
      }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} />
      <RotatingGlobe />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={8}
        enableRotate={true}
      />
    </Canvas>
  );
}