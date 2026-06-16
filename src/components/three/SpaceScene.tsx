'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import StarField from './StarField';
import Moon from './Moon';
import EnergyWaves from './EnergyWaves';
import ShootingStars from './ShootingStars';

export default function SpaceScene() {
  return (
    <div className="fixed inset-0 w-screen h-screen z-0 pointer-events-none bg-[#050816]">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 1000 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        {/* Deep space ambient illumination */}
        <ambientLight intensity={0.15} />
        
        {/* Soft white directional light mimicking a distant star/sun */}
        <directionalLight
          position={[5, 5, 4]}
          intensity={1.5}
          color="#ffffff"
        />

        {/* Space Components */}
        <StarField />
        <Suspense fallback={null}>
          <Moon />
        </Suspense>
        <EnergyWaves />
        <ShootingStars />
      </Canvas>
    </div>
  );
}
