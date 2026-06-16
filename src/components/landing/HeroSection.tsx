'use client';

import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 relative z-10 pt-20">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="font-orbitron text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-[0.25em] text-star-white neon-text select-none animate-float leading-tight"
      >
        ORIAN
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.65 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="font-orbitron text-xs sm:text-sm tracking-[0.4em] text-neon-cyan uppercase mt-6 font-semibold select-none"
      >
        Now u are in my SPACE
      </motion.p>
    </div>
  );
}
