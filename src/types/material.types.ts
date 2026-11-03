// Contract types bound to Resources_API.md

export type AccessPolicy = 'FREE' | 'OWNER_ONLY' | 'ENROLLED' | 'PURCHASE';

export type MaterialStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED';

export interface MaterialMetadata {
  author?: string;
  tags?: string[];
  externalLink?: string;
}

export interface BaseMaterial {
  id: string;
  kind: 'RESOURCE' | 'COLLECTION';
  type?: 'PDF' | 'VIDEO';
  isStandalone?: boolean;
  isFeatured: boolean;
  title: string;
  description: string | null;
  owner: { id: string; name?: string };
  institution: { id: string; name: string } | null;
  accessPolicy: AccessPolicy;
  status: MaterialStatus;
  priceAmountMinor: number | null;
  currency: string | null;
  hasPin: boolean;
  version: number;
  metadata?: MaterialMetadata | null;
}

export interface CollectionItem extends BaseMaterial {
  kind: 'COLLECTION';
  itemCount: number;
  duration: string;
  accent: string;
  badgeText: string;
  metadata: MaterialMetadata;
}

export interface VideoItem extends BaseMaterial {
  kind: 'RESOURCE';
  type: 'VIDEO';
  isStandalone: boolean;
  duration: string;
  views: string;
  gradient: string;
  metadata: MaterialMetadata;
}

export interface BookItem extends BaseMaterial {
  kind: 'RESOURCE';
  type: 'PDF';
  isStandalone: boolean;
  pages: string;
  spineColor: string;
  coverTint: string;
  metadata: MaterialMetadata;
}

export type MaterialItem = CollectionItem | VideoItem | BookItem;
