'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserAstronaut } from 'react-icons/fa6';

export default function AdminProfile() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();
        if (data.success && data.profile) {
          setName(data.profile.name || '');
          setBio(data.profile.bio || '');
          setProfileImage(data.profile.profileImage || '');
        }
      } catch (err) {
        console.error('Failed to fetch profile details:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio, profileImage }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setMessage({ type: 'success', text: 'Telemetry profile updated successfully!' });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to save profile';
      setMessage({ type: 'error', text: errMsg });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-moon-silver/40 font-orbitron animate-pulse">
        Decompressing telemetry files...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-orbitron text-2xl font-bold tracking-widest text-star-white">
          PROFILE BROADCAST
        </h1>
        <p className="text-xs text-moon-silver/40 tracking-wider font-orbitron uppercase mt-1">
          Configure profile metadata visible on public channels
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Form */}
        <div className="lg:col-span-2">
          <div className="glass p-6 rounded-2xl border border-white/5 space-y-6">
            <h3 className="font-orbitron text-sm font-bold tracking-widest text-star-white uppercase">
              Metadata Configuration
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] tracking-widest font-orbitron uppercase text-moon-silver/50 mb-2">
                    Station Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-star-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 transition-all duration-300"
                    placeholder="e.g. ORIAN"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-widest font-orbitron uppercase text-moon-silver/50 mb-2">
                    Avatar Image URL
                  </label>
                  <input
                    type="url"
                    value={profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-star-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 transition-all duration-300"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-widest font-orbitron uppercase text-moon-silver/50 mb-2">
                  Biography Broadcast (Bio)
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-star-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 transition-all duration-300 resize-none"
                  placeholder="Tell visitors about your missions..."
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-neon-cyan to-electric-purple text-space-black font-orbitron font-bold text-xs tracking-widest uppercase py-4 rounded-xl cursor-pointer hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] disabled:opacity-50 transition-all"
              >
                {saving ? 'Transmitting Data...' : 'Commit Telemetry'}
              </button>
            </form>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-1">
          <div className="glass p-6 rounded-2xl border border-white/5 space-y-6 flex flex-col items-center justify-center text-center">
            <h3 className="font-orbitron text-sm font-bold tracking-widest text-star-white uppercase self-start">
              Live Radar Preview
            </h3>

            <div className="py-8 space-y-4">
              <div className="relative mx-auto w-24 h-24">
                <div className="absolute inset-0 rounded-full bg-neon-cyan/20 blur-md" />
                <div className="w-24 h-24 rounded-full border-2 border-neon-cyan/60 bg-cosmic-blue flex items-center justify-center overflow-hidden relative z-10 shadow-[0_0_15px_rgba(0,245,255,0.3)]">
                  {profileImage ? (
                    <img src={profileImage} alt={name || 'Preview'} className="w-full h-full object-cover" />
                  ) : (
                    <FaUserAstronaut className="w-10 h-10 text-neon-cyan/85" />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-orbitron text-lg font-bold text-star-white tracking-widest">
                  {name || 'ORIAN'}
                </h4>
                <p className="text-xs text-moon-silver/60 max-w-[200px] leading-relaxed">
                  {bio || 'Exploring Technology, Creativity & Space.'}
                </p>
                <div className="inline-block mt-2">
                  <span className="text-[9px] tracking-widest font-orbitron text-neon-cyan/60 bg-neon-cyan/5 border border-neon-cyan/15 px-2.5 py-1 rounded-full uppercase font-bold">
                    System Broadcast Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
