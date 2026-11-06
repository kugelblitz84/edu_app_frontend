'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  ChevronDown,
  CheckCircle2,
  X,
  User as UserIcon,
  BookOpen,
  Video,
  Building2,
  GraduationCap,
  FileText,
  PlusCircle,
  LogOut,
  Menu
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export interface FilterOption {
  id: string;
  label: string;
}

export interface NavbarProps {
  accessFilter?: string;
  onFilterChange?: (filterId: string) => void;
  filterOptions?: FilterOption[];
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
  customActions?: React.ReactNode;
}

const DEFAULT_FILTER_OPTIONS: FilterOption[] = [
  { id: 'ALL', label: 'All Featured Contents' },
  { id: 'FREE', label: 'FREE (Instant Access)' },
  { id: 'PURCHASE', label: 'PURCHASE (PIN Unlock)' },
  { id: 'ENROLLED', label: 'ENROLLED (Institution)' }
];

const NAV_LINKS = [
  { href: '/collections', label: 'Courses', icon: BookOpen },
  { href: '/resources', label: 'Resources', icon: Video },
  { href: '/exams', label: 'Exams & Gym', icon: GraduationCap },
  { href: '/institutions', label: 'Institutions', icon: Building2 },
  { href: '/articles', label: 'Articles', icon: FileText }
];

export function Navbar({
  accessFilter,
  onFilterChange,
  filterOptions = DEFAULT_FILTER_OPTIONS,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search courses, notes, exams...',
  onLoginClick,
  onSignUpClick,
  customActions
}: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const currentFilterLabel = () => {
    const matched = filterOptions.find((opt) => opt.id === accessFilter);
    return matched ? matched.label : 'All Featured';
  };

  return (
    <header className="wb-header relative">
      {/* Brand Logo & Nav Links */}
      <div className="flex items-center gap-3 sm:gap-5 2xl:gap-8">
        <Link href="/" className="flex items-center gap-1.5 select-none group">
          <span className="wb-header-logo-text">
            Wit<span className="text-[#3F3D56]">Base</span>
          </span>
        </Link>

        {/* Desktop Primary Nav Links */}
        <nav className="hidden xl:flex items-center gap-1 2xl:gap-2">
          {NAV_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs 2xl:text-[13px] font-medium px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'text-[#6219BD] bg-white/70 font-semibold shadow-xs'
                    : 'text-zinc-700 hover:text-[#6219BD] hover:bg-white/40'
                }`}
              >
                <link.icon className="w-3.5 h-3.5 opacity-70" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Filter Dropdown */}
        {onFilterChange && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-1 sm:gap-1.5 text-xs 2xl:text-[13px] font-medium text-[#27272A] hover:text-[#6219BD] transition-colors py-1 px-1.5 sm:px-2 2xl:py-1.5 2xl:px-2.5 rounded-lg hover:bg-white/50 cursor-pointer"
            >
              <span className="hidden sm:inline">{currentFilterLabel()}</span>
              <span className="sm:hidden">Filter</span>
              <ChevronDown className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 opacity-75" />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 2xl:w-56 rounded-xl bg-white shadow-xl border border-purple-100 py-1.5 z-50 text-xs 2xl:text-[13px]">
                <div className="px-3 py-1 text-[10px] 2xl:text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Filter by accessPolicy
                </div>
                {filterOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      onFilterChange(opt.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 2xl:py-2.5 flex items-center justify-between hover:bg-purple-50 transition-colors ${
                      accessFilter === opt.id
                        ? 'text-[#6219BD] font-semibold bg-purple-50/60'
                        : 'text-zinc-700'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {accessFilter === opt.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-[#6219BD]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search Input */}
      {onSearchChange !== undefined ? (
        <div className="flex-1 order-3 sm:order-2 max-w-full sm:max-w-xs md:max-w-sm 2xl:max-w-md mx-auto min-w-[180px] w-full sm:w-auto">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-zinc-500 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery ?? ''}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="wb-search-input"
            />
            {Boolean(searchQuery) && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                aria-label="Clear search query"
              >
                <X className="w-3.5 h-3.5 2xl:w-4 2xl:h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1" />
      )}

      {/* Auth Actions / User Avatar Dropdown */}
      <div className="flex items-center gap-2 2xl:gap-3 order-2 sm:order-3 ml-auto sm:ml-0">
        {customActions ? (
          customActions
        ) : isAuthenticated && user ? (
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen((o) => !o)}
              className="flex items-center gap-2 bg-white/80 hover:bg-white text-zinc-800 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border border-purple-200/60 shadow-xs cursor-pointer transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                {user.fullName ? user.fullName[0] : 'U'}
              </div>
              <span className="hidden sm:inline text-xs font-medium max-w-[100px] truncate">
                {user.fullName || user.username}
              </span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-2xl border border-purple-100 py-1.5 z-50 text-xs text-zinc-700 animate-in fade-in-50 duration-150">
                <div className="px-3.5 py-2 border-b border-zinc-100">
                  <p className="font-semibold text-zinc-900 truncate">{user.fullName}</p>
                  <p className="text-[11px] text-zinc-400 truncate">@{user.username}</p>
                </div>

                <Link
                  href="/me/profile"
                  onClick={() => setUserDropdownOpen(false)}
                  className="w-full px-3.5 py-2 flex items-center gap-2 hover:bg-purple-50 transition-colors"
                >
                  <UserIcon className="w-3.5 h-3.5 text-purple-600" />
                  <span>My Profile</span>
                </Link>

                <Link
                  href="/me/library"
                  onClick={() => setUserDropdownOpen(false)}
                  className="w-full px-3.5 py-2 flex items-center gap-2 hover:bg-purple-50 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                  <span>My Library &amp; Drafts</span>
                </Link>

                <Link
                  href="/me/exams"
                  onClick={() => setUserDropdownOpen(false)}
                  className="w-full px-3.5 py-2 flex items-center gap-2 hover:bg-purple-50 transition-colors"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                  <span>My Exam Attempts</span>
                </Link>

                <div className="my-1 border-t border-zinc-100" />

                <Link
                  href="/studio/new-resource"
                  onClick={() => setUserDropdownOpen(false)}
                  className="w-full px-3.5 py-2 flex items-center gap-2 text-[#6219BD] font-medium hover:bg-purple-50 transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Creator Studio</span>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setUserDropdownOpen(false);
                    router.push('/');
                  }}
                  className="w-full px-3.5 py-2 flex items-center gap-2 text-rose-600 hover:bg-rose-50 transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button
              onClick={() => {
                if (onLoginClick) onLoginClick();
                else router.push('/login');
              }}
              className="wb-header-btn-primary"
            >
              Login
            </button>
            <button
              onClick={() => {
                if (onSignUpClick) onSignUpClick();
                else router.push('/register');
              }}
              className="wb-header-btn-secondary"
            >
              Sign up
            </button>
          </>
        )}

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen((o) => !o)}
          className="xl:hidden p-1.5 rounded-lg text-zinc-700 hover:bg-white/60 cursor-pointer"
          aria-label="Toggle mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden w-full order-4 pt-3 pb-2 border-t border-purple-200/60 mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-medium px-3 py-2 rounded-lg bg-white/70 hover:bg-white text-zinc-800 flex items-center gap-2 shadow-2xs"
            >
              <link.icon className="w-4 h-4 text-[#6219BD]" />
              <span>{link.label}</span>
            </Link>
          ))}
          <Link
            href="/studio/new-resource"
            onClick={() => setMobileMenuOpen(false)}
            className="text-xs font-semibold px-3 py-2 rounded-lg bg-[#6219BD] text-white flex items-center gap-2 shadow-2xs col-span-2 sm:col-span-1"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Material</span>
          </Link>
        </div>
      )}
    </header>
  );
}
