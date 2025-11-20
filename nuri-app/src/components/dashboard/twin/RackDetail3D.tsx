/**
 * 3D Rack Detail Component
 * 선택된 하우스의 랙 상세 3D 시각화
 */

'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { Rack } from '@/types';

interface RackDetail3DProps {
  racks: Rack[];
  houseName: string;
}

// 랙 3D 컴포넌트
function Rack3D({ rack, position }: { rack: Rack; position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current && rack.type !== 'fixed') {
      // Mobile 랙은 약간 움직이는 애니메이션
      meshRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  const rackColor =
    rack.type === 'fixed' ? '#059669' : rack.type === 'mobile-a' ? '#0ea5e9' : '#8b5cf6';

  const utilizationRate = rack.activeCells / rack.totalCells;
  const heightScale = 0.5 + utilizationRate * 0.5; // 가동률에 따라 높이 변화

  return (
    <group ref={meshRef} position={position}>
      {/* 랙 프레임 */}
      <mesh>
        <boxGeometry args={[1.5, 4 * heightScale, 0.5]} />
        <meshStandardMaterial
          color={rackColor}
          opacity={0.7}
          transparent
          emissive={rackColor}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* 층별 표시 (4개 레이어) */}
      {rack.layers.map((layer, idx) => {
        const layerY = -1.5 * heightScale + idx * heightScale;
        const layerColor = layer.activeCells / layer.cells.length > 0.8 ? '#22c55e' : '#eab308';

        return (
          <group key={layer.id} position={[0, layerY, 0]}>
            {/* 레이어 플레이트 */}
            <mesh position={[0, 0, 0.3]}>
              <boxGeometry args={[1.3, 0.1, 0.8]} />
              <meshStandardMaterial color={layerColor} opacity={0.8} transparent />
            </mesh>

            {/* 셀 표시 (간단한 점들) */}
            {[...Array(Math.min(layer.activeCells, 10))].map((_, cellIdx) => {
              const cellX = -0.5 + (cellIdx % 5) * 0.25;
              const cellZ = cellIdx < 5 ? 0.2 : 0.5;

              return (
                <mesh key={cellIdx} position={[cellX, 0, cellZ]}>
                  <sphereGeometry args={[0.05, 8, 8]} />
                  <meshBasicMaterial color="#10b981" />
                </mesh>
              );
            })}
          </group>
        );
      })}

      {/* 랙 라벨 */}
      <Text position={[0, 2.5 * heightScale, 0]} fontSize={0.25} color="white" anchorX="center">
        Rack {rack.id}
      </Text>

      {/* 타입 표시 */}
      <Text position={[0, -2 * heightScale, 0]} fontSize={0.15} color="#94a3b8" anchorX="center">
        {rack.type}
      </Text>

      {/* 활성 셀 표시 */}
      <Text
        position={[0, 2.8 * heightScale, 0]}
        fontSize={0.15}
        color="#10b981"
        anchorX="center"
      >
        {rack.activeCells}/{rack.totalCells}
      </Text>
    </group>
  );
}

export default function RackDetail3D({ racks, houseName }: RackDetail3DProps) {
  return (
    <div className="w-full h-[500px] bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl overflow-hidden">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[8, 6, 8]} fov={50} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={20}
        />

        {/* 조명 */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#60a5fa" />

        {/* 바닥 */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>

        {/* 랙들 배치 (6개를 2열 3행으로) */}
        {racks.map((rack, idx) => {
          const row = Math.floor(idx / 3);
          const col = idx % 3;
          const x = -3 + col * 3;
          const z = -2 + row * 4;

          return <Rack3D key={rack.id} rack={rack} position={[x, 2, z]} />;
        })}

        {/* 타이틀 */}
        <Text position={[0, 6, -5]} fontSize={0.6} color="#10b981" anchorX="center">
          {houseName} - 랙 시스템
        </Text>
      </Canvas>
    </div>
  );
}
