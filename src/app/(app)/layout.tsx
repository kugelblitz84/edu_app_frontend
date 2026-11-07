'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  User,
  BookOpen,
  GraduationCap,
  PlusCircle,
  Layers,
  LogOut,
  Menu,
  X,
  Compass,
  Newspaper
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const APP_SIDEBAR_LINKS = [
  { href: '/me/profile', label: 'My Profile', icon: User },
  { href: '/me/library', label: 'My Library & Drafts', icon: BookOpen },
  { href: '/me/exams', label: 'My Exam History', icon: GraduationCap },
  { href: '/studio/articles/new', label: 'Article Builder', icon: Newspaper },
  { href: '/studio/new-resource', label: 'Create Resource', icon: PlusCircle },
  { href: '/studio/new-collection', label: 'Collection Builder', icon: Layers }
];

function AppNavList({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-3 py-1">
        Workspace Navigation
      </div>
      {APP_SIDEBAR_LINKS.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onLinkClick}
            className={`w-full text-xs font-medium px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-2.5 ${
              isActive
                ? 'bg-[#6219BD] text-white font-semibold shadow-md shadow-purple-900/30'
                : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <link.icon className="w-4 h-4 opacity-80" />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6F5FC] text-zinc-900 flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#181722] text-white p-3.5 flex items-center justify-between border-b border-white/10">
        <Link href="/" className="wb-header-logo-text text-base">
          Wit<span className="text-purple-300">Base</span>
        </Link>
        <button
          onClick={() => setMobileSidebarOpen((o) => !o)}
          className="p-1.5 rounded-lg text-zinc-300 hover:text-white"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop & Mobile Drawer Sidebar */}
      <aside
        className={`${
          mobileSidebarOpen ? 'block' : 'hidden'
        } md:flex flex-col justify-between w-full md:w-64 bg-[#181722] text-white p-5 border-r border-white/10 shrink-0 z-40`}
      >
        <div className="space-y-6">
          {/* Logo & Platform Info */}
          <div className="hidden md:flex items-center justify-between">
            <Link href="/" className="wb-header-logo-text text-lg">
              Wit<span className="text-purple-300">Base</span>
            </Link>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 border border-purple-400/30">
              Workspace
            </span>
          </div>

          {/* User mini badge */}
          {user && (
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6219BD] to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                {user.fullName ? user.fullName[0] : 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user.fullName}</p>
                <p className="text-[10px] text-zinc-400 truncate">@{user.username}</p>
              </div>
            </div>
          )}

          {/* Navigation Links wrapped in Suspense */}
          <Suspense fallback={<div className="h-40 rounded-xl bg-white/5 animate-pulse" />}>
            <AppNavList onLinkClick={() => setMobileSidebarOpen(false)} />
          </Suspense>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-white/10 space-y-2">
          <Link
            href="/"
            className="w-full text-xs font-medium px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-purple-300" />
            <span>Public Catalog</span>
          </Link>

          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="w-full text-xs font-medium px-3 py-2 rounded-xl text-rose-300 hover:text-rose-100 hover:bg-rose-950/30 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 p-4 sm:p-8 2xl:p-10 max-w-6xl mx-auto w-full overflow-y-auto">
        <Suspense fallback={<div className="py-20 text-center text-xs text-zinc-400">Loading workspace...</div>}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}
