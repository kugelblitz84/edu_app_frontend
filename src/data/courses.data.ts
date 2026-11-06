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
    itemCount: 6,
    duration: '18h 40m',
    accent: 'from-indigo-900 via-purple-900 to-slate-900',
    badgeText: '6 Modules • Video + PDF',
    metadata: {
      author: 'Arifur Rahman',
      tags: ['architecture', 'nestjs', 'typescript', 'featured']
    },
    items: [
      {
        id: 'item-1',
        resourceId: 'vid-2020-4020-8020-202020202020',
        title: '01. PostgreSQL MVCC & Optimistic Locking Deep Dive',
        type: 'VIDEO',
        duration: '19:40',
        position: 1,
        isCompleted: true
      },
      {
        id: 'item-2',
        resourceId: 'pdf-3333-4333-8333-333333333333',
        title: '02. Database Concurrency & Isolation Levels Architecture Notes',
        type: 'PDF',
        pages: '28 pages',
        position: 2,
        isCompleted: true
      },
      {
        id: 'item-3',
        resourceId: 'vid-3030-4030-8030-303030303030',
        title: '03. Direct-to-Storage Upload Pipeline with Pre-signed URLs',
        type: 'VIDEO',
        duration: '34:10',
        position: 3,
        isCompleted: false
      },
      {
        id: 'item-4',
        resourceId: 'vid-4040-4040-8040-404040404040',
        title: '04. Building Realtime WebSocket Gateways with Socket.IO',
        type: 'VIDEO',
        duration: '22:15',
        position: 4,
        isCompleted: false
      },
      {
        id: 'item-5',
        resourceId: 'pdf-5555-4555-8555-555555555555',
        title: '05. High-Throughput Microservice Security Checklist',
        type: 'PDF',
        pages: '16 pages',
        position: 5,
        isCompleted: false
      },
      {
        id: 'item-6',
        resourceId: 'vid-1010-4010-8010-101010101010',
        title: '06. Production Deployment & Horizontal Scaling on Kubernetes',
        type: 'VIDEO',
        duration: '45:00',
        position: 6,
        isCompleted: false
      }
    ]
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
    itemCount: 5,
    duration: '24h 15m',
    accent: 'from-violet-950 via-fuchsia-900 to-indigo-950',
    badgeText: '5 Modules • Exam Prep',
    metadata: {
      author: 'Dr. Tanvir Ahmed',
      tags: ['physics', 'mechanics', 'calculus', 'featured']
    },
    items: [
      {
        id: 'c2-item-1',
        resourceId: 'pdf-3333-4333-8333-333333333333',
        title: '01. Classical Mechanics Lecture Notes & Free-Body Diagrams',
        type: 'PDF',
        pages: '142 pages',
        position: 1,
        isCompleted: true
      },
      {
        id: 'c2-item-2',
        resourceId: 'vid-1010-4010-8010-101010101010',
        title: '02. Vector Calculus for Three-Dimensional Kinematics',
        type: 'VIDEO',
        duration: '28:15',
        position: 2,
        isCompleted: false
      },
      {
        id: 'c2-item-3',
        resourceId: 'vid-2020-4020-8020-202020202020',
        title: '03. Rotational Dynamics & Moment of Inertia Calculations',
        type: 'VIDEO',
        duration: '31:50',
        position: 3,
        isCompleted: false
      },
      {
        id: 'c2-item-4',
        resourceId: 'pdf-4444-4444-8444-444444444444',
        title: '04. Harmonic Motion & Oscillators Worked Problem Set',
        type: 'PDF',
        pages: '45 pages',
        position: 4,
        isCompleted: false
      },
      {
        id: 'c2-item-5',
        resourceId: 'vid-4040-4040-8040-404040404040',
        title: '05. Lagrangian Formalism & Generalized Coordinates',
        type: 'VIDEO',
        duration: '42:10',
        position: 5,
        isCompleted: false
      }
    ]
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
    itemCount: 4,
    duration: '11h 20m',
    accent: 'from-purple-900 via-indigo-950 to-slate-900',
    badgeText: '4 Modules • Hands-on Figma',
    metadata: {
      author: 'Nusrat Jahan',
      tags: ['design', 'ui-ux', 'figma', 'featured']
    },
    items: [
      {
        id: 'c3-item-1',
        resourceId: 'vid-3030-4030-8030-303030303030',
        title: '01. Modern Token Architecture & Tailwind v4 Custom Tokens',
        type: 'VIDEO',
        duration: '25:30',
        position: 1,
        isCompleted: true
      },
      {
        id: 'c3-item-2',
        resourceId: 'pdf-5555-4555-8555-555555555555',
        title: '02. Bento Grid Design Guidelines & Symmetry Specification',
        type: 'PDF',
        pages: '36 pages',
        position: 2,
        isCompleted: false
      },
      {
        id: 'c3-item-3',
        resourceId: 'vid-1010-4010-8010-101010101010',
        title: '03. Micro-Interactions and Spring Physics in Web UI',
        type: 'VIDEO',
        duration: '38:00',
        position: 3,
        isCompleted: false
      },
      {
        id: 'c3-item-4',
        resourceId: 'pdf-4444-4444-8444-444444444444',
        title: '04. Design Systems Evaluation & Audit Checklist',
        type: 'PDF',
        pages: '22 pages',
        position: 4,
        isCompleted: false
      }
    ]
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
    itemCount: 4,
    duration: '30h 00m',
    accent: 'from-slate-900 via-purple-950 to-indigo-900',
    badgeText: '4 Modules • ICPC Track',
    metadata: {
      author: 'Mahmudul Hasan',
      tags: ['algorithms', 'graphs', 'dp', 'featured']
    },
    items: [
      {
        id: 'c4-item-1',
        resourceId: 'vid-1010-4010-8010-101010101010',
        title: '01. Graph Theory: Dijkstra & A* Search Visualized in 3D',
        type: 'VIDEO',
        duration: '28:15',
        position: 1,
        isCompleted: true
      },
      {
        id: 'c4-item-2',
        resourceId: 'pdf-4444-4444-8444-444444444444',
        title: '02. Discrete Mathematics & Logic Handout',
        type: 'PDF',
        pages: '96 pages',
        position: 2,
        isCompleted: false
      },
      {
        id: 'c4-item-3',
        resourceId: 'vid-2020-4020-8020-202020202020',
        title: '03. Max Flow & Min Cut with Dinic Algorithm',
        type: 'VIDEO',
        duration: '40:20',
        position: 3,
        isCompleted: false
      },
      {
        id: 'c4-item-4',
        resourceId: 'pdf-3333-4333-8333-333333333333',
        title: '04. Advanced Tree DP and Heavy-Light Decomposition Reference',
        type: 'PDF',
        pages: '54 pages',
        position: 4,
        isCompleted: false
      }
    ]
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
    itemCount: 4,
    duration: '16h 10m',
    accent: 'from-indigo-950 via-violet-900 to-purple-950',
    badgeText: '4 Modules • Systems Lab',
    metadata: {
      author: 'Sadia Islam',
      tags: ['os', 'linux', 'kernel', 'featured']
    },
    items: [
      {
        id: 'c5-item-1',
        resourceId: 'vid-4040-4040-8040-404040404040',
        title: '01. Linux Virtual Memory & Page Tables Walkthrough',
        type: 'VIDEO',
        duration: '32:15',
        position: 1,
        isCompleted: true
      },
      {
        id: 'c5-item-2',
        resourceId: 'pdf-5555-4555-8555-555555555555',
        title: '02. Linux Kernel Architecture Lab Manual',
        type: 'PDF',
        pages: '78 pages',
        position: 2,
        isCompleted: false
      },
      {
        id: 'c5-item-3',
        resourceId: 'vid-2020-4020-8020-202020202020',
        title: '03. Process Scheduling: Completely Fair Scheduler (CFS)',
        type: 'VIDEO',
        duration: '27:45',
        position: 3,
        isCompleted: false
      },
      {
        id: 'c5-item-4',
        resourceId: 'pdf-3333-4333-8333-333333333333',
        title: '04. Concurrency Primitives: Mutexes, Spinlocks & RCU Notes',
        type: 'PDF',
        pages: '42 pages',
        position: 4,
        isCompleted: false
      }
    ]
  }
];
