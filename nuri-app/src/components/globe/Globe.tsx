// @ts-nocheck
'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import Countries from './Countries';
import Sites from './Sites'; // Import the new Sites component

// --- 3D Globe Sphere Component (static) ---
function GlobeSphere() {
  // Create a more visible globe with better shading
  const globeRef = useRef<THREE.Mesh>(null!);

  return (
    <>
      <mesh ref={globeRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial
          color="#2563eb"
          emissive="#1e40af"
          emissiveIntensity={0.2}
          shininess={10}
          specular="#60a5fa"
        />
      </mesh>
      {/* Add atmosphere glow */}
      <mesh scale={[2.1, 2.1, 2.1]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </>
  );
}

// --- Scene Component (contains all 3D objects and hooks) ---
function Scene() {
  const groupRef = useRef<THREE.Group>(null!);

  // useFrame is now correctly inside a child of Canvas
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002; // Slightly faster rotation for better visual effect
    }
  });

  return (
    <group ref={groupRef}>
      <GlobeSphere />
      <Countries globeRef={groupRef} />
      <Sites /> {/* Add the Sites component here */}
    </group>
  );
}

// --- Main Canvas Component ---
export default function Globe() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.4} />
      <Scene />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={4}
        maxDistance={8}
        autoRotate={false}
        autoRotateSpeed={0.5}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </Canvas>
  );
}
