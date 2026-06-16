'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaArrowPointer, FaChartSimple, FaLink, FaEarthAmericas } from 'react-icons/fa6';

interface AnalyticsStats {
  pageViews: number;
  linkClicks: number;
  links: Array<{ id: string; title: string; platform: string; clicks: number }>;
  dailyViews: Array<{ _id: string; count: number }>;
  monthlyViews: Array<{ _id: string; count: number }>;
  platformClicks: Array<{ _id: string; clicks: number }>;
}

export default function AdminAnalytics() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/analytics');
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-moon-silver/40 font-orbitron animate-pulse">
        Calculating galactic analytics...
      </div>
    );
  }

  const views = stats?.pageViews || 0;
  const clicks = stats?.linkClicks || 0;
  const ctr = views > 0 ? ((clicks / views) * 100).toFixed(1) : '0.0';

  // Find max value in dailyViews to scale our CSS bar chart
  const dailyViewsList = stats?.dailyViews || [];
  const maxDailyCount = dailyViewsList.reduce((max, item) => (item.count > max ? item.count : max), 1);

  // Fallback for demo if no views recorded yet
  const displayDailyViews = dailyViewsList.length > 0 
    ? dailyViewsList 
    : [
        { _id: 'No Data', count: 0 }
      ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-orbitron text-2xl font-bold tracking-widest text-star-white">
          GALACTIC TELEMETRY
        </h1>
        <p className="text-xs text-moon-silver/40 tracking-wider font-orbitron uppercase mt-1">
          Deep analytics on signals, broadcasts, and traffic
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] tracking-widest font-orbitron uppercase text-moon-silver/45 font-medium">
              Total Page Views
            </span>
            <h2 className="text-3xl font-bold text-star-white font-orbitron mt-1">
              {views}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-xl bg-neon-cyan/15 flex items-center justify-center text-neon-cyan shadow-[0_0_15px_rgba(0,245,255,0.15)]">
            <FaEye className="w-5 h-5" />
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] tracking-widest font-orbitron uppercase text-moon-silver/45 font-medium">
              Total Link Clicks
            </span>
            <h2 className="text-3xl font-bold text-star-white font-orbitron mt-1">
              {clicks}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-xl bg-electric-purple/15 flex items-center justify-center text-electric-purple shadow-[0_0_15px_rgba(122,92,255,0.15)]">
            <FaArrowPointer className="w-5 h-5" />
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] tracking-widest font-orbitron uppercase text-moon-silver/45 font-medium">
              CTR Efficiency
            </span>
            <h2 className="text-3xl font-bold text-star-white font-orbitron mt-1">
              {ctr}%
            </h2>
          </div>
          <div className="w-12 h-12 rounded-xl bg-glow-blue/15 flex items-center justify-center text-glow-blue shadow-[0_0_15px_rgba(79,195,255,0.15)]">
            <FaChartSimple className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CSS Chart: Page Views Over Time */}
        <div className="glass p-6 rounded-2xl border border-white/5 lg:col-span-2 space-y-6">
          <h3 className="font-orbitron text-sm font-bold tracking-widest text-star-white uppercase">
            Radar Hits (Last 30 Days)
          </h3>

          <div className="h-64 flex items-end gap-2.5 pt-6 pb-2 px-2 border-b border-white/5">
            {displayDailyViews.map((day, idx) => {
              const pct = maxDailyCount > 0 ? (day.count / maxDailyCount) * 100 : 0;
              // Format label (e.g. 2026-06-15 -> 06/15)
              const label = day._id.includes('-') 
                ? day._id.split('-').slice(1).join('/') 
                : day._id;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group cursor-default">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 bg-cosmic-blue border border-neon-cyan/20 px-2 py-1 rounded text-[9px] font-orbitron text-neon-cyan mb-2 transition-all duration-300 shadow-[0_0_8px_rgba(0,245,255,0.2)]">
                    {day.count} views
                  </div>

                  {/* Bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(4, pct)}%` }}
                    transition={{ delay: idx * 0.02, duration: 0.8 }}
                    className="w-full bg-gradient-to-t from-electric-purple/50 to-neon-cyan rounded-t shadow-[0_0_10px_rgba(0,245,255,0.25)] group-hover:to-star-white group-hover:shadow-[0_0_15px_rgba(0,245,255,0.5)] transition-all duration-300"
                  />

                  {/* Label */}
                  <span className="text-[9px] text-moon-silver/40 font-orbitron mt-2 select-none group-hover:text-neon-cyan transition-colors">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clicks by Platform & Top Links */}
        <div className="glass p-6 rounded-2xl border border-white/5 lg:col-span-1 space-y-6">
          <h3 className="font-orbitron text-sm font-bold tracking-widest text-star-white uppercase">
            Platform Distribution
          </h3>

          <div className="space-y-4">
            {stats?.platformClicks && stats.platformClicks.length > 0 ? (
              stats.platformClicks.map((platform) => {
                const totalClicks = stats.linkClicks || 1;
                const share = ((platform.clicks / totalClicks) * 100).toFixed(0);

                return (
                  <div key={platform._id} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-star-white font-orbitron tracking-wide">
                        {platform._id}
                      </span>
                      <span className="text-neon-cyan font-orbitron">
                        {platform.clicks} ({share}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-electric-purple to-neon-cyan h-full rounded-full shadow-[0_0_5px_rgba(0,245,255,0.4)]"
                        style={{ width: `${share}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-xs text-moon-silver/30 font-orbitron">
                No active traffic data to map.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
