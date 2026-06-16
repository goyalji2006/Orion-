'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus,
  FaTrash,
  FaPen,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaEyeSlash,
  FaLink,
} from 'react-icons/fa6';

interface LinkItem {
  _id: string;
  platform: string;
  title: string;
  url: string;
  icon?: string;
  order: number;
  isActive: boolean;
  clicks: number;
}

const platforms = [
  'Instagram',
  'YouTube',
  'GitHub',
  'LinkedIn',
  'Discord',
  'X (Twitter)',
  'Facebook',
  'Telegram',
  'WhatsApp',
  'Portfolio',
  'Custom Link',
];

export default function AdminLinks() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);

  // Form State
  const [platform, setPlatform] = useState(platforms[0]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/links');
      const data = await res.json();
      if (data.success) {
        // Sort by order value ascending
        const sorted = (data.links || []).sort((a: LinkItem, b: LinkItem) => a.order - b.order);
        setLinks(sorted);
      }
    } catch (err) {
      console.error('Failed to fetch links:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchLinks();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setPlatform(platforms[0]);
    setTitle('');
    setUrl('');
    setIsActive(true);
    setEditingLink(null);
    setError(null);
  };

  const handleEdit = (link: LinkItem) => {
    setEditingLink(link);
    setPlatform(link.platform);
    setTitle(link.title);
    setUrl(link.url);
    setIsActive(link.isActive);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = { platform, title, url, isActive };

    try {
      const endpoint = editingLink ? `/api/links/${editingLink._id}` : '/api/links';
      const method = editingLink ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Operation failed');
      }

      resetForm();
      fetchLinks();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Error saving link';
      setError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to shut down this link broadcast?')) return;

    try {
      const res = await fetch(`/api/links/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchLinks();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete');
      }
    } catch (err) {
      alert('Error deleting link');
    }
  };

  const handleToggleActive = async (link: LinkItem) => {
    try {
      const res = await fetch(`/api/links/${link._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !link.isActive }),
      });
      if (res.ok) {
        fetchLinks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const moveLink = async (index: number, direction: 'up' | 'down') => {
    const newLinks = [...links];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newLinks.length) return;

    // Swap order property and positions
    const tempOrder = newLinks[index].order;
    newLinks[index].order = newLinks[targetIndex].order;
    newLinks[targetIndex].order = tempOrder;

    // Swap objects in array locally for immediate feedback
    const temp = newLinks[index];
    newLinks[index] = newLinks[targetIndex];
    newLinks[targetIndex] = temp;

    setLinks(newLinks);

    // Persist reorder to database
    try {
      await fetch('/api/links/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          links: newLinks.map((item, idx) => ({ id: item._id, order: idx })),
        }),
      });
      fetchLinks(); // Refetch to confirm database state
    } catch (err) {
      console.error('Failed to save link order:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-moon-silver/40 font-orbitron animate-pulse">
        Broadcasting signal...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-orbitron text-2xl font-bold tracking-widest text-star-white">
            LINK TRANSMISSIONS
          </h1>
          <p className="text-xs text-moon-silver/40 tracking-wider font-orbitron uppercase mt-1">
            Broadcast active signal paths to your bio
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Panel */}
        <div className="lg:col-span-1">
          <div className="glass p-6 rounded-2xl border border-white/5 space-y-6">
            <h3 className="font-orbitron text-sm font-bold tracking-widest text-star-white uppercase">
              {editingLink ? 'Edit Broadcast Path' : 'Create Broadcast Path'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-950/40 border border-red-500/30 text-red-400 text-xs px-4 py-3 rounded-xl font-orbitron text-center">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[10px] tracking-widest font-orbitron uppercase text-moon-silver/50 mb-2">
                  Target Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => {
                    setPlatform(e.target.value);
                    if (!title) {
                      setTitle(e.target.value);
                    }
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-star-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 transition-all duration-300"
                >
                  {platforms.map((p) => (
                    <option key={p} value={p} className="bg-cosmic-blue text-star-white">
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] tracking-widest font-orbitron uppercase text-moon-silver/50 mb-2">
                  Display Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-star-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 transition-all duration-300"
                  placeholder="e.g. Developer Profile"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-widest font-orbitron uppercase text-moon-silver/50 mb-2">
                  URL / Destination
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-star-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 transition-all duration-300"
                  placeholder="https://..."
                  required
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-[10px] tracking-widest font-orbitron uppercase text-moon-silver/50">
                  Broadcast Status
                </span>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                    isActive ? 'bg-neon-cyan' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-space-black transition-transform duration-300 ${
                      isActive ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-neon-cyan to-electric-purple text-space-black font-orbitron font-bold text-xs tracking-widest uppercase py-3.5 rounded-xl cursor-pointer hover:shadow-[0_0_15px_rgba(0,245,255,0.3)] disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? 'Saving...' : editingLink ? 'Update Path' : 'Add Path'}
                </button>
                {editingLink && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-3.5 rounded-xl border border-white/10 text-moon-silver/70 font-orbitron text-xs tracking-widest uppercase cursor-pointer hover:bg-white/5"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Links List Panel */}
        <div className="lg:col-span-2">
          <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="font-orbitron text-sm font-bold tracking-widest text-star-white uppercase">
              Broadcast Grid
            </h3>

            <div className="space-y-3">
              {links.length > 0 ? (
                links.map((link, idx) => (
                  <div
                    key={link._id}
                    className={`glass p-4 rounded-xl border flex items-center justify-between gap-4 transition-all duration-300 ${
                      link.isActive ? 'border-white/5' : 'border-white/5 opacity-55'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-neon-cyan text-sm shrink-0">
                        <FaLink />
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-semibold text-star-white tracking-wide truncate">
                            {link.platform}
                          </h4>
                          <span className="text-[9px] font-orbitron text-neon-cyan bg-neon-cyan/5 border border-neon-cyan/10 px-1.5 py-0.5 rounded uppercase">
                            {link.clicks} clicks
                          </span>
                        </div>
                        <p className="text-[10px] text-moon-silver/40 truncate">
                          {link.title} • {link.url}
                        </p>
                      </div>
                    </div>

                    {/* Actions Panel */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Reorder Up */}
                      <button
                        onClick={() => moveLink(idx, 'up')}
                        disabled={idx === 0}
                        className="p-2 rounded bg-white/5 border border-white/5 text-moon-silver/60 hover:text-neon-cyan hover:border-neon-cyan/25 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-all"
                        title="Move Up"
                      >
                        <FaArrowUp className="w-3 h-3" />
                      </button>

                      {/* Reorder Down */}
                      <button
                        onClick={() => moveLink(idx, 'down')}
                        disabled={idx === links.length - 1}
                        className="p-2 rounded bg-white/5 border border-white/5 text-moon-silver/60 hover:text-neon-cyan hover:border-neon-cyan/25 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-all"
                        title="Move Down"
                      >
                        <FaArrowDown className="w-3 h-3" />
                      </button>

                      {/* Toggle Active */}
                      <button
                        onClick={() => handleToggleActive(link)}
                        className={`p-2 rounded bg-white/5 border border-white/5 transition-all cursor-pointer ${
                          link.isActive
                            ? 'text-neon-cyan hover:text-moon-silver hover:border-white/10'
                            : 'text-moon-silver/30 hover:text-neon-cyan hover:border-neon-cyan/25'
                        }`}
                        title={link.isActive ? 'Deactivate Broadcast' : 'Activate Broadcast'}
                      >
                        {link.isActive ? <FaEye className="w-3.5 h-3.5" /> : <FaEyeSlash className="w-3.5 h-3.5" />}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleEdit(link)}
                        className="p-2 rounded bg-white/5 border border-white/5 text-moon-silver/60 hover:text-neon-cyan hover:border-neon-cyan/25 cursor-pointer transition-all"
                        title="Edit Details"
                      >
                        <FaPen className="w-3 h-3" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(link._id)}
                        className="p-2 rounded bg-white/5 border border-white/5 text-moon-silver/60 hover:text-red-500 hover:border-red-500/25 cursor-pointer transition-all"
                        title="Delete Broadcast"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-xs text-moon-silver/30 font-orbitron border border-dashed border-white/5 rounded-xl">
                  No signals configured. Create one using the generator panel.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
