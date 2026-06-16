'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import LinkButton from './LinkButton';

interface LinkData {
  _id: string;
  platform: string;
  title: string;
  url: string;
  icon?: string;
  order: number;
}

export default function SocialLinks() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLinks() {
      try {
        const res = await fetch('/api/links');
        const data = await res.json();
        if (data.success) {
          // Sort links by order value
          const sorted = (data.links || []).sort((a: LinkData, b: LinkData) => a.order - b.order);
          setLinks(sorted);
        }
      } catch (err) {
        console.error('Failed to load links:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLinks();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 w-full max-w-md mx-auto px-6 py-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-full h-16 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-moon-silver/40 font-orbitron select-none relative z-10">
        No links broadcasted yet.
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4 w-full max-w-md mx-auto px-6 relative z-10 pb-12"
    >
      {links.map((link) => (
        <motion.div key={link._id} variants={itemVariants}>
          <LinkButton
            id={link._id}
            platform={link.platform}
            title={link.title}
            url={link.url}
            icon={link.icon}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
