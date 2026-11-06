'use client';

import React from 'react';
import { Lock } from 'lucide-react';
import { AccessPolicy } from '@/types';

export interface AccessPolicyBadgeProps {
  item?: {
    accessPolicy: AccessPolicy | string;
    priceAmountMinor?: number | null;
  };
  policy?: AccessPolicy | string;
  priceAmountMinor?: number | null;
  currency?: string | null;
  variant?: 'light' | 'dark';
  darkBg?: boolean;
}

export function AccessPolicyBadge({
  item,
  policy,
  priceAmountMinor,
  variant,
  darkBg = false
}: AccessPolicyBadgeProps) {
  const actualPolicy = policy || item?.accessPolicy;
  const actualAmountMinor =
    priceAmountMinor !== undefined ? priceAmountMinor : item?.priceAmountMinor;
  const isDark = darkBg || variant === 'dark';

  if (actualPolicy === 'FREE') {
    return (
      <span className="wb-badge-free">
        FREE
      </span>
    );
  }

  if (actualPolicy === 'PURCHASE') {
    const amount = actualAmountMinor ? `৳${actualAmountMinor / 100}` : 'PIN';
    return (
      <span className={isDark ? 'wb-badge-purchase-dark' : 'wb-badge-purchase-light'}>
        <Lock className="w-2.5 h-2.5 2xl:w-3 2xl:h-3" />
        {amount} • PIN
      </span>
    );
  }

  if (actualPolicy === 'ENROLLED') {
    return (
      <span className={isDark ? 'wb-badge-enrolled-dark' : 'wb-badge-enrolled-light'}>
        ENROLLED
      </span>
    );
  }

  return null;
}
