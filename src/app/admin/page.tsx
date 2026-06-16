'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FaEye,
  FaArrowPointer,
  FaSignal,
  FaLink,
  FaTriangleExclamation,
  FaUserAstronaut,
  FaSliders,
  FaChartLine,
} from 'react-icons/fa6';
import Link from 'next/link';

interface DashboardStats {
  pageViews: number;
  linkClicks: number;
  links: Array<{ id: string; title: string; platform: string; clicks: number }>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsSeed, setNeedsSeed] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/analytics');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setNeedsSeed(false);
      } else {
        setNeedsSeed(true);
      }
    } catch (err) {
      console.error(err);
      setNeedsSeed(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchStats();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setSeedSuccess('Database initialized with default credentials and social links!');
        fetchStats();
      } else {
        alert(data.error || 'Seed failed');
      }
    } catch (err) {
      alert('Error seeding database');
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-moon-silver/40 font-orbitron animate-pulse">
        Polling Telemetry...
      </div>
    );
  }

  // Calculate Click-Through Rate (CTR)
  const views = stats?.pageViews || 0;
  const clicks = stats?.linkClicks || 0;
  const ctr = views > 0 ? ((clicks / views) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-orbitron text-2xl font-bold tracking-widest text-star-white">
          COSMIC DASHBOARD
        </h1>
        <p className="text-xs text-moon-silver/40 tracking-wider font-orbitron uppercase mt-1">
          System telemetry and link traffic
        </p>
      </div>

      {/* Database Seeding Alert */}
      {needsSeed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass border-yellow-500/20 p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
            <FaTriangleExclamation className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="font-orbitron text-sm font-bold text-star-white tracking-widest uppercase">
              Database Uninitialized
            </h3>
            <p className="text-xs text-moon-silver/60">
              No database configuration details found. Trigger standard initialization protocols to seed starter files.
            </p>
          </div>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="px-6 py-3 rounded-xl bg-yellow-500 text-space-black font-orbitron text-xs font-bold tracking-widest uppercase hover:shadow-[0_0_15px_rgba(234,179,8,0.4)] disabled:opacity-50 transition-all duration-300 cursor-pointer"
          >
            {seeding ? 'Seeding...' : 'Initialize System'}
          </button>
        </motion.div>
      )}

      {seedSuccess && (
        <div className="bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs px-4 py-3 rounded-xl text-center font-orbitron tracking-wider">
          {seedSuccess}
        </div>
      )}

      {/* Telemetry Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Page Views */}
        <div className="glass p-6 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 text-neon-cyan/20">
            <FaEye className="w-12 h-12" />
          </div>
          <span className="text-[10px] tracking-widest font-orbitron uppercase text-moon-silver/40 font-medium">
            Page views
          </span>
          <h2 className="text-4xl font-bold text-star-white mt-2 font-orbitron tracking-wide">
            {views}
          </h2>
          <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-neon-cyan h-full" style={{ width: '65%' }} />
          </div>
        </div>

        {/* Link Clicks */}
        <div className="glass p-6 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 text-electric-purple/20">
            <FaArrowPointer className="w-12 h-12" />
          </div>
          <span className="text-[10px] tracking-widest font-orbitron uppercase text-moon-silver/40 font-medium">
            Link clicks
          </span>
          <h2 className="text-4xl font-bold text-star-white mt-2 font-orbitron tracking-wide">
            {clicks}
          </h2>
          <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-electric-purple h-full" style={{ width: '45%' }} />
          </div>
        </div>

        {/* Click Through Rate */}
        <div className="glass p-6 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 text-glow-blue/20">
            <FaSignal className="w-12 h-12" />
          </div>
          <span className="text-[10px] tracking-widest font-orbitron uppercase text-moon-silver/40 font-medium">
            Click-through rate (CTR)
          </span>
          <h2 className="text-4xl font-bold text-star-white mt-2 font-orbitron tracking-wide">
            {ctr}%
          </h2>
          <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-glow-blue h-full" style={{ width: `${Math.min(parseFloat(ctr) * 2, 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Main Grid: Popular Links & Quick Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Links */}
        <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-orbitron text-sm font-bold tracking-widest text-star-white uppercase">
              Transmission Links Traffic
            </h3>
            <Link
              href="/admin/links"
              className="text-[10px] tracking-wider font-orbitron text-neon-cyan uppercase hover:underline"
            >
              Configure
            </Link>
          </div>

          <div className="divide-y divide-white/5">
            {stats?.links && stats.links.length > 0 ? (
              stats.links.slice(0, 5).map((link) => (
                <div key={link.id} className="py-3.5 flex justify-between items-center first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-neon-cyan text-xs">
                      <FaLink />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-star-white tracking-wide">
                        {link.platform}
                      </p>
                      <p className="text-[10px] text-moon-silver/40">
                        {link.title}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-orbitron font-semibold text-neon-cyan">
                      {link.clicks}
                    </span>
                    <p className="text-[9px] text-moon-silver/40 font-orbitron uppercase tracking-wider">
                      clicks
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-moon-silver/30 font-orbitron">
                No active traffic logs.
              </div>
            )}
          </div>
        </div>

        {/* Quick Operations panel */}
        <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
          <h3 className="font-orbitron text-sm font-bold tracking-widest text-star-white uppercase">
            Control Operations
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/admin/links"
              className="glass p-4 rounded-xl border border-white/5 hover:border-neon-cyan/20 text-center flex flex-col items-center gap-2 group transition-all duration-300"
            >
              <div className="w-9 h-9 rounded-lg bg-neon-cyan/15 flex items-center justify-center text-neon-cyan group-hover:scale-110 transition-transform">
                <FaLink className="w-4 h-4" />
              </div>
              <span className="text-[10px] tracking-wider font-orbitron text-moon-silver uppercase font-semibold">
                Manage Links
              </span>
            </Link>

            <Link
              href="/admin/profile"
              className="glass p-4 rounded-xl border border-white/5 hover:border-neon-cyan/20 text-center flex flex-col items-center gap-2 group transition-all duration-300"
            >
              <div className="w-9 h-9 rounded-lg bg-electric-purple/15 flex items-center justify-center text-electric-purple group-hover:scale-110 transition-transform">
                <FaUserAstronaut className="w-4 h-4" />
              </div>
              <span className="text-[10px] tracking-wider font-orbitron text-moon-silver uppercase font-semibold">
                Edit Profile
              </span>
            </Link>

            <Link
              href="/admin/analytics"
              className="glass p-4 rounded-xl border border-white/5 hover:border-neon-cyan/20 text-center flex flex-col items-center gap-2 group transition-all duration-300"
            >
              <div className="w-9 h-9 rounded-lg bg-glow-blue/15 flex items-center justify-center text-glow-blue group-hover:scale-110 transition-transform">
                <FaChartLine className="w-4 h-4" />
              </div>
              <span className="text-[10px] tracking-wider font-orbitron text-moon-silver uppercase font-semibold">
                Deep Analytics
              </span>
            </Link>

            <Link
              href="/admin/settings"
              className="glass p-4 rounded-xl border border-white/5 hover:border-neon-cyan/20 text-center flex flex-col items-center gap-2 group transition-all duration-300"
            >
              <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-moon-silver group-hover:scale-110 transition-transform">
                <FaSliders className="w-4 h-4" />
              </div>
              <span className="text-[10px] tracking-wider font-orbitron text-moon-silver uppercase font-semibold">
                Theme Config
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
