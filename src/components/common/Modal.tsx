'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  maxWidthClass?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidthClass = 'max-w-lg 2xl:max-w-2xl'
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="wb-modal-backdrop"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`wb-modal-card ${maxWidthClass}`}
      >
        {title && (
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="text-base sm:text-lg font-bold text-zinc-900">{title}</div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 2xl:w-5 2xl:h-5" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
