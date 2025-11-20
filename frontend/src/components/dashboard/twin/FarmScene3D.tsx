/**
 * 3D Farm Scene Component
 * Three.js를 사용한 스마트팜 3D 시각화
 */

'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Text, Box, Line } from '@react-three/drei';
import * as THREE from 'three';
import type { House } from '@/types';

interface FarmScene3DProps {
  houses: House[];
  onHouseClick?: (houseId: number) => void;
  selectedHouse?: number | null;
}

// 하우스 3D 컴포넌트
function House3D({
  house,
  position,
  isSelected,
  onClick
}: {
  house: House;
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // 온도에 따른 색상 계산
  const tempColor = house.temperature
    ? house.temperature > 23
      ? '#ef4444' // 빨강 (높음)
      : house.temperature < 18
      ? '#3b82f6' // 파랑 (낮음)
      : '#10b981' // 초록 (정상)
    : '#10b981';

  // 호버 애니메이션
  useFrame(() => {
    if (meshRef.current && (hovered || isSelected)) {
      meshRef.current.position.y = position[1] + Math.sin(Date.now() * 0.002) * 0.1;
    } else if (meshRef.current) {
      meshRef.current.position.y = position[1];
    }
  });

  return (
    <group position={position}>
      {/* 하우스 본체 */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[4, 3, 8]} />
        <meshStandardMaterial
          color={isSelected ? '#fbbf24' : hovered ? '#60a5fa' : tempColor}
          opacity={0.8}
          transparent
          emissive={isSelected ? '#fbbf24' : hovered ? '#60a5fa' : tempColor}
          emissiveIntensity={isSelected ? 0.5 : hovered ? 0.3 : 0.1}
        />
      </mesh>

      {/* 하우스 지붕 */}
      <mesh position={[0, 2, 0]}>
        <coneGeometry args={[3, 1.5, 4]} />
        <meshStandardMaterial
          color={isSelected ? '#fbbf24' : hovered ? '#60a5fa' : '#64748b'}
          opacity={0.7}
          transparent
        />
      </mesh>

      {/* 하우스 라벨 */}
      <Text
        position={[0, 4, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {house.name}
      </Text>

      {/* 센서 정보 */}
      <Text
        position={[0, -2, 0]}
        fontSize={0.3}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
      >
        {`${house.temperature?.toFixed(1)}°C | ${house.humidity?.toFixed(0)}%`}
      </Text>

      {/* 랙 시각화 (간단한 박스들) */}
      {house.racks.slice(0, 6).map((rack, idx) => {
        const rackX = -1.5 + (idx % 3) * 1.5;
        const rackZ = idx < 3 ? -2 : 2;
        const rackColor = rack.type === 'fixed' ? '#059669' : rack.type === 'mobile-a' ? '#0ea5e9' : '#8b5cf6';

        return (
          <mesh key={rack.id} position={[rackX, 0, rackZ]}>
            <boxGeometry args={[0.8, 2, 0.8]} />
            <meshStandardMaterial
              color={rackColor}
              opacity={0.6}
              transparent
            />
          </mesh>
        );
      })}

      {/* 활성 셀 인디케이터 */}
      <mesh position={[0, 3.5, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#22c55e" />
      </mesh>
    </group>
  );
}

// 그리드 베이스
function GridBase() {
  return (
    <>
      <Grid
        args={[50, 50]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#334155"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#475569"
        fadeDistance={30}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#0f172a" opacity={0.9} transparent />
      </mesh>
    </>
  );
}

// 메인 씬
export default function FarmScene3D({ houses, onHouseClick, selectedHouse }: FarmScene3DProps) {
  return (
    <div className="w-full h-[600px] bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl overflow-hidden">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[15, 12, 15]} fov={60} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={40}
          maxPolarAngle={Math.PI / 2.2}
        />

        {/* 조명 */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#60a5fa" />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#34d399" />

        {/* 그리드 베이스 */}
        <GridBase />

        {/* 하우스들 배치 (5개를 원형으로 배치) */}
        {houses.map((house, idx) => {
          const angle = (idx / houses.length) * Math.PI * 2;
          const radius = 8;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;

          return (
            <House3D
              key={house.id}
              house={house}
              position={[x, 1.5, z]}
              isSelected={selectedHouse === house.id}
              onClick={() => onHouseClick?.(house.id)}
            />
          );
        })}

        {/* 중앙 로고/타이틀 */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[2, 2, 0.2, 32]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <Text
          position={[0, 0.3, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.8}
          color="#10b981"
          anchorX="center"
          anchorY="middle"
        >
          NURI FARM
        </Text>

        {/* 축 표시 */}
        <axesHelper args={[3]} />
      </Canvas>
    </div>
  );
}
