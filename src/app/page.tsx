'use client';

import { useEffect } from 'react';
import SpaceBackground from '@/components/three/SpaceBackground';
import HeroSection from '@/components/landing/HeroSection';
import ProfileSection from '@/components/landing/ProfileSection';
import SocialLinks from '@/components/landing/SocialLinks';
import MusicToggle from '@/components/landing/MusicToggle';
import Footer from '@/components/landing/Footer';

export default function Home() {
  useEffect(() => {
    // Record page view event in the analytics database on mount
    async function recordPageView() {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
        });
      } catch (err) {
        console.error('Error recording page view:', err);
      }
    }
    recordPageView();
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden bg-transparent selection:bg-neon-cyan/20 selection:text-neon-cyan">
      {/* Three.js animated stars, moon, and energy waves */}
      <SpaceBackground />

      {/* Landing page layout sections */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen">
        <HeroSection />
        <ProfileSection />
        <SocialLinks />
        <Footer />
      </div>

      {/* Ambient background music/noise controls */}
      <MusicToggle />
    </main>
  );
}
