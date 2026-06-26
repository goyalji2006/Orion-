'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaUserAstronaut } from 'react-icons/fa6';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Something went wrong';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-space-black relative px-4 overflow-hidden">
      {/* Background space glow grid effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(11,18,32,0.6)_0%,rgba(5,8,22,1)_100%)] z-0" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-neon-cyan/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-electric-purple/5 blur-3xl" />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="glass w-full max-w-md p-8 rounded-3xl relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan mb-4 shadow-[0_0_15px_rgba(0,245,255,0.2)]">
            <FaUserAstronaut className="w-7 h-7" />
          </div>
          <h1 className="font-orbitron text-2xl font-bold tracking-widest text-star-white neon-text">
            ORIAN ACCESS
          </h1>
          <p className="text-xs text-moon-silver/40 tracking-[0.2em] uppercase mt-1">
            Secure Terminal Login
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-950/40 border border-red-500/30 text-red-400 text-xs px-4 py-3 rounded-xl text-center select-none font-orbitron tracking-wider">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] tracking-widest font-orbitron uppercase text-moon-silver/50 mb-2 font-medium">
              Station Operator Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-star-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 transition-all duration-300"
              placeholder="operator@orian.space"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-widest font-orbitron uppercase text-moon-silver/50 mb-2 font-medium">
              Access Code
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-star-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 transition-all duration-300"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-neon-cyan to-electric-purple text-space-black font-orbitron font-bold text-xs tracking-[0.2em] py-4 rounded-xl cursor-pointer hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] disabled:opacity-50 transition-all duration-300 uppercase relative overflow-hidden"
          >
            {loading ? 'Decrypting credentials...' : 'Establish Session'}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
