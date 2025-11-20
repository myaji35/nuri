// @ts-nocheck
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard } from '@react-three/drei';
import * as THREE from 'three';

const MARKER_COLOR = '#FFC700'; // Yellow

export default function SiteMarker({ position }: { position: THREE.Vector3 }) {
  const haloRef = useRef<THREE.Mesh>(null!);

  // Pulsing animation for the halo
  useFrame(({ clock }) => {
    if (haloRef.current) {
      const time = clock.getElapsedTime();
      const pulse = (Math.sin(time * 2) + 1) / 2; // Oscillates between 0 and 1
      haloRef.current.scale.set(1 + pulse * 0.5, 1 + pulse * 0.5, 1);
      (haloRef.current.material as THREE.MeshBasicMaterial).opacity = 1 - pulse;
    }
  });

  return (
    <Billboard position={position}>
      {/* Halo (for pulsing effect) */}
      <mesh ref={haloRef}>
        <circleGeometry args={[0.08, 32]} />
        <meshBasicMaterial
          color={MARKER_COLOR}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Central solid marker */}
      <mesh>
        <circleGeometry args={[0.03, 32]} />
        <meshBasicMaterial color={MARKER_COLOR} side={THREE.DoubleSide} />
      </mesh>
    </Billboard>
  );
}
