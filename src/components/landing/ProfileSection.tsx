'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserAstronaut } from 'react-icons/fa6';

interface ProfileData {
  name: string;
  bio: string;
  profileImage: string;
}

export default function ProfileSection() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();
        if (data.success) {
          setProfile(data.profile);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 relative z-10 w-full max-w-md mx-auto">
        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 animate-pulse mb-4" />
        <div className="h-6 w-32 bg-white/5 border border-white/10 rounded animate-pulse mb-3" />
        <div className="h-4 w-64 bg-white/5 border border-white/10 rounded animate-pulse" />
      </div>
    );
  }

  const name = profile?.name || 'ORIAN';
  const bio = profile?.bio || 'Exploring Technology, Creativity & Space.';
  const image = profile?.profileImage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="flex flex-col items-center text-center px-6 py-10 relative z-10 w-full max-w-md mx-auto"
    >
      {/* Profile Image with Glow */}
      <div className="relative group mb-6">
        <div className="absolute inset-0 rounded-full bg-neon-cyan/20 blur-md group-hover:bg-neon-cyan/40 transition-all duration-500" />
        <div className="w-24 h-24 rounded-full border-2 border-neon-cyan/60 bg-cosmic-blue flex items-center justify-center overflow-hidden relative z-10 shadow-[0_0_15px_rgba(0,245,255,0.4)]">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <FaUserAstronaut className="w-10 h-10 text-neon-cyan/80" />
          )}
        </div>
        
        {/* Status Indicator */}
        <div className="absolute bottom-0 right-1 w-5 h-5 bg-cosmic-blue rounded-full border border-neon-cyan/40 flex items-center justify-center z-20">
          <div className="w-2.5 h-2.5 bg-neon-cyan rounded-full animate-pulse" />
        </div>
      </div>

      {/* Profile Bio details */}
      <h2 className="font-orbitron text-xl sm:text-2xl font-semibold text-star-white tracking-widest leading-none mb-3">
        {name}
      </h2>
      
      <p className="text-sm text-moon-silver/70 font-light max-w-sm leading-relaxed mb-1">
        {bio}
      </p>

      <span className="text-[10px] tracking-[0.2em] font-orbitron text-neon-cyan/60 uppercase font-semibold">
        Telemetry Active
      </span>
    </motion.div>
  );
}
