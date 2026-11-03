'use client';

import React from 'react';
import { Lock } from 'lucide-react';
import { AccessPolicy } from '@/types';

export interface AccessPolicyBadgeProps {
  item: {
    accessPolicy: AccessPolicy | string;
    priceAmountMinor?: number | null;
  };
  darkBg?: boolean;
}

export function AccessPolicyBadge({ item, darkBg = false }: AccessPolicyBadgeProps) {
  if (item.accessPolicy === 'FREE') {
    return (
      <span className="wb-badge-free">
        FREE
      </span>
    );
  }

  if (item.accessPolicy === 'PURCHASE') {
    const amount = item.priceAmountMinor ? `৳${item.priceAmountMinor / 100}` : 'PIN';
    return (
      <span className={darkBg ? 'wb-badge-purchase-dark' : 'wb-badge-purchase-light'}>
        <Lock className="w-2.5 h-2.5 2xl:w-3 2xl:h-3" />
        {amount} • PIN
      </span>
    );
  }

  if (item.accessPolicy === 'ENROLLED') {
    return (
      <span className={darkBg ? 'wb-badge-enrolled-dark' : 'wb-badge-enrolled-light'}>
        ENROLLED
      </span>
    );
  }

  return null;
}
