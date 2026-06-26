'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaUserAstronaut,
  FaChartLine,
  FaListUl,
  FaSliders,
  FaPowerOff,
} from 'react-icons/fa6';
import { IoPlanetOutline } from 'react-icons/io5';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  interface UserProfile {
    id: string;
    email: string;
    name: string;
    bio?: string;
    profileImage?: string;
  }
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          throw new Error('Unauthorized');
        }
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-space-black flex flex-col items-center justify-center font-orbitron text-sm tracking-widest text-neon-cyan animate-pulse">
        Establishing Link...
      </div>
    );
  }

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <FaChartLine className="w-4 h-4" /> },
    { name: 'Links', path: '/admin/links', icon: <FaListUl className="w-4 h-4" /> },
    { name: 'Profile', path: '/admin/profile', icon: <FaUserAstronaut className="w-4 h-4" /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <FaChartLine className="w-4 h-4" /> },
    { name: 'Settings', path: '/admin/settings', icon: <FaSliders className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-space-black text-moon-silver flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-cosmic-blue/30 border-b lg:border-b-0 lg:border-r border-white/5 p-6 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo / Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan">
              <IoPlanetOutline className="w-5 h-5" />
            </div>
            <div>
              <span className="font-orbitron text-sm font-bold tracking-widest text-star-white">
                ORIAN ADMIN
              </span>
              <p className="text-[9px] text-neon-cyan/50 tracking-wider font-orbitron uppercase">
                Control Center
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const active = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-orbitron tracking-widest uppercase transition-all duration-300 ${
                    active
                      ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 shadow-[0_0_10px_rgba(0,245,255,0.15)]'
                      : 'text-moon-silver/65 hover:text-star-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info / Logout */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan">
              <FaUserAstronaut className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-orbitron font-semibold text-star-white truncate">
                {user?.name || 'Operator'}
              </p>
              <p className="text-[10px] text-moon-silver/40 truncate">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-red-500/20 text-red-400 font-orbitron text-[10px] tracking-widest uppercase cursor-pointer hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-300"
          >
            <FaPowerOff className="w-3.5 h-3.5" />
            Shutdown Link
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10 max-h-screen overflow-y-auto relative bg-[radial-gradient(ellipse_at_top_right,rgba(11,18,32,0.4)_0%,rgba(5,8,22,1)_100%)]">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
