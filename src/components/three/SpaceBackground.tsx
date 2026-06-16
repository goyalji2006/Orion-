'use client';

import dynamic from 'next/dynamic';

const SpaceScene = dynamic(() => import('./SpaceScene'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-[#050816] flex items-center justify-center z-0">
      {/* Cinematic dark placeholder background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(11,18,32,0.8)_0%,rgba(5,8,22,1)_100%)]" />
    </div>
  ),
});

export default function SpaceBackground() {
  return <SpaceScene />;
}
