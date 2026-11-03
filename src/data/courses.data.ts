import { CollectionItem } from '../types';

export const FEATURED_COLLECTIONS: CollectionItem[] = [
  {
    id: 'col-1111-4111-8111-111111111111',
    kind: 'COLLECTION',
    isFeatured: true,
    title: 'Full-Stack System Architecture & NestJS',
    description: 'Master scalable backend systems, modular monoliths, presigned media pipelines, and PostgreSQL concurrency patterns.',
    owner: { id: 'usr-tutor-01', name: 'Arifur Rahman' },
    institution: { id: 'inst-void', name: 'Void Pavilion' },
    accessPolicy: 'FREE',
    status: 'PUBLISHED',
    priceAmountMinor: null,
    currency: null,
    hasPin: false,
    version: 4,
    itemCount: 14,
    duration: '18h 40m',
    accent: 'from-indigo-900 via-purple-900 to-slate-900',
    badgeText: '14 Modules • Video + PDF',
    metadata: {
      author: 'Arifur Rahman',
      tags: ['architecture', 'nestjs', 'typescript', 'featured']
    }
  },
  {
    id: 'col-2222-4222-8222-222222222222',
    kind: 'COLLECTION',
    isFeatured: true,
    title: 'Complete Classical Mechanics & Calculus',
    description: 'Comprehensive university-grade physics collection covering Newtonian dynamics, rotational inertia, and Lagrangian mechanics.',
    owner: { id: 'usr-tutor-02', name: 'Dr. Tanvir Ahmed' },
    institution: { id: 'inst-diu', name: 'Daffodil International University' },
    accessPolicy: 'PURCHASE',
    status: 'PUBLISHED',
    priceAmountMinor: 50000,
    currency: 'BDT',
    hasPin: true,
    version: 6,
    itemCount: 22,
    duration: '24h 15m',
    accent: 'from-violet-950 via-fuchsia-900 to-indigo-950',
    badgeText: '22 Modules • Exam Prep',
    metadata: {
      author: 'Dr. Tanvir Ahmed',
      tags: ['physics', 'mechanics', 'calculus', 'featured']
    }
  },
  {
    id: 'col-3333-4333-8333-333333333333',
    kind: 'COLLECTION',
    isFeatured: true,
    title: 'UI/UX Design Systems & Gestalt Principles',
    description: 'Learn visual hierarchy, Bento grid symmetry, token architecture, and interactive prototyping for modern web applications.',
    owner: { id: 'usr-tutor-03', name: 'Nusrat Jahan' },
    institution: null,
    accessPolicy: 'FREE',
    status: 'PUBLISHED',
    priceAmountMinor: null,
    currency: null,
    hasPin: false,
    version: 2,
    itemCount: 9,
    duration: '11h 20m',
    accent: 'from-purple-900 via-indigo-950 to-slate-900',
    badgeText: '9 Modules • Hands-on Figma',
    metadata: {
      author: 'Nusrat Jahan',
      tags: ['design', 'ui-ux', 'figma', 'featured']
    }
  },
  {
    id: 'col-4444-4444-8444-444444444444',
    kind: 'COLLECTION',
    isFeatured: true,
    title: 'Competitive Programming: Graph & DP',
    description: 'Intensive regional finals preparation featuring shortest paths, network flows, segment trees, and dynamic programming.',
    owner: { id: 'usr-tutor-04', name: 'Mahmudul Hasan' },
    institution: { id: 'inst-ist', name: 'IST University' },
    accessPolicy: 'ENROLLED',
    status: 'PUBLISHED',
    priceAmountMinor: null,
    currency: null,
    hasPin: false,
    version: 5,
    itemCount: 18,
    duration: '30h 00m',
    accent: 'from-slate-900 via-purple-950 to-indigo-900',
    badgeText: '18 Modules • ICPC Track',
    metadata: {
      author: 'Mahmudul Hasan',
      tags: ['algorithms', 'graphs', 'dp', 'featured']
    }
  },
  {
    id: 'col-5555-5555-8555-555555555555',
    kind: 'COLLECTION',
    isFeatured: true,
    title: 'Operating Systems & Linux Kernel Internals',
    description: 'Deep dive into virtual memory, process scheduling, concurrency primitives, and file system implementations.',
    owner: { id: 'usr-tutor-05', name: 'Sadia Islam' },
    institution: { id: 'inst-stamford', name: 'Stamford University' },
    accessPolicy: 'PURCHASE',
    status: 'PUBLISHED',
    priceAmountMinor: 35000,
    currency: 'BDT',
    hasPin: true,
    version: 3,
    itemCount: 12,
    duration: '16h 10m',
    accent: 'from-indigo-950 via-violet-900 to-purple-950',
    badgeText: '12 Modules • Systems Lab',
    metadata: {
      author: 'Sadia Islam',
      tags: ['os', 'linux', 'kernel', 'featured']
    }
  }
];
