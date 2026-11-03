import { VideoItem } from '../types';

export const FEATURED_VIDEOS: VideoItem[] = [
  {
    id: 'vid-1010-4010-8010-101010101010',
    kind: 'RESOURCE',
    type: 'VIDEO',
    isStandalone: true,
    isFeatured: true,
    title: 'Graph Theory: Dijkstra & A* Search Visualized in 3D',
    description: 'Step-by-step visual intuition behind priority queues, edge relaxation, and heuristic pathfinding in weighted graphs.',
    owner: { id: 'usr-v1' },
    institution: { id: 'inst-void', name: 'Void Pavilion' },
    accessPolicy: 'FREE',
    status: 'PUBLISHED',
    priceAmountMinor: null,
    currency: null,
    hasPin: false,
    version: 3,
    duration: '28:15',
    views: '4.2k learners',
    gradient: 'from-indigo-950 via-purple-900 to-violet-800',
    metadata: {
      author: 'Farhan Sadiq',
      tags: ['algorithms', 'graphs', 'visualization']
    }
  },
  {
    id: 'vid-2020-4020-8020-202020202020',
    kind: 'RESOURCE',
    type: 'VIDEO',
    isStandalone: true,
    isFeatured: true,
    title: 'PostgreSQL MVCC & Optimistic Locking Explained',
    description: 'Why version columns prevent lost updates in high-concurrency web APIs.',
    owner: { id: 'usr-v2' },
    institution: null,
    accessPolicy: 'FREE',
    status: 'PUBLISHED',
    priceAmountMinor: null,
    currency: null,
    hasPin: false,
    version: 2,
    duration: '19:40',
    views: '2.8k learners',
    gradient: 'from-slate-900 via-indigo-950 to-purple-900',
    metadata: {
      author: 'Arifur Rahman',
      tags: ['database', 'postgresql', 'backend']
    }
  },
  {
    id: 'vid-3030-4030-8030-303030303030',
    kind: 'RESOURCE',
    type: 'VIDEO',
    isStandalone: true,
    isFeatured: true,
    title: 'Electromagnetic Induction & Maxwell Equations',
    description: 'Animated breakdown of Faraday’s law and magnetic flux linkage for engineering finals.',
    owner: { id: 'usr-v3' },
    institution: { id: 'inst-diu', name: 'Daffodil Intl. University' },
    accessPolicy: 'PURCHASE',
    status: 'PUBLISHED',
    priceAmountMinor: 15000,
    currency: 'BDT',
    hasPin: true,
    version: 4,
    duration: '34:50',
    views: '1.9k learners',
    gradient: 'from-violet-950 via-fuchsia-950 to-slate-900',
    metadata: {
      author: 'Dr. Tanvir Ahmed',
      tags: ['physics', 'electromagnetism']
    }
  },
  {
    id: 'vid-4040-4040-8040-404040404040',
    kind: 'RESOURCE',
    type: 'VIDEO',
    isStandalone: true,
    isFeatured: true,
    title: 'Dynamic Programming on Trees: Masterclass',
    description: 'Solving subtree aggregates and rerooting DP techniques with live dry-runs.',
    owner: { id: 'usr-v4' },
    institution: { id: 'inst-ist', name: 'IST University' },
    accessPolicy: 'ENROLLED',
    status: 'PUBLISHED',
    priceAmountMinor: null,
    currency: null,
    hasPin: false,
    version: 1,
    duration: '42:10',
    views: '3.1k learners',
    gradient: 'from-purple-950 via-indigo-900 to-slate-900',
    metadata: {
      author: 'Mahmudul Hasan',
      tags: ['cp', 'trees', 'dp']
    }
  }
];
