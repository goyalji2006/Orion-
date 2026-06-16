'use client';

import { motion } from 'framer-motion';
import {
  FaInstagram,
  FaYoutube,
  FaGithub,
  FaLinkedin,
  FaDiscord,
  FaXTwitter,
  FaFacebook,
  FaTelegram,
  FaWhatsapp,
  FaSnapchat,
  FaSpotify,
  FaThreads,
  FaFilm,
} from 'react-icons/fa6';
import { SiLetterboxd } from 'react-icons/si';
import { HiGlobeAlt, HiLink } from 'react-icons/hi2';

interface LinkButtonProps {
  id: string;
  platform: string;
  title: string;
  url: string;
  icon?: string;
}

export default function LinkButton({ id, platform, title, url, icon }: LinkButtonProps) {
  // Map platform string to corresponding react-icons element
  const getIcon = () => {
    const plat = platform.toLowerCase();
    const iconName = icon?.toLowerCase() || '';

    if (plat.includes('instagram') || iconName === 'instagram') return <FaInstagram className="w-5 h-5" />;
    if (plat.includes('youtube') || iconName === 'youtube') return <FaYoutube className="w-5 h-5" />;
    if (plat.includes('github') || iconName === 'github') return <FaGithub className="w-5 h-5" />;
    if (plat.includes('linkedin') || iconName === 'linkedin') return <FaLinkedin className="w-5 h-5" />;
    if (plat.includes('discord') || iconName === 'discord') return <FaDiscord className="w-5 h-5" />;
    if (plat.includes('twitter') || plat === 'x' || iconName === 'twitter' || iconName === 'x') {
      return <FaXTwitter className="w-5 h-5" />;
    }
    if (plat.includes('facebook') || iconName === 'facebook') return <FaFacebook className="w-5 h-5" />;
    if (plat.includes('telegram') || iconName === 'telegram') return <FaTelegram className="w-5 h-5" />;
    if (plat.includes('whatsapp') || iconName === 'whatsapp') return <FaWhatsapp className="w-5 h-5" />;
    if (plat.includes('snapchat') || iconName === 'snapchat') return <FaSnapchat className="w-5 h-5" />;
    if (plat.includes('spotify') || iconName === 'spotify') return <FaSpotify className="w-5 h-5" />;
    if (plat.includes('threads') || iconName === 'threads') return <FaThreads className="w-5 h-5" />;
    if (plat.includes('moctale') || iconName === 'moctale') {
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M 8 6 C 10 9, 14 9, 16 6 C 21 6, 21 18, 16 18 C 14 15, 10 15, 8 18 C 3 18, 3 6, 8 6 Z" />
        </svg>
      );
    }
    if (plat.includes('letterboxd') || plat.includes('letter box') || iconName === 'letterboxd' || iconName === 'letterbox') {
      return <SiLetterboxd className="w-5 h-5" />;
    }
    if (plat.includes('portfolio') || plat.includes('website') || plat.includes('globe') || iconName === 'globe') {
      return <HiGlobeAlt className="w-5 h-5" />;
    }
    return <HiLink className="w-5 h-5" />;
  };

  const handleClick = async () => {
    // Record click event asynchronously
    try {
      fetch(`/api/links/${id}/click`, { method: 'POST' });
    } catch (err) {
      console.error('Error tracking click:', err);
    }
    // Navigate
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.button
      whileHover={{ scale: 1.025, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="glass neon-border w-full py-4 px-6 rounded-2xl flex items-center justify-between text-left group transition-all duration-300 relative overflow-hidden cursor-pointer"
    >
      {/* Background slide hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 to-electric-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex items-center gap-4 relative z-10">
        {/* Glowing Platform Icon */}
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neon-cyan group-hover:text-star-white group-hover:bg-neon-cyan/20 group-hover:border-neon-cyan/30 transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.3)]">
          {getIcon()}
        </div>

        {/* Text descriptions */}
        <div>
          <h3 className="font-orbitron text-sm font-semibold tracking-wider text-star-white group-hover:text-neon-cyan transition-colors duration-300">
            {platform}
          </h3>
          <p className="text-xs text-moon-silver/50 group-hover:text-moon-silver/70 transition-colors duration-300 mt-0.5">
            {title}
          </p>
        </div>
      </div>

      {/* Decorative arrow signal */}
      <div className="text-moon-silver/30 group-hover:text-neon-cyan group-hover:translate-x-1 transition-all duration-300 relative z-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
          />
        </svg>
      </div>
    </motion.button>
  );
}
