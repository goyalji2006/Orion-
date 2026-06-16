'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Helper declared outside component to avoid React 19 linter warnings about impure random calls during render
function generateStarGroups() {
  const generateGroup = (count: number, innerR: number, range: number) => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute in a spherical shell region closer to camera view to make them denser
      const r = innerR + Math.random() * range;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return new THREE.BufferGeometry().setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
  };

  // Group 1: 2500 bright main stars
  // Group 2: 2500 blue/cyan stars
  // Group 3: 2500 purple/accent stars
  // Group 4: 4000 tiny faint background stars (cosmic dust / Milky Way haze)
  return [
    generateGroup(2500, 10, 45),
    generateGroup(2500, 10, 45),
    generateGroup(2500, 10, 45),
    generateGroup(4000, 15, 45),
  ];
}

export default function StarField() {
  const pointsRef1 = useRef<THREE.Points>(null);
  const pointsRef2 = useRef<THREE.Points>(null);
  const pointsRef3 = useRef<THREE.Points>(null);
  const pointsRef4 = useRef<THREE.Points>(null);

  // Generate 4 groups of stars to animate independently for deep astronomical parallax and twinkling
  const [stars1, stars2, stars3, stars4] = useMemo(() => generateStarGroups(), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Rotate groups slowly at different rates and axes for parallax universe feel
    if (pointsRef1.current) {
      pointsRef1.current.rotation.y = time * 0.003;
      pointsRef1.current.rotation.x = time * 0.001;
      const mat = pointsRef1.current.material as THREE.PointsMaterial;
      mat.opacity = 0.5 + Math.sin(time * 2.5) * 0.35; // Brighter twinkling
    }

    if (pointsRef2.current) {
      pointsRef2.current.rotation.y = -time * 0.002;
      pointsRef2.current.rotation.z = time * 0.0015;
      const mat = pointsRef2.current.material as THREE.PointsMaterial;
      mat.opacity = 0.6 + Math.sin(time * 1.5 + 1.5) * 0.35;
    }

    if (pointsRef3.current) {
      pointsRef3.current.rotation.x = -time * 0.0015;
      pointsRef3.current.rotation.z = -time * 0.001;
      const mat = pointsRef3.current.material as THREE.PointsMaterial;
      mat.opacity = 0.4 + Math.sin(time * 0.9 + 3.0) * 0.25;
    }

    if (pointsRef4.current) {
      pointsRef4.current.rotation.y = time * 0.001; // Super slow rotate
      const mat = pointsRef4.current.material as THREE.PointsMaterial;
      mat.opacity = 0.3 + Math.sin(time * 0.4 + 4.5) * 0.15; // Slow faint twinkle
    }
  });

  return (
    <group>
      {/* Bright white stars */}
      <points ref={pointsRef1} geometry={stars1}>
        <pointsMaterial
          color="#ffffff"
          size={0.12} // Larger, more visible stars
          sizeAttenuation={true}
          transparent={true}
          depthWrite={false}
        />
      </points>

      {/* Cyan glow stars */}
      <points ref={pointsRef2} geometry={stars2}>
        <pointsMaterial
          color="#00F5FF"
          size={0.09}
          sizeAttenuation={true}
          transparent={true}
          depthWrite={false}
        />
      </points>

      {/* Purple stars */}
      <points ref={pointsRef3} geometry={stars3}>
        <pointsMaterial
          color="#7A5CFF"
          size={0.1}
          sizeAttenuation={true}
          transparent={true}
          depthWrite={false}
        />
      </points>

      {/* Background Milky Way dust haze */}
      <points ref={pointsRef4} geometry={stars4}>
        <pointsMaterial
          color="#d9e5ff"
          size={0.05} // Very tiny stars
          sizeAttenuation={true}
          transparent={true}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
