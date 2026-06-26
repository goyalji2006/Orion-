'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaSliders, FaCircleInfo } from 'react-icons/fa6';

export default function AdminSettings() {
  const [primaryColor, setPrimaryColor] = useState('#00F5FF');
  const [accentColor, setAccentColor] = useState('#7A5CFF');
  const [showMoon, setShowMoon] = useState(true);
  const [showStars, setShowStars] = useState(true);
  const [showEnergyWaves, setShowEnergyWaves] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function fetchTheme() {
      try {
        const res = await fetch('/api/theme');
        const data = await res.json();
        if (data.success && data.theme) {
          setPrimaryColor(data.theme.primaryColor || '#00F5FF');
          setAccentColor(data.theme.accentColor || '#7A5CFF');
          setShowMoon(data.theme.showMoon !== false);
          setShowStars(data.theme.showStars !== false);
          setShowEnergyWaves(data.theme.showEnergyWaves !== false);
          setMusicEnabled(data.theme.musicEnabled === true);
        }
      } catch (err) {
        console.error('Failed to load theme settings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTheme();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = {
      primaryColor,
      accentColor,
      showMoon,
      showStars,
      showEnergyWaves,
      musicEnabled,
    };

    try {
      const res = await fetch('/api/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update theme');
      }

      setMessage({ type: 'success', text: 'Cosmic configuration saved successfully!' });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Error updating settings';
      setMessage({ type: 'error', text: errMsg });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-moon-silver/40 font-orbitron animate-pulse">
        Synchronizing system console...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-orbitron text-2xl font-bold tracking-widest text-star-white">
          VISUAL BROADCAST SETTINGS
        </h1>
        <p className="text-xs text-moon-silver/40 tracking-wider font-orbitron uppercase mt-1">
          Adjust parameters governing the public space background and styles
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* settings form */}
        <div className="lg:col-span-2">
          <div className="glass p-6 rounded-2xl border border-white/5 space-y-6">
            <h3 className="font-orbitron text-sm font-bold tracking-widest text-star-white uppercase">
              Rendering Configuration
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {message && (
                <div
                  className={`text-xs px-4 py-3 rounded-xl text-center font-orbitron tracking-wider ${
                    message.type === 'success'
                      ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-400'
                      : 'bg-red-950/40 border border-red-500/30 text-red-400'
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Toggles */}
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <div>
                    <h4 className="text-xs font-semibold text-star-white tracking-wide">
                      Show 3D Centerpiece Moon
                    </h4>
                    <p className="text-[10px] text-moon-silver/40">
                      Renders the detailed 3D rotating moon at the center of the viewport
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowMoon(!showMoon)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                      showMoon ? 'bg-neon-cyan' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-space-black transition-transform duration-300 ${
                        showMoon ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <div>
                    <h4 className="text-xs font-semibold text-star-white tracking-wide">
                      Activate Energy Wave Signals
                    </h4>
                    <p className="text-[10px] text-moon-silver/40">
                      Enables the concentric cyan energy waves expanding from the center moon
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowEnergyWaves(!showEnergyWaves)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                      showEnergyWaves ? 'bg-neon-cyan' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-space-black transition-transform duration-300 ${
                        showEnergyWaves ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <div>
                    <h4 className="text-xs font-semibold text-star-white tracking-wide">
                      Activate Space Starfield
                    </h4>
                    <p className="text-[10px] text-moon-silver/40">
                      Renders the slow-rotating twinkling particle field in deep space background
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowStars(!showStars)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                      showStars ? 'bg-neon-cyan' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-space-black transition-transform duration-300 ${
                        showStars ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <div>
                    <h4 className="text-xs font-semibold text-star-white tracking-wide">
                      Enable Space Drone Hum By Default
                    </h4>
                    <p className="text-[10px] text-moon-silver/40">
                      Pre-unmutes the sound synthesizer when visitors load the interface
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMusicEnabled(!musicEnabled)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                      musicEnabled ? 'bg-neon-cyan' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-space-black transition-transform duration-300 ${
                        musicEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div>
                  <label className="block text-[10px] tracking-widest font-orbitron uppercase text-moon-silver/50 mb-2">
                    Primary Cosmic Color (Hex)
                  </label>
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-star-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 transition-all duration-300"
                    placeholder="#00F5FF"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-widest font-orbitron uppercase text-moon-silver/50 mb-2">
                    Accent Cosmic Color (Hex)
                  </label>
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-star-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 transition-all duration-300"
                    placeholder="#7A5CFF"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-neon-cyan to-electric-purple text-space-black font-orbitron font-bold text-xs tracking-widest uppercase py-4 rounded-xl cursor-pointer hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] disabled:opacity-50 transition-all"
              >
                {saving ? 'Transmitting Data...' : 'Commit Theme Settings'}
              </button>
            </form>
          </div>
        </div>

        {/* Info panel */}
        <div className="lg:col-span-1">
          <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center gap-2.5 text-neon-cyan">
              <FaCircleInfo className="w-5 h-5 shrink-0" />
              <h3 className="font-orbitron text-sm font-bold tracking-widest uppercase text-star-white">
                Console Specs
              </h3>
            </div>
            <p className="text-xs text-moon-silver/65 leading-relaxed">
              Adjusting toggles alters the rendering pipeline directly in real-time. Disabling intensive items like the 3D Moon centerpiece can save cycles on low-power devices.
            </p>
            <div className="text-[10px] border-t border-white/5 pt-4 text-moon-silver/40 font-orbitron uppercase tracking-wider space-y-1.5">
              <p>Core: Next.js + Three.js</p>
              <p>Renderer: WebGL 2.0</p>
              <p>Status: Broadcast Synced</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
