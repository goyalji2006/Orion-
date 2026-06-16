/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/purity */
'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ShootingStarData {
  startPos: THREE.Vector3;
  dir: THREE.Vector3;
  speed: number;
  progress: number;
  length: number;
  delay: number;
}

// Generate star helper declared outside to satisfy render purity
const generateStar = (): ShootingStarData => {
  const startX = -15 + Math.random() * 10;
  const startY = 5 + Math.random() * 10;
  const startZ = -10 - Math.random() * 10;

  const angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.1; // ~45 degrees downward
  const dir = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0).normalize();

  return {
    startPos: new THREE.Vector3(startX, startY, startZ),
    dir,
    speed: 0.15 + Math.random() * 0.15,
    progress: 0,
    length: 1.5 + Math.random() * 2,
    delay: Math.random() * 8, // Random initial delay
  };
};

function StarTrail() {

  // Store shooting star data inside a ref to allow mutation in frame loops
  const starRef = useRef<ShootingStarData | null>(null);
  if (starRef.current === null) {
    starRef.current = generateStar();
  }

  // Create native line object
  const lineObj = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const mat = new THREE.LineBasicMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0,
    });
    return new THREE.Line(geom, mat);
  }, []);

  useFrame(() => {
    const data = starRef.current;
    if (!data) return;

    if (data.delay > 0) {
      data.delay -= 0.016; // countdown delay
      return;
    }

    data.progress += data.speed;

    // Calculate head and tail positions
    const head = new THREE.Vector3()
      .copy(data.startPos)
      .addScaledVector(data.dir, data.progress);

    const tail = new THREE.Vector3()
      .copy(data.startPos)
      .addScaledVector(data.dir, Math.max(0, data.progress - data.length));

    const positions = new Float32Array([
      tail.x, tail.y, tail.z,
      head.x, head.y, head.z
    ]);

    lineObj.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    lineObj.geometry.attributes.position.needsUpdate = true;

    // Fade out at end of trajectory
    const material = lineObj.material as THREE.LineBasicMaterial;
    if (data.progress > 15) {
      material.opacity = Math.max(0, 1 - (data.progress - 15) / 5);
    } else {
      material.opacity = Math.min(1, data.progress / 2);
    }

    // Reset star when it travels off-screen
    if (data.progress > 25) {
      starRef.current = generateStar();
      const material = lineObj.material as THREE.LineBasicMaterial;
      material.opacity = 0;
    }
  });

  return <primitive object={lineObj} />;
}

export default function ShootingStars() {
  return (
    <group>
      <StarTrail />
      <StarTrail />
      <StarTrail />
    </group>
  );
}
