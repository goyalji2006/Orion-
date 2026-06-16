'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WaveProps {
  delay: number;
}

function WaveRing({ delay }: WaveProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Calculate progress based on time and individual offset
    const duration = 4.0; // 4 seconds cycle
    const progress = ((time + delay) % duration) / duration;

    if (meshRef.current) {
      // Scale expanding outward (from 1.0 to 3.2)
      const scale = 1.0 + progress * 2.2;
      meshRef.current.scale.set(scale, scale, 1);

      // Fade opacity out as it expands
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      if (progress < 0.2) {
        // Fade in quickly at start
        material.opacity = (progress / 0.2) * 0.45;
      } else {
        // Fade out slowly
        material.opacity = (1 - progress) * 0.45;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0.3, -0.2]}>
      <ringGeometry args={[2.0, 2.03, 64]} />
      <meshBasicMaterial
        color="#00F5FF" // Neon Cyan wave color
        transparent={true}
        opacity={0}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function EnergyWaves() {
  // Create 4 wave rings with staggered delays
  const waves = useMemo(() => [0, 1.0, 2.0, 3.0], []);

  return (
    <group>
      {waves.map((delay, index) => (
        <WaveRing key={index} delay={delay} />
      ))}
    </group>
  );
}
