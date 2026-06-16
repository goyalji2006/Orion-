'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export default function Moon() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowLightRef = useRef<THREE.PointLight>(null);

  // Load the raw photographic texture image (Drei handles Suspense)
  const texture = useTexture('/moon.png');

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Cinematic floating and gentle 3D parallax wobble
    if (meshRef.current) {
      meshRef.current.position.y = 0.3 + Math.sin(time * 0.5) * 0.15;
      
      // Gentle wobble to simulate 3D rotation/parallax without exposing flat edges
      meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.05;
      meshRef.current.rotation.y = Math.cos(time * 0.25) * 0.05;
      
      // Extremely slow rotation on Z-axis to keep it alive
      meshRef.current.rotation.z = time * 0.005;
    }

    // Dynamic glow pulse
    if (glowLightRef.current) {
      glowLightRef.current.intensity = 3.5 + Math.sin(time * 2.0) * 0.5;
    }
  });

  return (
    <group>
      {/* Billboard Moon Disk */}
      <mesh ref={meshRef} position={[0, 0.3, 0]}>
        <planeGeometry args={[4.2, 4.0]} />
        <meshStandardMaterial
          map={texture}
          transparent={true}
          roughness={0.95}
          metalness={0.05}
          color="#ffffff"
        />
      </mesh>

      {/* Rim light placed behind the moon disk to create a gorgeous cinematic cyan aura */}
      <pointLight
        ref={glowLightRef}
        color="#00F5FF" // Neon Cyan Glow
        position={[0, 0.3, -0.5]} // Placed slightly behind the disk
        intensity={3.8}
        distance={15}
        decay={1.5}
      />
    </group>
  );
}
