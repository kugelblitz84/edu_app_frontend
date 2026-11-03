'use client';

import React, { useState } from 'react';
import { Search, ChevronDown, CheckCircle2, X } from 'lucide-react';

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

export function Navbar({
  accessFilter,
  onFilterChange,
  filterOptions = DEFAULT_FILTER_OPTIONS,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search for anything',
  onLoginClick,
  onSignUpClick,
  customActions
}: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const currentFilterLabel = () => {
    const matched = filterOptions.find((opt) => opt.id === accessFilter);
    return matched ? matched.label : 'Free Contents';
  };

  return (
    <header className="wb-header">
      {/* Brand Logo & Optional Filter Dropdown */}
      <div className="flex items-center gap-3 sm:gap-6 2xl:gap-10">
        <a
          href="#top"
          onClick={(e) => e.preventDefault()}
          className="flex items-center gap-1.5 select-none group"
        >
          <span className="wb-header-logo-text">
            Wit<span className="text-[#3F3D56]">Base</span>
          </span>
        </a>

        {onFilterChange && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-1 sm:gap-1.5 text-xs 2xl:text-[13px] font-medium text-[#27272A] hover:text-[#6219BD] transition-colors py-1 px-1.5 sm:px-2 2xl:py-1.5 2xl:px-2.5 rounded-lg hover:bg-white/50 cursor-pointer"
            >
              <span>{currentFilterLabel()}</span>
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
      {onSearchChange !== undefined && (
        <div className="flex-1 order-3 sm:order-2 max-w-full sm:max-w-md 2xl:max-w-xl mx-auto min-w-[200px] w-full sm:w-auto">
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
      )}

      {/* Auth Actions / Custom Actions */}
      <div className="flex items-center gap-2 2xl:gap-3 order-2 sm:order-3 ml-auto sm:ml-0">
        {customActions ? (
          customActions
        ) : (
          <>
            <button
              onClick={onLoginClick}
              className="wb-header-btn-primary"
            >
              Login
            </button>
            <button
              onClick={onSignUpClick}
              className="wb-header-btn-secondary"
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </header>
  );
}
