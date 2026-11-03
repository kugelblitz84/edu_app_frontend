import { BookItem } from '../types';

export const FEATURED_BOOKS: BookItem[] = [
  {
    id: 'pdf-3333-4333-8333-333333333333',
    kind: 'RESOURCE',
    type: 'PDF',
    isStandalone: true,
    isFeatured: true,
    title: 'Physics Notes: Classical Mechanics',
    description: 'Complete illustrated lecture handbook with 85 worked problems and free-body diagrams.',
    owner: { id: 'usr-b1' },
    institution: null,
    accessPolicy: 'FREE',
    status: 'PUBLISHED',
    priceAmountMinor: null,
    currency: null,
    hasPin: false,
    version: 3,
    pages: '142 pages',
    spineColor: 'bg-purple-800',
    coverTint: 'from-purple-900 via-indigo-950 to-slate-900',
    metadata: {
      author: 'Dr. Tanvir Ahmed',
      tags: ['physics', 'mechanics', 'notes']
    }
  },
  {
    id: 'pdf-4444-4444-8444-444444444444',
    kind: 'RESOURCE',
    type: 'PDF',
    isStandalone: true,
    isFeatured: true,
    title: 'Discrete Mathematics & Logic Handout',
    description: 'Set theory, combinatorics, recurrence relations, and formal proof templates for CSE.',
    owner: { id: 'usr-b2' },
    institution: { id: 'inst-diu', name: 'Daffodil Intl. University' },
    accessPolicy: 'FREE',
    status: 'PUBLISHED',
    priceAmountMinor: null,
    currency: null,
    hasPin: false,
    version: 2,
    pages: '96 pages',
    spineColor: 'bg-emerald-800',
    coverTint: 'from-emerald-950 via-teal-900 to-slate-900',
    metadata: {
      author: 'Prof. Rafiqul Islam',
      tags: ['math', 'discrete', 'cse']
    }
  },
  {
    id: 'pdf-5555-4555-8555-555555555555',
    kind: 'RESOURCE',
    type: 'PDF',
    isStandalone: true,
    isFeatured: true,
    title: 'System Design Interview & API Blueprint',
    description: 'Reference handbook on rate limiters, presigned uploads, caching layers, and sharding.',
    owner: { id: 'usr-b3' },
    institution: null,
    accessPolicy: 'PURCHASE',
    status: 'PUBLISHED',
    priceAmountMinor: 15000,
    currency: 'BDT',
    hasPin: true,
    version: 5,
    pages: '188 pages',
    spineColor: 'bg-amber-700',
    coverTint: 'from-amber-950 via-stone-900 to-zinc-900',
    metadata: {
      author: 'Arifur Rahman',
      tags: ['system-design', 'backend', 'handbook']
    }
  },
  {
    id: 'pdf-6666-4666-8666-666666666666',
    kind: 'RESOURCE',
    type: 'PDF',
    isStandalone: true,
    isFeatured: true,
    title: 'Linear Algebra & Matrix Calculus Guide',
    description: 'Eigenvalues, SVD, vector spaces, and gradients tailored for machine learning foundations.',
    owner: { id: 'usr-b4' },
    institution: { id: 'inst-void', name: 'Void Pavilion' },
    accessPolicy: 'ENROLLED',
    status: 'PUBLISHED',
    priceAmountMinor: null,
    currency: null,
    hasPin: false,
    version: 1,
    pages: '114 pages',
    spineColor: 'bg-indigo-800',
    coverTint: 'from-indigo-950 via-blue-950 to-slate-900',
    metadata: {
      author: 'Sadia Islam',
      tags: ['linear-algebra', 'ml', 'math']
    }
  }
];
