// Contract types bound to Resources_API.md and FRONTEND_DESIGN_DOCUMENT.md

export type AccessPolicy = 'FREE' | 'OWNER_ONLY' | 'ENROLLED' | 'PURCHASE';

export type MaterialStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED';

export interface MaterialMetadata {
  author?: string;
  tags?: string[];
  externalLink?: string;
  publishedAt?: string;
  readingTimeMinutes?: number;
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

export interface CollectionCurriculumItem {
  id: string;
  resourceId: string;
  title: string;
  type: 'VIDEO' | 'PDF';
  duration?: string;
  pages?: string;
  position: number;
  isCompleted?: boolean;
}

export interface CollectionItem extends BaseMaterial {
  kind: 'COLLECTION';
  itemCount: number;
  duration: string;
  accent: string;
  badgeText: string;
  metadata: MaterialMetadata;
  items?: CollectionCurriculumItem[];
}

export interface VideoItem extends BaseMaterial {
  kind: 'RESOURCE';
  type: 'VIDEO';
  isStandalone: boolean;
  duration: string;
  views: string;
  gradient: string;
  metadata: MaterialMetadata;
  videoUrl?: string;
}

export interface BookItem extends BaseMaterial {
  kind: 'RESOURCE';
  type: 'PDF';
  isStandalone: boolean;
  pages: string;
  spineColor: string;
  coverTint: string;
  metadata: MaterialMetadata;
  pdfUrl?: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    id: string;
    name: string;
    role: string;
    avatarUrl?: string;
  };
  category: string;
  tags: string[];
  accessPolicy: AccessPolicy;
  hasPin: boolean;
  publishedAt: string;
  readTime: string;
  likes: number;
  views: number;
}

export type MaterialItem = CollectionItem | VideoItem | BookItem;
