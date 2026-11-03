'use client';

import React from 'react';
import { Code2, X } from 'lucide-react';
import { MaterialItem } from '@/types';
import { Modal } from '@/components/common';

interface MaterialDetailModalProps {
  material: MaterialItem | null;
  onClose: () => void;
}

export function MaterialDetailModal({ material, onClose }: MaterialDetailModalProps) {
  if (!material) return null;

  return (
    <Modal isOpen={Boolean(material)} onClose={onClose}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] 2xl:text-xs font-bold uppercase tracking-wider bg-purple-100 text-[#6219BD]">
              {material.kind}
              {material.type ? ` • ${material.type}` : ''}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] 2xl:text-xs font-semibold bg-emerald-100 text-emerald-800">
              isFeatured: true
            </span>
          </div>
          <h3 className="text-base sm:text-lg 2xl:text-xl font-bold text-zinc-900 mt-1.5">
            {material.title}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4 2xl:w-5 2xl:h-5" />
        </button>
      </div>

      <p className="text-xs 2xl:text-sm text-zinc-600 leading-relaxed">
        {material.description}
      </p>

      {/* Endpoint Call Breakdown */}
      <div className="bg-zinc-950 text-zinc-100 rounded-xl p-3 sm:p-3.5 2xl:p-4.5 font-mono text-[11px] 2xl:text-xs space-y-2 overflow-x-auto">
        <div className="flex items-center justify-between text-zinc-400 text-[10px] 2xl:text-[11px]">
          <span className="flex items-center gap-1">
            <Code2 className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-purple-400" />
            Resources API Integration
          </span>
          <span>200 OK</span>
        </div>
        <div className="text-emerald-400">
          {material.kind === 'COLLECTION'
            ? 'GET /api/v1/resource-collections?featured=true'
            : `GET /api/v1/resources?type=${material.type}&featured=true`}
        </div>
        <pre className="text-[10px] 2xl:text-[11px] text-purple-200 leading-relaxed">
          {JSON.stringify(
            {
              id: material.id,
              kind: material.kind,
              ...(material.type ? { type: material.type } : {}),
              ...(material.isStandalone !== undefined
                ? { isStandalone: material.isStandalone }
                : {}),
              isFeatured: true,
              title: material.title,
              accessPolicy: material.accessPolicy,
              status: 'PUBLISHED',
              priceAmountMinor: material.priceAmountMinor,
              currency: material.currency,
              hasPin: material.hasPin,
              version: material.version,
              metadata: material.metadata
            },
            null,
            2
          )}
        </pre>
      </div>

      <div className="flex items-center justify-between pt-2">
        <span className="text-xs 2xl:text-sm text-zinc-500">
          Access Policy: <strong className="text-zinc-800">{material.accessPolicy}</strong>
        </span>
        <button
          onClick={onClose}
          className="bg-[#6219BD] hover:bg-[#4E129E] text-white text-xs 2xl:text-sm font-medium px-4 py-2 2xl:px-5 2xl:py-2.5 rounded-xl transition-colors cursor-pointer"
        >
          Done
        </button>
      </div>
    </Modal>
  );
}
