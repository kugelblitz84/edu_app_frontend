import { User, VideoItem, BookItem } from '../types';

export const CURRENT_DEMO_USER: User = {
  id: 'usr-student-01',
  username: 'fahim_learner',
  fullName: 'Abrar Fahim',
  email: 'abrar.fahim@witbase.edu',
  role: 'STUDENT',
  avatarUrl: null,
  institutionId: 'inst-void',
  institutionName: 'Void Pavilion',
  bio: 'Computer Science & Engineering undergraduate focusing on distributed systems, React 19, and competitive programming.',
  createdAt: '2025-08-15T00:00:00Z'
};

export const USER_LIBRARY_DRAFTS: (VideoItem | BookItem)[] = [
  {
    id: 'draft-res-01',
    kind: 'RESOURCE',
    type: 'PDF',
    isStandalone: true,
    isFeatured: false,
    title: 'Computer Networks: TCP Congestion Control Summary',
    description: 'Draft notes covering Reno, Vegas, and BBR congestion algorithms with flow graphs.',
    owner: { id: 'usr-student-01', name: 'Abrar Fahim' },
    institution: { id: 'inst-void', name: 'Void Pavilion' },
    accessPolicy: 'FREE',
    status: 'DRAFT',
    priceAmountMinor: null,
    currency: null,
    hasPin: false,
    version: 1,
    pages: '14 pages',
    spineColor: 'bg-indigo-700',
    coverTint: 'from-indigo-900 to-slate-900',
    metadata: {
      author: 'Abrar Fahim',
      tags: ['networking', 'tcp', 'draft']
    }
  },
  {
    id: 'draft-res-02',
    kind: 'RESOURCE',
    type: 'VIDEO',
    isStandalone: true,
    isFeatured: false,
    title: 'Visualizing Dijkstra in Three Dimensions (Draft Cut)',
    description: 'Work-in-progress screen recording explaining 3D heap node expansions.',
    owner: { id: 'usr-student-01', name: 'Abrar Fahim' },
    institution: null,
    accessPolicy: 'PURCHASE',
    status: 'DRAFT',
    priceAmountMinor: 10000,
    currency: 'BDT',
    hasPin: true,
    version: 2,
    duration: '15:20',
    views: '0 views',
    gradient: 'from-violet-900 to-purple-950',
    metadata: {
      author: 'Abrar Fahim',
      tags: ['algorithms', 'draft']
    }
  }
];

export const USER_PUBLISHED_ITEMS: (VideoItem | BookItem)[] = [
  {
    id: 'pub-res-01',
    kind: 'RESOURCE',
    type: 'PDF',
    isStandalone: true,
    isFeatured: true,
    title: 'System Design Interview Cheat Sheet v2',
    description: 'Essential calculations, latency numbers every engineer should know, and CAP theorem trade-offs.',
    owner: { id: 'usr-student-01', name: 'Abrar Fahim' },
    institution: { id: 'inst-void', name: 'Void Pavilion' },
    accessPolicy: 'FREE',
    status: 'PUBLISHED',
    priceAmountMinor: null,
    currency: null,
    hasPin: false,
    version: 3,
    pages: '32 pages',
    spineColor: 'bg-purple-900',
    coverTint: 'from-purple-900 via-indigo-950 to-slate-900',
    metadata: {
      author: 'Abrar Fahim',
      tags: ['system-design', 'interview', 'notes']
    }
  }
];

