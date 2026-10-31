'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Play,
  FileText,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  FileSpreadsheet,
  ArrowRight,
  Lock,
  Sparkles,
  Eye,
  Grid,
  Code2,
  X,
  Layers
} from 'lucide-react';

// --- CONTRACT TYPES BOUND TO Resources_API.md ---
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

export interface InstitutionItem {
  id: string;
  name: string;
  verified: boolean;
  description: string;
  courses: number;
  exams: number;
  badge: string;
}

export interface UpcomingExamItem {
  id: string;
  title: string;
  timeRemaining: string;
  visibility: string;
}

// --- MOCK DATA BOUND TO MaterialDto CONTRACT ---
const FEATURED_COLLECTIONS: CollectionItem[] = [
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

const FEATURED_VIDEOS: VideoItem[] = [
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

const FEATURED_BOOKS: BookItem[] = [
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

const TOP_INSTITUTIONS: InstitutionItem[] = [
  {
    id: 'inst-void',
    name: 'Void Pavilion',
    verified: true,
    description:
      'A prestigious cultivation institution dedicated to nurturing powerful martial artists and software architects through ancient techniques and elite training.',
    courses: 77,
    exams: 113,
    badge: 'VP'
  },
  {
    id: 'inst-diu',
    name: 'Daffodil International University',
    verified: true,
    description:
      'Leading digital university in Bangladesh offering structured CSE, software engineering, and physics resource collections with verified faculty notes.',
    courses: 77,
    exams: 113,
    badge: 'DIU'
  },
  {
    id: 'inst-stamford',
    name: 'Stamford University',
    verified: true,
    description:
      'Dedicated academic repository featuring peer-reviewed lecture handouts, laboratory manuals, and departmental certification prep tracks.',
    courses: 77,
    exams: 113,
    badge: 'SU'
  },
  {
    id: 'inst-ist',
    name: 'IST University',
    verified: true,
    description:
      'Institute of Science and Technology hub specializing in electronics, competitive programming archives, and engineering problem sets.',
    courses: 77,
    exams: 113,
    badge: 'IST'
  }
];

const UPCOMING_EXAMS: UpcomingExamItem[] = [
  {
    id: 'exam-1',
    title: '2026 Fall CSE Web Development Finals',
    timeRemaining: '12hrs 10mins',
    visibility: 'Private'
  },
  {
    id: 'exam-2',
    title: '2026 Fall Competitive Programming Regional',
    timeRemaining: '12hrs 10mins',
    visibility: 'Public'
  },
  {
    id: 'exam-3',
    title: '2026 Fall Graphic Design Finals',
    timeRemaining: '12hrs 10mins',
    visibility: 'Private'
  }
];

// --- HELPER: FORMAT ACCESS BADGE ---
interface AccessPolicyBadgeProps {
  item: {
    accessPolicy: AccessPolicy | string;
    priceAmountMinor?: number | null;
  };
  darkBg?: boolean;
}

function AccessPolicyBadge({ item, darkBg = false }: AccessPolicyBadgeProps) {
  if (item.accessPolicy === 'FREE') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
        FREE
      </span>
    );
  }
  if (item.accessPolicy === 'PURCHASE') {
    const amount = item.priceAmountMinor ? `৳${item.priceAmountMinor / 100}` : 'PIN';
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
          darkBg
            ? 'bg-amber-400/20 text-amber-200 border border-amber-300/30'
            : 'bg-purple-100 text-purple-800 border border-purple-300'
        }`}
      >
        <Lock className="w-2.5 h-2.5" />
        {amount} • PIN
      </span>
    );
  }
  if (item.accessPolicy === 'ENROLLED') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
          darkBg
            ? 'bg-sky-400/20 text-sky-200 border border-sky-300/30'
            : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
        }`}
      >
        ENROLLED
      </span>
    );
  }
  return null;
}

/**
 * Signature WitBase Notched-Tab Container
 * Recreates the exact geometry from the Figma design:
 * A rounded container where the top-right corner is recessed/notched
 * to house a dark charcoal pill action button.
 */
interface NotchedSectionContainerProps {
  title: string;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  actionLabel: string;
  actionIcon?: 'grid' | 'arrow';
  onActionClick?: () => void;
  bgClass?: string;
  titleColorClass?: string;
  subtitleColorClass?: string;
  pageBgMatch?: string;
  compactHeader?: boolean;
  children: React.ReactNode;
}

function NotchedSectionContainer({
  title,
  subtitle,
  badge,
  actionLabel,
  actionIcon = 'grid',
  onActionClick,
  bgClass = 'bg-[#6219BD]',
  titleColorClass = 'text-white',
  subtitleColorClass = 'text-purple-200/80',
  pageBgMatch = 'bg-[#F6F5FC]',
  compactHeader = false,
  children
}: NotchedSectionContainerProps) {
  return (
    <div className={`relative rounded-[22px] ${bgClass} shadow-sm transition-all duration-300 h-full flex flex-col justify-between`}>
      {/* Top-Right Recessed Notch Cutout */}
      <div
        className={`absolute top-0 right-0 ${pageBgMatch} pl-2.5 pb-2.5 rounded-bl-[18px] z-20 flex items-start justify-end`}
      >
        {/* Top-left inverted fillet curve */}
        <svg
          className="absolute -left-[18px] top-0 w-[18px] h-[18px] pointer-events-none"
          viewBox="0 0 18 18"
          fill="none"
        >
          <path d="M18 0H0C9.94113 0 18 8.05887 18 18V0Z" fill="#F6F5FC" />
        </svg>
        {/* Bottom-right inverted fillet curve */}
        <svg
          className="absolute right-0 -bottom-[18px] w-[18px] h-[18px] pointer-events-none"
          viewBox="0 0 18 18"
          fill="none"
        >
          <path d="M18 0H0C9.94113 0 18 8.05887 18 18V0Z" fill="#F6F5FC" />
        </svg>

        <button
          onClick={onActionClick}
          className={`bg-[#141418] hover:bg-[#272730] active:scale-[0.98] text-white font-medium rounded-[11px] flex items-center gap-1 shadow-sm transition-all cursor-pointer whitespace-nowrap ${
            compactHeader ? 'text-[10px] px-2.5 py-1.5' : 'text-[11px] px-3.5 py-2'
          }`}
        >
          {actionIcon === 'grid' ? (
            <LayoutGrid className="w-3 h-3 text-white fill-white/80 shrink-0" />
          ) : null}
          <span>{actionLabel}</span>
          {actionIcon === 'arrow' ? <ArrowRight className="w-3 h-3 shrink-0" /> : null}
        </button>
      </div>

      {/* Main Content Area */}
      <div className={`${compactHeader ? 'p-3 pt-3' : 'p-4 pt-3.5'} flex-1 flex flex-col justify-between`}>
        {/* Header Row */}
        <div className={`flex items-center justify-between ${compactHeader ? 'pr-24 mb-2.5' : 'pr-36 mb-3'}`}>
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <h2
              className={`${
                compactHeader ? 'text-xs font-semibold truncate' : 'text-sm sm:text-[15px] font-medium'
              } tracking-tight ${titleColorClass}`}
              title={title}
            >
              {title}
            </h2>
            {badge && (
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-black/10 text-current opacity-90 whitespace-nowrap">
                {badge}
              </span>
            )}
            {subtitle && (
              <span className={`text-[11px] hidden xl:inline ${subtitleColorClass}`}>
                — {subtitle}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between">{children}</div>
      </div>
    </div>
  );
}

export default function App() {
  // UI Modes: 'rich' (populated educational UI) vs 'wireframe' (clean grey geometric blocks like screenshot)
  const [viewMode, setViewMode] = useState('rich');
  const [showSymmetryGrid, setShowSymmetryGrid] = useState(false);

  // Top nav filter & search state
  const [accessFilter, setAccessFilter] = useState('ALL');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Tier 1: Featured Courses Carousel index
  const [activeCourseIdx, setActiveCourseIdx] = useState(1);

  // Tier 2: Featured Videos active spotlight index
  const [activeVideoIdx] = useState(0);

  // Tier 3: Top Institutions active spotlight index
  const [activeInstitutionIdx, setActiveInstitutionIdx] = useState(0);

  // Interactive API Contract Inspector Modal
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialItem | null>(null);

  // Filter logic for search / access policy
  const filteredVideos = useMemo(() => {
    return FEATURED_VIDEOS.filter((v) => {
      const matchesPolicy = accessFilter === 'ALL' || v.accessPolicy === accessFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.metadata?.author?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPolicy && matchesSearch;
    });
  }, [accessFilter, searchQuery]);

  const filteredBooks = useMemo(() => {
    return FEATURED_BOOKS.filter((b) => {
      const matchesPolicy = accessFilter === 'ALL' || b.accessPolicy === accessFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.metadata?.author?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPolicy && matchesSearch;
    });
  }, [accessFilter, searchQuery]);

  // Carousel helpers for Featured Courses
  const totalCourses = FEATURED_COLLECTIONS.length;
  const prevCourseIdx = (activeCourseIdx - 1 + totalCourses) % totalCourses;
  const nextCourseIdx = (activeCourseIdx + 1) % totalCourses;

  const handlePrevCourse = () => {
    setActiveCourseIdx((prev) => (prev - 1 + totalCourses) % totalCourses);
  };

  const handleNextCourse = () => {
    setActiveCourseIdx((prev) => (prev + 1) % totalCourses);
  };

  // Spotlight + Side Stack for Featured Videos
  const spotlightVideo = filteredVideos[activeVideoIdx] || FEATURED_VIDEOS[0];

  // Spotlight + Side Stack for Top Institutions
  const spotlightInstitution = TOP_INSTITUTIONS[activeInstitutionIdx] || TOP_INSTITUTIONS[0];
  const sideInstitutions = TOP_INSTITUTIONS.filter((_, idx) => idx !== activeInstitutionIdx);

  return (
    <div className="min-h-screen bg-[#F6F5FC] text-zinc-900 font-sans pb-16 relative overflow-x-hidden selection:bg-purple-200 selection:text-purple-950">
      {/* Optional 40% / 40% / 20% (10-Column: 4 : 4 : 2) Visual Hierarchy & Symmetry Overlay */}
      {showSymmetryGrid && (
        <div className="pointer-events-none fixed inset-0 z-40 max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-10 gap-3.5 h-full">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div
                key={idx}
                className="h-full bg-rose-500/[0.06] border-x border-rose-500/20 flex flex-col justify-between py-2 items-center text-[10px] font-mono text-rose-600 font-semibold"
              >
                <span>{idx + 1}/10</span>
                {idx === 1 && (
                  <span className="bg-rose-600 text-white px-2 py-0.5 rounded shadow text-[9px] whitespace-nowrap">
                    40% Videos (2fr)
                  </span>
                )}
                {idx === 5 && (
                  <span className="bg-rose-600 text-white px-2 py-0.5 rounded shadow text-[9px] whitespace-nowrap">
                    40% Books (2fr)
                  </span>
                )}
                {idx === 8 && (
                  <span className="bg-rose-600 text-white px-2 py-0.5 rounded shadow text-[9px] whitespace-nowrap">
                    20% Exams (1fr)
                  </span>
                )}
                <span>{(idx + 1) * 10}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Centered Container (Compact Vertical Rhythm) */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 pt-3.5 space-y-4">
        {/* =====================================================================
            TIER 1: TOP NAVIGATION BAR (Compact floating gradient pill)
           ===================================================================== */}
        <header className="rounded-[16px] bg-gradient-to-r from-[#DDD9F7] via-[#E8E6F5] to-[#E5E5EA] px-4 py-2 shadow-[0_4px_20px_-4px_rgba(98,25,189,0.08)] border border-white/80 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Pixel Logo + Free Contents Filter */}
          <div className="flex items-center gap-6 sm:gap-8">
            <a
              href="#top"
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-1.5 select-none group"
            >
              <span
                className="text-lg sm:text-xl font-bold tracking-wider text-[#6219BD]"
                style={{
                  fontFamily: '"Courier New", Courier, monospace',
                  letterSpacing: '0.08em',
                  textShadow: '1px 1px 0px rgba(98, 25, 189, 0.25)'
                }}
              >
                Wit<span className="text-[#3F3D56]">Base</span>
              </span>
            </a>

            {/* Interactive Access Policy Dropdown */}
            <div className="relative">
              <button
                onClick={() => setFilterDropdownOpen((o) => !o)}
                className="flex items-center gap-1.5 text-xs font-medium text-[#27272A] hover:text-[#6219BD] transition-colors py-1 px-2 rounded-lg hover:bg-white/50 cursor-pointer"
              >
                <span>
                  {accessFilter === 'ALL'
                    ? 'Free Contents'
                    : accessFilter === 'FREE'
                    ? 'Free Only'
                    : accessFilter === 'PURCHASE'
                    ? 'PIN / Purchase'
                    : 'Enrolled Only'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-75" />
              </button>

              {filterDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-xl bg-white shadow-xl border border-purple-100 py-1.5 z-50 text-xs">
                  <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    Filter by accessPolicy
                  </div>
                  {[
                    { id: 'ALL', label: 'All Featured Contents' },
                    { id: 'FREE', label: 'FREE (Instant Access)' },
                    { id: 'PURCHASE', label: 'PURCHASE (PIN Unlock)' },
                    { id: 'ENROLLED', label: 'ENROLLED (Institution)' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setAccessFilter(opt.id);
                        setFilterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-purple-50 transition-colors ${
                        accessFilter === opt.id ? 'text-[#6219BD] font-semibold bg-purple-50/60' : 'text-zinc-700'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {accessFilter === opt.id && <CheckCircle2 className="w-3.5 h-3.5 text-[#6219BD]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center: Pill Search Input */}
          <div className="flex-1 max-w-md mx-auto min-w-[200px]">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for anything"
                className="w-full bg-[#F8F8FA] hover:bg-white focus:bg-white text-xs text-zinc-800 placeholder-zinc-400 pl-9 pr-8 py-2 rounded-full border border-zinc-200/80 focus:outline-none focus:ring-2 focus:ring-[#6219BD]/30 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right: Login & Sign up Pills */}
          <div className="flex items-center gap-2">
            <button className="bg-[#673DE6] hover:bg-[#5B21B6] text-white text-xs font-medium px-5 py-2 rounded-[10px] shadow-sm transition-all cursor-pointer active:scale-95">
              Login
            </button>
            <button className="bg-[#1F1F23] hover:bg-[#27272F] text-white text-xs font-medium px-5 py-2 rounded-[10px] shadow-sm transition-all cursor-pointer active:scale-95">
              Sign up
            </button>
          </div>
        </header>

        {/* =====================================================================
            TIER 2: FEATURED COURSES CAROUSEL (Compact ~225px Height)
           ===================================================================== */}
        <section aria-label="Featured Courses">
          <NotchedSectionContainer
            title="Featured Courses"
            subtitle={
              viewMode === 'rich'
                ? 'Curated Resource Collections (GET /resource-collections?featured=true)'
                : null
            }
            actionLabel="Explore Courses"
            actionIcon="grid"
            bgClass="bg-gradient-to-br from-[#6528D7] via-[#6219BD] to-[#4E129E]"
            titleColorClass="text-white"
            subtitleColorClass="text-purple-200/75"
            onActionClick={() => setSelectedMaterial(FEATURED_COLLECTIONS[activeCourseIdx])}
          >
            {/* Compact 3-Card Symmetric Coverflow Stage */}
            <div className="relative flex items-center justify-between gap-3 sm:gap-4 pb-2 px-1 sm:px-2">
              {/* Left Chevron Button */}
              <button
                onClick={handlePrevCourse}
                aria-label="Previous Featured Course"
                className="w-8 h-8 rounded-full hover:bg-white/15 flex items-center justify-center text-white/90 hover:text-white transition-all cursor-pointer shrink-0"
              >
                <ChevronLeft className="w-6 h-6 stroke-[1.75]" />
              </button>

              {/* Left Preview Card */}
              <div
                onClick={handlePrevCourse}
                className="hidden md:flex flex-col justify-between w-[27%] h-[135px] rounded-[12px] overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.01] group select-none shadow-md"
              >
                {viewMode === 'wireframe' ? (
                  <div className="w-full h-full bg-[#D9DBD9]" />
                ) : (
                  <div
                    className={`w-full h-full bg-gradient-to-br ${FEATURED_COLLECTIONS[prevCourseIdx].accent} p-3.5 flex flex-col justify-between relative border border-white/15 opacity-85 group-hover:opacity-100`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] font-medium px-2 py-0.5 rounded bg-white/10 text-purple-100">
                        {FEATURED_COLLECTIONS[prevCourseIdx].badgeText}
                      </span>
                      <AccessPolicyBadge item={FEATURED_COLLECTIONS[prevCourseIdx]} darkBg />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-white line-clamp-2 group-hover:text-purple-200 transition-colors">
                        {FEATURED_COLLECTIONS[prevCourseIdx].title}
                      </h3>
                      <p className="text-[10px] text-purple-200/70 mt-0.5">
                        By {FEATURED_COLLECTIONS[prevCourseIdx].metadata.author}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Center Active Spotlight Card */}
              <div
                onClick={() => setSelectedMaterial(FEATURED_COLLECTIONS[activeCourseIdx])}
                className="flex-1 max-w-[430px] h-[175px] rounded-[14px] overflow-hidden cursor-pointer transition-all duration-300 shadow-xl group relative"
              >
                {viewMode === 'wireframe' ? (
                  <div className="w-full h-full bg-[#D9DBD9]" />
                ) : (
                  <div
                    className={`w-full h-full bg-gradient-to-br ${FEATURED_COLLECTIONS[activeCourseIdx].accent} p-4 flex flex-col justify-between relative border border-white/25`}
                  >
                    <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-purple-400/15 blur-2xl pointer-events-none" />
                    <div className="absolute right-3 bottom-8 opacity-10 pointer-events-none">
                      <Layers className="w-20 h-20 text-white" />
                    </div>

                    {/* Top Row Badges */}
                    <div className="flex items-center justify-between gap-2 relative z-10">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-white/15 text-white backdrop-blur-sm">
                          <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                          COLLECTION
                        </span>
                        <span className="text-[10px] text-purple-200/90">
                          {FEATURED_COLLECTIONS[activeCourseIdx].itemCount} Modules • {FEATURED_COLLECTIONS[activeCourseIdx].duration}
                        </span>
                      </div>
                      <AccessPolicyBadge item={FEATURED_COLLECTIONS[activeCourseIdx]} darkBg />
                    </div>

                    {/* Center Title & Description */}
                    <div className="relative z-10 my-auto">
                      <h3 className="text-sm sm:text-base font-bold text-white leading-snug group-hover:text-purple-100 transition-colors line-clamp-1">
                        {FEATURED_COLLECTIONS[activeCourseIdx].title}
                      </h3>
                      <p className="text-[11px] text-purple-100/80 line-clamp-2 mt-1 leading-relaxed">
                        {FEATURED_COLLECTIONS[activeCourseIdx].description}
                      </p>
                    </div>

                    {/* Bottom Author & Action Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/15 relative z-10">
                      <div className="text-[11px] text-purple-100 truncate pr-2">
                        <span className="opacity-70">By </span>
                        <span className="font-semibold text-white">
                          {FEATURED_COLLECTIONS[activeCourseIdx].metadata.author}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white text-[#4E129E] px-2.5 py-1 rounded-md group-hover:bg-purple-100 transition-colors shadow shrink-0">
                        Open
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Preview Card */}
              <div
                onClick={handleNextCourse}
                className="hidden md:flex flex-col justify-between w-[27%] h-[135px] rounded-[12px] overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.01] group select-none shadow-md"
              >
                {viewMode === 'wireframe' ? (
                  <div className="w-full h-full bg-[#D9DBD9]" />
                ) : (
                  <div
                    className={`w-full h-full bg-gradient-to-br ${FEATURED_COLLECTIONS[nextCourseIdx].accent} p-3.5 flex flex-col justify-between relative border border-white/15 opacity-85 group-hover:opacity-100`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] font-medium px-2 py-0.5 rounded bg-white/10 text-purple-100">
                        {FEATURED_COLLECTIONS[nextCourseIdx].badgeText}
                      </span>
                      <AccessPolicyBadge item={FEATURED_COLLECTIONS[nextCourseIdx]} darkBg />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-white line-clamp-2 group-hover:text-purple-200 transition-colors">
                        {FEATURED_COLLECTIONS[nextCourseIdx].title}
                      </h3>
                      <p className="text-[10px] text-purple-200/70 mt-0.5">
                        By {FEATURED_COLLECTIONS[nextCourseIdx].metadata.author}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Chevron Button */}
              <button
                onClick={handleNextCourse}
                aria-label="Next Featured Course"
                className="w-8 h-8 rounded-full hover:bg-white/15 flex items-center justify-center text-white/90 hover:text-white transition-all cursor-pointer shrink-0"
              >
                <ChevronRight className="w-6 h-6 stroke-[1.75]" />
              </button>
            </div>

            {/* Bottom Pagination Indicator (`o o o [===] o o o`) */}
            <div className="flex items-center justify-center gap-1.5">
              {FEATURED_COLLECTIONS.map((col, idx) => {
                const isActive = idx === activeCourseIdx;
                return (
                  <button
                    key={col.id}
                    onClick={() => setActiveCourseIdx(idx)}
                    aria-label={`Slide ${idx + 1}`}
                    className={`transition-all cursor-pointer rounded-full ${
                      isActive
                        ? 'w-12 h-2 bg-[#D9DBD9] shadow-sm'
                        : 'w-1.5 h-1.5 border border-white/60 bg-transparent hover:bg-white/40'
                    }`}
                  />
                );
              })}
            </div>
          </NotchedSectionContainer>
        </section>

        {/* =====================================================================
            TIER 3: SIDE-BY-SIDE 40% / 40% / 20% BENTO ROW (10-Col Grid: 4 : 4 : 2)
            Col 1-4 (40%): Featured Videos | Col 5-8 (40%): Featured Books | Col 9-10 (20%): Upcoming Exams
           ===================================================================== */}
        <section
          aria-label="Featured Videos, Featured Books, and Upcoming Certification Exams"
          className="grid grid-cols-1 md:grid-cols-10 gap-3.5 items-stretch"
        >
          {/* -------------------------------------------------------------------
              COLUMN 1 (40% WIDTH / 4 OF 10 COLS): FEATURED VIDEOS (`type: 'VIDEO'`)
             ------------------------------------------------------------------- */}
          <div className="md:col-span-4 flex flex-col">
            <NotchedSectionContainer
              title="Featured Videos"
              badge={showSymmetryGrid ? '40% • VIDEO' : null}
              actionLabel="Explore Videos"
              actionIcon="grid"
              bgClass="bg-[#E6E1FA]"
              titleColorClass="text-[#18181B]"
              onActionClick={() => setSelectedMaterial(spotlightVideo)}
            >
              <div className="flex flex-col gap-2">
                {(filteredVideos.length > 0 ? filteredVideos : FEATURED_VIDEOS)
                  .slice(0, 3)
                  .map((vid) => (
                    <div
                      key={vid.id}
                      onClick={() => setSelectedMaterial(vid)}
                      className="bg-[#181722] hover:bg-[#232131] text-white rounded-[12px] p-2.5 flex items-center gap-3.5 shadow-xs transition-all cursor-pointer group h-[68px]"
                    >
                      {/* Spacious 16:9 Widescreen Video Thumbnail */}
                      <div className="w-24 h-13 rounded-[8px] overflow-hidden shrink-0 relative bg-[#D9DBD9] shadow-inner">
                        {viewMode === 'wireframe' ? (
                          <div className="w-full h-full bg-[#D9DBD9] flex items-center justify-center">
                            <Play className="w-4 h-4 text-zinc-500" />
                          </div>
                        ) : (
                          <div
                            className={`w-full h-full bg-gradient-to-br ${vid.gradient} flex items-center justify-center relative`}
                          >
                            <div className="w-6 h-6 rounded-full bg-white/95 text-[#6219BD] flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                              <Play className="w-3 h-3 fill-current ml-0.5" />
                            </div>
                            <span className="absolute bottom-1 right-1 bg-black/80 text-[8px] font-mono px-1.5 py-0.2 rounded text-white">
                              {vid.duration}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Rich Video Metadata utilizing the 40% width */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-xs sm:text-[13px] font-medium text-white group-hover:text-purple-200 transition-colors truncate">
                            {vid.title}
                          </h3>
                        </div>

                        <div className="flex items-center flex-wrap gap-2 mt-1.5">
                          <span className="text-[10px] text-zinc-300 font-medium truncate">
                            {vid.metadata?.author}
                          </span>
                          <span className="text-zinc-600 text-[10px]">•</span>
                          <AccessPolicyBadge item={vid} darkBg />
                          {vid.metadata?.tags?.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="hidden sm:inline-block text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-purple-200/90"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Watch Action Pill */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="hidden sm:inline-block text-[10px] font-medium text-purple-200/80 group-hover:text-white transition-colors">
                          Watch
                        </span>
                        <div className="w-6 h-6 rounded-full bg-white text-[#181722] group-hover:bg-purple-300 flex items-center justify-center transition-colors">
                          <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                      </div>
                    </div>
                  ))}

                {/* Bottom Chevron for symmetry across all 3 columns */}
                <button
                  onClick={() => setSelectedMaterial(spotlightVideo)}
                  aria-label="More featured videos"
                  className="mx-auto mt-0.5 text-indigo-950/70 hover:text-indigo-950 transition-colors cursor-pointer"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </NotchedSectionContainer>
          </div>

          {/* -------------------------------------------------------------------
              COLUMN 2 (40% WIDTH / 4 OF 10 COLS): FEATURED BOOKS (`type: 'PDF'`)
             ------------------------------------------------------------------- */}
          <div className="md:col-span-4 flex flex-col">
            <NotchedSectionContainer
              title="Featured Books"
              badge={showSymmetryGrid ? '40% • PDF' : null}
              actionLabel="Explore Books"
              actionIcon="grid"
              bgClass="bg-[#EFECE4]"
              titleColorClass="text-[#18181B]"
              onActionClick={() => setSelectedMaterial(FEATURED_BOOKS[0])}
            >
              <div className="flex flex-col gap-2">
                {(filteredBooks.length > 0 ? filteredBooks : FEATURED_BOOKS)
                  .slice(0, 3)
                  .map((book) => (
                    <div
                      key={book.id}
                      onClick={() => setSelectedMaterial(book)}
                      className="bg-white/95 hover:bg-white rounded-[12px] p-2.5 flex items-center gap-3.5 shadow-xs hover:shadow border border-stone-200/80 hover:border-[#6219BD]/40 transition-all cursor-pointer group h-[68px]"
                    >
                      {/* 3:4 Portrait Book Spine & Cover */}
                      <div className="w-11 h-13 rounded-[5px] overflow-hidden shrink-0 relative shadow-xs flex">
                        {viewMode === 'wireframe' ? (
                          <div className="w-full h-full bg-[#D9DBD9]" />
                        ) : (
                          <>
                            <div className={`w-1.5 h-full ${book.spineColor} shrink-0`} />
                            <div
                              className={`flex-1 h-full bg-gradient-to-b ${book.coverTint} p-1 flex flex-col justify-between text-white`}
                            >
                              <span className="text-[7px] font-mono uppercase text-white/90 bg-black/35 px-1 rounded w-fit">
                                PDF
                              </span>
                              <BookOpen className="w-3.5 h-3.5 text-white/90 mx-auto my-auto group-hover:scale-110 transition-transform" />
                            </div>
                          </>
                        )}
                      </div>

                      {/* Rich Book Metadata utilizing the 40% width */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs sm:text-[13px] font-medium text-zinc-900 group-hover:text-[#6219BD] transition-colors truncate">
                          {book.title}
                        </h3>
                        <div className="flex items-center flex-wrap gap-2 mt-1.5">
                          <span className="text-[10px] text-zinc-600 font-medium truncate">
                            {book.metadata?.author}
                          </span>
                          <span className="text-zinc-300 text-[10px]">•</span>
                          <span className="text-[10px] text-zinc-500">{book.pages}</span>
                          <AccessPolicyBadge item={book} darkBg={false} />
                          {book.metadata?.tags?.slice(0, 1).map((tag) => (
                            <span
                              key={tag}
                              className="hidden xl:inline-block text-[9px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Read PDF Action Pill */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMaterial(book);
                        }}
                        className="bg-[#09090B] hover:bg-[#6219BD] text-white text-[10px] font-medium px-3 py-1.5 rounded-[7px] shrink-0 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Read</span>
                      </button>
                    </div>
                  ))}

                {/* Bottom Chevron for symmetry */}
                <button
                  onClick={() => setSelectedMaterial(FEATURED_BOOKS[0])}
                  aria-label="More featured books"
                  className="mx-auto mt-0.5 text-zinc-700 hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </NotchedSectionContainer>
          </div>

          {/* -------------------------------------------------------------------
              COLUMN 3 (20% WIDTH / 2 OF 10 COLS): UPCOMING CERTIFICATION EXAMS
              Tailored compact cards designed specifically for the 20% width column
             ------------------------------------------------------------------- */}
          <div className="md:col-span-2 flex flex-col">
            <NotchedSectionContainer
              title="Upcoming Exams"
              badge={showSymmetryGrid ? '20%' : null}
              actionLabel="Visit Gym"
              actionIcon="arrow"
              bgClass="bg-[#DFC184]"
              titleColorClass="text-[#18181B]"
              compactHeader={true}
              onActionClick={() => {}}
            >
              <div className="flex flex-col gap-2">
                {UPCOMING_EXAMS.map((exam) => (
                  <div
                    key={exam.id}
                    className="bg-gradient-to-r from-white via-[#F9F8FF] to-white rounded-[11px] px-2.5 py-2 flex flex-col justify-between shadow-xs border border-white/90 h-[68px]"
                  >
                    {/* Top Row: Exam Title + Visibility Pill */}
                    <div className="flex items-start justify-between gap-1.5">
                      <h4
                        className="text-[11px] font-semibold text-zinc-900 leading-tight line-clamp-1"
                        title={exam.title}
                      >
                        {exam.title}
                      </h4>
                      <span className="bg-[#7C3AED] text-white text-[8px] font-medium px-1.5 py-0.5 rounded-full shrink-0 leading-none">
                        {exam.visibility}
                      </span>
                    </div>

                    {/* Bottom Row: Compact Red Timer + Dark Register Button */}
                    <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-zinc-100">
                      <span className="text-[9px] font-semibold text-rose-600 truncate">
                        ⏳ {exam.timeRemaining}
                      </span>

                      <button className="bg-[#09090B] hover:bg-[#6219BD] text-white text-[9px] font-medium px-2 py-1 rounded-[5px] shrink-0 transition-colors cursor-pointer leading-none">
                        Register
                      </button>
                    </div>
                  </div>
                ))}

                {/* Bottom Expand Chevron matching screenshot */}
                <button
                  aria-label="Show more exams"
                  className="mx-auto mt-0.5 text-zinc-900/80 hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </NotchedSectionContainer>
          </div>
        </section>

        {/* =====================================================================
            TIER 4: TOP INSTITUTIONS (Sleek Full-Width Horizontal Strip)
            Left 5 Cols: Spotlight Institution ('Void Pavilion')
            Right 7 Cols: 3-Column Horizontal Grid of Partner Universities
           ===================================================================== */}
        <section aria-label="Top Institutions">
          <NotchedSectionContainer
            title="Top Institutions"
            badge={showSymmetryGrid ? '12 Cols • 5:7 Horizontal Strip' : null}
            actionLabel="Explore Institutions"
            actionIcon="grid"
            bgClass="bg-[#EAE7E1]"
            titleColorClass="text-[#18181B]"
            onActionClick={() => {}}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
              {/* Left 5 Cols: Compact Horizontal Spotlight Institution Card */}
              <div className="lg:col-span-5 bg-[#1B1A23] text-white rounded-[14px] p-3.5 flex flex-col justify-between shadow-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-14 h-14 rounded-[10px] bg-[#D9DBD9] shrink-0 flex items-center justify-center text-zinc-700 font-bold text-sm shadow-inner">
                    {viewMode === 'wireframe' ? null : spotlightInstitution.badge}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-normal tracking-tight text-white truncate">
                        {spotlightInstitution.name}
                      </h3>
                      <span className="inline-flex items-center gap-1 bg-white text-zinc-900 text-[10px] font-medium px-2 py-0.5 rounded-full shadow-xs">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 fill-emerald-500/20" />
                        <span>Verified</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-300 line-clamp-2 mt-1 leading-relaxed font-light">
                      {spotlightInstitution.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-white/10">
                  <div className="flex items-center gap-4 text-[11px] text-zinc-300">
                    <span className="inline-flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-white" />
                      {spotlightInstitution.courses} Courses
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-white" />
                      {spotlightInstitution.exams} Exams
                    </span>
                  </div>

                  <button className="bg-[#09090B] hover:bg-[#6219BD] text-white text-[11px] font-medium px-3.5 py-1.5 rounded-[8px] inline-flex items-center gap-1.5 transition-colors cursor-pointer">
                    <span>Visit</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Right 7 Cols: 3 Partner Institutions in a Horizontal 3-Column Row */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {sideInstitutions.map((inst) => {
                  const realIdx = TOP_INSTITUTIONS.findIndex((i) => i.id === inst.id);
                  return (
                    <div
                      key={inst.id}
                      onClick={() => setActiveInstitutionIdx(realIdx)}
                      className="bg-[#1B1A23] hover:bg-[#252430] text-white rounded-[14px] p-3.5 flex flex-col justify-between cursor-pointer group transition-all shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        {/* Square Grey Avatar with Green Check Badge */}
                        <div className="relative w-11 h-11 rounded-[9px] bg-[#D9DBD9] shrink-0 flex items-center justify-center text-zinc-700 font-bold text-xs">
                          {viewMode === 'wireframe' ? null : inst.badge}
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                          </span>
                        </div>

                        {/* Right Circular Chevron */}
                        <div className="w-6 h-6 rounded-full bg-white text-[#1B1A23] group-hover:bg-purple-300 flex items-center justify-center shrink-0 transition-colors">
                          <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                      </div>

                      <div className="mt-2.5">
                        <h4 className="text-xs sm:text-[13px] font-normal text-white group-hover:text-purple-200 line-clamp-1">
                          {inst.name}
                        </h4>
                        <div className="flex items-center gap-3 text-[10px] text-zinc-300 mt-1.5">
                          <span className="inline-flex items-center gap-1">
                            <GraduationCap className="w-3 h-3 text-white" />
                            {inst.courses} Courses
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <FileSpreadsheet className="w-3 h-3 text-white" />
                            {inst.exams} Exams
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </NotchedSectionContainer>
        </section>
      </div>

      {/* =====================================================================
          FLOATING DESIGN & API INSPECTOR TOOLBAR (Bottom Right)
          Allows toggling Rich UI vs. Clean Figma Wireframe + 12-Col Grid Lines
         ===================================================================== */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-wrap items-center gap-2 bg-[#18181C]/95 backdrop-blur-md text-white p-2 rounded-2xl shadow-2xl border border-white/15 text-xs">
        <span className="px-2.5 py-1 text-[11px] font-semibold text-purple-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Design Controls:
        </span>

        {/* Toggle Rich vs Wireframe */}
        <button
          onClick={() => setViewMode((m) => (m === 'rich' ? 'wireframe' : 'rich'))}
          className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            viewMode === 'wireframe'
              ? 'bg-[#6B2CF5] text-white'
              : 'bg-white/10 hover:bg-white/20 text-zinc-200'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{viewMode === 'rich' ? 'Switch to Wireframe' : 'Showing Wireframe'}</span>
        </button>

        {/* Toggle 40/40/20 Symmetry Overlay */}
        <button
          onClick={() => setShowSymmetryGrid((g) => !g)}
          className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            showSymmetryGrid
              ? 'bg-rose-600 text-white'
              : 'bg-white/10 hover:bg-white/20 text-zinc-200'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>40 / 40 / 20 Grid</span>
        </button>
      </div>

      {/* =====================================================================
          MATERIAL DTO API CONTRACT PREVIEW MODAL
          Shows how clicking any Featured Course, Video, or Book maps to `/api/v1`
         ===================================================================== */}
      {selectedMaterial && (
        <div
          onClick={() => setSelectedMaterial(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-purple-100 space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-[#6219BD]">
                    {selectedMaterial.kind}
                    {selectedMaterial.type ? ` • ${selectedMaterial.type}` : ''}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                    isFeatured: true
                  </span>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mt-1.5">
                  {selectedMaterial.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMaterial(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              {selectedMaterial.description}
            </p>

            {/* Endpoint Call Breakdown */}
            <div className="bg-zinc-950 text-zinc-100 rounded-xl p-3.5 font-mono text-[11px] space-y-2 overflow-x-auto">
              <div className="flex items-center justify-between text-zinc-400 text-[10px]">
                <span className="flex items-center gap-1">
                  <Code2 className="w-3.5 h-3.5 text-purple-400" />
                  Resources API Integration
                </span>
                <span>200 OK</span>
              </div>
              <div className="text-emerald-400">
                {selectedMaterial.kind === 'COLLECTION'
                  ? 'GET /api/v1/resource-collections?featured=true'
                  : `GET /api/v1/resources?type=${selectedMaterial.type}&featured=true`}
              </div>
              <pre className="text-[10px] text-purple-200 leading-relaxed">
                {JSON.stringify(
                  {
                    id: selectedMaterial.id,
                    kind: selectedMaterial.kind,
                    ...(selectedMaterial.type ? { type: selectedMaterial.type } : {}),
                    ...(selectedMaterial.isStandalone !== undefined
                      ? { isStandalone: selectedMaterial.isStandalone }
                      : {}),
                    isFeatured: true,
                    title: selectedMaterial.title,
                    accessPolicy: selectedMaterial.accessPolicy,
                    status: 'PUBLISHED',
                    priceAmountMinor: selectedMaterial.priceAmountMinor,
                    currency: selectedMaterial.currency,
                    hasPin: selectedMaterial.hasPin,
                    version: selectedMaterial.version,
                    metadata: selectedMaterial.metadata
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-zinc-500">
                Access Policy: <strong className="text-zinc-800">{selectedMaterial.accessPolicy}</strong>
              </span>
              <button
                onClick={() => setSelectedMaterial(null)}
                className="bg-[#6219BD] hover:bg-[#4E129E] text-white text-xs font-medium px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}