// @ts-nocheck
'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function RotatingGlobe() {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);

  // Rotation animation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003; // Constant rotation speed
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main globe */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.8, 64, 32]} />
        <meshStandardMaterial
          color="#4472C4"
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>

      {/* Wireframe overlay for countries effect */}
      <mesh>
        <sphereGeometry args={[1.81, 32, 16]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe={true}
          transparent={true}
          opacity={0.1}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh scale={1.95}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#4472C4"
          transparent={true}
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Add some sample markers */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#FFD700" />
      </mesh>

      <mesh position={[1.3, 1.2, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#FFD700" />
      </mesh>
    </group>
  );
}

export default function SimpleGlobe() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 40 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.3} />
        <RotatingGlobe />
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