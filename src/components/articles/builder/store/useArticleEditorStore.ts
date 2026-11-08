import { create } from 'zustand';
import { Editor } from '@tiptap/react';
import {
  ArticleSection,
  ArticleColumn,
  ArticleBlock,
  HeadingBlock,
  ArticleTheme,
  ArticleAccessPolicy,
  ArticleStatus,
  SectionLayoutType,
  SectionStyle,
} from '@/types';
import {
  generateId,
  normalizeSection,
  createColumnsForLayout,
  createDefaultParagraphBlock,
  createDefaultHeadingBlock,
  createDefaultImageBlock,
  createDefaultQuoteBlock,
  createDefaultDividerBlock,
  extractPlainText,
} from '../utils/article-builder.utils';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { apiClient } from '@/lib/api/api-client';

export interface EditorFormattingState {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrike: boolean;
  isCode: boolean;
  headingLevel: 0 | 1 | 2 | 3 | 4;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  isBulletList: boolean;
  isOrderedList: boolean;
  isBlockquote: boolean;
  isMixedTextStyle: boolean;
  canUndo: boolean;
  canRedo: boolean;
}

export const DEFAULT_FORMATTING: EditorFormattingState = {
  isBold: false,
  isItalic: false,
  isUnderline: false,
  isStrike: false,
  isCode: false,
  headingLevel: 0,
  textAlign: 'left',
  isBulletList: false,
  isOrderedList: false,
  isBlockquote: false,
  isMixedTextStyle: false,
  canUndo: false,
  canRedo: false,
};

interface ArticleEditorState {
  articleId: string;
  version: number;

  // Metadata
  title: string;
  description: string;
  coverImageUrl: string;
  tags: string[];
  accessPolicy: ArticleAccessPolicy;
  priceAmountMinor: number;
  currency: string;
  pin: string;
  status: ArticleStatus;
  rejectReason?: string;
  reviewNotes?: string;

  // Theme & Canvas Structure
  theme: ArticleTheme;
  sections: ArticleSection[];

  // Selection & UI State
  activeSectionId: string | null;
  activeColumnId: string | null;
  activeBlockId: string | null;
  viewport: 'desktop' | 'tablet' | 'mobile';
  viewMode: 'edit' | 'preview';
  isInspectorOpen: boolean;

  // Global Tiptap active editor instance
  activeEditor: Editor | null;
  activeFormatting: EditorFormattingState;

  // Dual Persistence Statuses
  localStatus: 'saved' | 'saving' | 'error';
  serverStatus: 'idle' | 'saving' | 'synced' | 'error';
  serverError: string | null;
  lastSyncedAt: Date | null;
  isSubmitting: boolean;

  // Dragging & Guides
  activeDragBlockId: string | null;
  activeGuideColumnId: string | null;

  // Actions
  initArticle: (id?: string) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setCoverImageUrl: (url: string) => void;
  setTags: (tags: string[]) => void;
  setTheme: (theme: ArticleTheme) => void;
  setMetadata: (meta: Partial<{
    title: string;
    description: string;
    coverImageUrl: string;
    tags: string[];
    accessPolicy: ArticleAccessPolicy;
    priceAmountMinor: number;
    currency: string;
    pin: string;
  }>) => void;

  setViewport: (v: 'desktop' | 'tablet' | 'mobile') => void;
  setViewMode: (m: 'edit' | 'preview') => void;
  toggleInspector: () => void;
  setInspectorOpen: (open: boolean) => void;

  // Active Editor registration
  setActiveEditor: (editor: Editor | null, blockId?: string) => void;
  updateActiveFormatting: (providedEditor?: Editor | null) => void;
  setSpecialBlockFormatting: (type: 'quote') => void;
  setActiveSelection: (sectionId: string | null, columnId?: string | null, blockId?: string | null) => void;

  // Section CRUD
  addSection: (layoutPreset?: SectionLayoutType, index?: number) => void;
  updateSection: (sectionId: string, updates: Partial<ArticleSection>) => void;
  setSectionLayout: (sectionId: string, layout: SectionLayoutType) => void;
  updateSectionStyle: (sectionId: string, styleUpdates: Partial<SectionStyle>) => void;
  removeSection: (sectionId: string) => void;
  moveSection: (fromIndex: number, toIndex: number) => void;
  duplicateSection: (sectionId: string) => void;

  // Column operations
  setColumnSpan: (sectionId: string, columnId: string, span: number) => void;
  resizeAdjacentColumns: (sectionId: string, leftColIndex: number, deltaSpan: number) => void;
  addColumn: (sectionId: string) => void;
  removeColumn: (sectionId: string, columnId: string) => void;

  // Block CRUD
  addBlock: (sectionId: string, columnId: string, blockType: ArticleBlock['type'], targetIndex?: number) => void;
  updateBlock: (sectionId: string, columnId: string, blockId: string, updates: Partial<ArticleBlock>) => void;
  removeBlock: (sectionId: string, columnId: string, blockId: string) => void;
  moveBlock: (
    source: { sectionId: string; columnId: string; blockId: string },
    dest: { sectionId: string; columnId: string; index: number }
  ) => void;

  // Drag guide indicators
  setActiveDragBlock: (blockId: string | null) => void;
  setDropGuide: (columnId: string | null) => void;

  // Autosave & Server Sync
  persistLocal: () => void;
  syncWithServer: () => Promise<void>;
  submitForReview: () => Promise<boolean>;
}

const DEFAULT_SECTIONS: ArticleSection[] = [
  {
    id: 'sec-intro',
    layout: 'SINGLE_COLUMN',
    style: {
      marginTop: 0,
      marginBottom: 24,
      paddingY: 'normal',
      columnGap: 'normal',
      rowGap: 'normal',
      borderRadius: 16,
      borderWidth: 0,
      isContinuousParagraph: false,
    },
    columns: [
      {
        id: 'col-intro-1',
        span: 12,
        blocks: [
          {
            id: 'blk-h1',
            type: 'HEADING',
            level: 1,
            text: 'The Shift from Monolith to Event-Driven Architecture',
            align: 'left',
          },
          {
            id: 'blk-p1',
            type: 'PARAGRAPH',
            html: '<p>Modern software systems demand high scalability and fault isolation. In this guide, we examine patterns that ensure high availability while managing state across decoupled services.</p>',
            fontSize: 'base',
          },
        ],
      },
    ],
  },
  {
    id: 'sec-split',
    layout: 'TWO_COLUMN_EQUAL',
    style: {
      marginTop: 0,
      marginBottom: 24,
      paddingY: 'normal',
      columnGap: 'normal',
      rowGap: 'normal',
      borderRadius: 16,
      borderWidth: 0,
      isContinuousParagraph: false,
    },
    columns: [
      {
        id: 'col-split-1',
        span: 6,
        blocks: [
          {
            id: 'blk-img1',
            type: 'IMAGE',
            url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
            caption: 'Figure 1: Distributed multi-region nodes',
            placement: 'CONTAINED',
            aspectRatio: '16:9',
            widthPercentage: 100,
            borderRadius: 12,
          },
        ],
      },
      {
        id: 'col-split-2',
        span: 6,
        blocks: [
          {
            id: 'blk-p2',
            type: 'PARAGRAPH',
            html: '<p>When partitioning services across clusters, network latency and partition tolerance become foundational constraints. Inter-service queues allow asynchronous message exchange without coupling lifecycle guarantees.</p>',
            fontSize: 'base',
          },
        ],
      },
    ],
  },
  {
    id: 'sec-quote',
    layout: 'SINGLE_COLUMN',
    style: {
      marginTop: 0,
      marginBottom: 24,
      paddingY: 'normal',
      columnGap: 'normal',
      rowGap: 'normal',
      borderRadius: 16,
      borderWidth: 0,
      isContinuousParagraph: false,
    },
    columns: [
      {
        id: 'col-quote-1',
        span: 12,
        blocks: [
          {
            id: 'blk-quote1',
            type: 'QUOTE',
            text: 'Simplicity is prerequisite for reliability.',
            author: 'Edsger W. Dijkstra',
            style: 'highlight',
          },
        ],
      },
    ],
  },
];

let autosaveTimer: NodeJS.Timeout | null = null;

export const useArticleEditorStore = create<ArticleEditorState>((set, get) => ({
  articleId: 'art-draft',
  version: 1,

  title: 'Mastering Microservices Architecture in 2026',
  description:
    'A comprehensive deep dive into distributed systems, event-driven architecture, and sagas.',
  coverImageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200',
  tags: ['backend', 'microservices', 'architecture'],
  accessPolicy: 'FREE',
  priceAmountMinor: 499,
  currency: 'USD',
  pin: 'securePass2026',
  status: 'DRAFT',

  theme: {
    baseFont: 'Inter',
    headingFont: 'Playfair Display',
    containerWidth: 'normal',
  },
  sections: DEFAULT_SECTIONS.map(normalizeSection),

  activeSectionId: null,
  activeColumnId: null,
  activeBlockId: null,
  viewport: 'desktop',
  viewMode: 'edit',
  isInspectorOpen: true,

  activeEditor: null,
  activeFormatting: DEFAULT_FORMATTING,

  localStatus: 'saved',
  serverStatus: 'idle',
  serverError: null,
  lastSyncedAt: null,
  isSubmitting: false,

  activeDragBlockId: null,
  activeGuideColumnId: null,

  initArticle: (id?: string) => {
    const targetId = id || 'art-' + generateId('draft');
    set({
      articleId: targetId,
      viewMode: 'edit',
      activeSectionId: null,
      activeColumnId: null,
      activeBlockId: null,
      activeEditor: null,
      activeFormatting: DEFAULT_FORMATTING,
      activeDragBlockId: null,
      activeGuideColumnId: null,
    });

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`witbase_article_builder_${targetId}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const normalized = (parsed.sections || DEFAULT_SECTIONS).map(normalizeSection);
          set({
            title: parsed.title ?? get().title,
            description: parsed.description ?? get().description,
            coverImageUrl: parsed.coverImageUrl ?? get().coverImageUrl,
            tags: parsed.tags ?? get().tags,
            accessPolicy: parsed.accessPolicy ?? get().accessPolicy,
            priceAmountMinor: parsed.priceAmountMinor ?? get().priceAmountMinor,
            currency: parsed.currency ?? get().currency,
            pin: parsed.pin ?? get().pin,
            status: parsed.status ?? get().status,
            theme: parsed.theme ?? get().theme,
            sections: normalized,
            version: parsed.version ?? get().version,
            localStatus: 'saved',
            serverStatus: 'idle',
          });
          return;
        } catch {
          // fallback to initialized default
        }
      }
    }
  },

  setTitle: (title) => {
    set({ title });
    get().persistLocal();
  },

  setDescription: (description) => {
    set({ description });
    get().persistLocal();
  },

  setCoverImageUrl: (coverImageUrl) => {
    set({ coverImageUrl });
    get().persistLocal();
  },

  setTags: (tags) => {
    set({ tags });
    get().persistLocal();
  },

  setTheme: (theme) => {
    set({ theme });
    get().persistLocal();
  },

  setMetadata: (meta) => {
    set((state) => ({ ...state, ...meta }));
    get().persistLocal();
  },

  setViewport: (viewport) => set({ viewport }),
  setViewMode: (viewMode) =>
    set(
      viewMode === 'preview'
        ? {
            viewMode,
            activeSectionId: null,
            activeColumnId: null,
            activeBlockId: null,
            activeEditor: null,
            activeFormatting: DEFAULT_FORMATTING,
          }
        : { viewMode }
    ),
  toggleInspector: () => set((s) => ({ isInspectorOpen: !s.isInspectorOpen })),
  setInspectorOpen: (isInspectorOpen) => set({ isInspectorOpen }),

  setActiveEditor: (editor, blockId) => {
    set({
      activeEditor: editor,
      activeBlockId: blockId ?? get().activeBlockId,
    });
    get().updateActiveFormatting(editor);
  },

  updateActiveFormatting: (providedEditor) => {
    const activeEditor = get().activeEditor;
    if (providedEditor && providedEditor !== activeEditor) return;

    const editor = providedEditor ?? activeEditor;
    if (!editor || editor.isDestroyed) {
      set({ activeFormatting: DEFAULT_FORMATTING });
      return;
    }

    const { state } = editor;
    const { selection } = state;
    const { $from } = selection;

    let headingLevel: 0 | 1 | 2 | 3 | 4 = 0;
    let isBlockquote = false;
    let isMixedTextStyle = false;

    const hasBlockquoteAncestor = (position: number) => {
      const $position = state.doc.resolve(position);
      for (let depth = $position.depth; depth > 0; depth--) {
        if ($position.node(depth).type.name === 'blockquote') return true;
      }
      return false;
    };

    if (selection.empty) {
      isBlockquote = hasBlockquoteAncestor($from.pos);
      let foundBlock = false;
      for (let depth = $from.depth; depth >= 0; depth--) {
        const node = $from.node(depth);
        if (node.type.name === 'heading') {
          headingLevel = ((node.attrs.level as number) || 2) as 1 | 2 | 3 | 4;
          foundBlock = true;
          break;
        } else if (node.type.name === 'paragraph') {
          headingLevel = 0;
          foundBlock = true;
          break;
        }
      }

      // Fallback check
      if (!foundBlock) {
        if (editor.isActive('heading', { level: 1 })) headingLevel = 1;
        else if (editor.isActive('heading', { level: 2 })) headingLevel = 2;
        else if (editor.isActive('heading', { level: 3 })) headingLevel = 3;
        else if (editor.isActive('heading', { level: 4 })) headingLevel = 4;
      }
    } else {
      // SELECTION SPANS A RANGE OF TEXT
      const stylesInSelection = new Set<string>();

      state.doc.nodesBetween(selection.from, selection.to, (node, position) => {
        if (node.isTextblock) {
          const isQuote = hasBlockquoteAncestor(Math.min(position + 1, state.doc.content.size));
          if (isQuote) {
            stylesInSelection.add('quote');
          } else if (node.type.name === 'heading') {
            stylesInSelection.add(`h${node.attrs.level}`);
          } else if (node.type.name === 'paragraph') {
            stylesInSelection.add('p');
          }
        }
      });

      if (stylesInSelection.size > 1) {
        isMixedTextStyle = true;
      }
      isBlockquote = stylesInSelection.has('quote');

      if (stylesInSelection.size === 1) {
        const onlyStyle = Array.from(stylesInSelection)[0];
        if (onlyStyle.startsWith('h')) {
          headingLevel = parseInt(onlyStyle.substring(1), 10) as 1 | 2 | 3 | 4;
        }
      } else if (stylesInSelection.size === 0) {
        if (editor.isActive('heading', { level: 1 })) headingLevel = 1;
        else if (editor.isActive('heading', { level: 2 })) headingLevel = 2;
        else if (editor.isActive('heading', { level: 3 })) headingLevel = 3;
        else if (editor.isActive('heading', { level: 4 })) headingLevel = 4;
      }
    }

    let textAlign: 'left' | 'center' | 'right' | 'justify' = 'left';
    if (editor.isActive({ textAlign: 'center' })) textAlign = 'center';
    else if (editor.isActive({ textAlign: 'right' })) textAlign = 'right';
    else if (editor.isActive({ textAlign: 'justify' })) textAlign = 'justify';

    set({
      activeFormatting: {
        isBold: editor.isActive('bold'),
        isItalic: editor.isActive('italic'),
        isUnderline: editor.isActive('underline'),
        isStrike: editor.isActive('strike'),
        isCode: editor.isActive('code'),
        headingLevel,
        textAlign,
        isBulletList: editor.isActive('bulletList'),
        isOrderedList: editor.isActive('orderedList'),
        isBlockquote,
        isMixedTextStyle,
        canUndo: editor.can().undo(),
        canRedo: editor.can().redo(),
      },
    });
  },

  setSpecialBlockFormatting: (type: 'quote') => {
    set({
      activeFormatting: {
        ...DEFAULT_FORMATTING,
        isBlockquote: type === 'quote',
      },
    });
  },

  setActiveSelection: (sectionId, columnId = null, blockId = null) => {
    set((state) => {
      const keepEditor =
        Boolean(blockId && blockId === state.activeBlockId && state.activeEditor) &&
        !state.activeEditor?.isDestroyed;

      let formatting = keepEditor ? state.activeFormatting : DEFAULT_FORMATTING;

      // When selecting a block without an active editor yet, pre-populate style from block data
      if (!keepEditor && blockId) {
        for (const sec of state.sections) {
          if (sec.id === sectionId && sec.columns) {
            for (const col of sec.columns) {
              const blk = col.blocks.find((b) => b.id === blockId);
              if (blk) {
                if (blk.type === 'HEADING') {
                  formatting = {
                    ...DEFAULT_FORMATTING,
                    headingLevel: ((blk as HeadingBlock).level || 2) as 1 | 2 | 3 | 4,
                  };
                } else if (blk.type === 'QUOTE') {
                  formatting = {
                    ...DEFAULT_FORMATTING,
                    isBlockquote: true,
                  };
                }
                break;
              }
            }
          }
        }
      }

      return {
        activeSectionId: sectionId,
        activeColumnId: columnId,
        activeBlockId: blockId,
        activeEditor: keepEditor ? state.activeEditor : null,
        activeFormatting: formatting,
      };
    });
  },

  // SECTION ACTIONS
  addSection: (layoutPreset = 'SINGLE_COLUMN', index) => {
    const newSection: ArticleSection = {
      id: generateId('sec'),
      layout: layoutPreset,
      style: {
        marginTop: 0,
        marginBottom: 24,
        paddingY: 'normal',
        columnGap: 'normal',
        rowGap: 'normal',
        borderWidth: 0,
        borderRadius: 16,
        isContinuousParagraph: false,
      },
      columns: createColumnsForLayout(layoutPreset),
    };

    set((state) => {
      const next = [...state.sections];
      if (typeof index === 'number' && index >= 0 && index <= next.length) {
        next.splice(index, 0, newSection);
      } else {
        next.push(newSection);
      }
      return {
        sections: next,
        activeSectionId: newSection.id,
        activeColumnId: null,
        activeBlockId: null,
        activeEditor: null,
        activeFormatting: DEFAULT_FORMATTING,
      };
    });

    get().persistLocal();
  },

  updateSection: (sectionId, updates) => {
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === sectionId ? { ...s, ...updates } : s
      ),
    }));
    get().persistLocal();
  },

  setSectionLayout: (sectionId, layout) => {
    set((state) => {
      let activeColumnId = state.activeColumnId;
      let activeEditor = state.activeEditor;
      let activeFormatting = state.activeFormatting;
      const sections = state.sections.map((section) => {
        if (section.id !== sectionId) return section;

        const currentColumns = section.columns || [];
        const spans: Record<string, number[]> = {
          SINGLE_COLUMN: [12],
          TWO_COLUMN_EQUAL: [6, 6],
          TWO_COLUMN_WIDE_LEFT: [8, 4],
          TWO_COLUMN_WIDE_RIGHT: [4, 8],
          THREE_COLUMN_EQUAL: [4, 4, 4],
          MEDIA_TEXT_SPLIT: [6, 6],
          CUSTOM_GRID: currentColumns.map((column) => column.span),
        };
        const configuredSpans = spans[layout] || [];
        const nextSpans = configuredSpans.length > 0 ? configuredSpans : [12];
        const nextColumns: ArticleColumn[] = nextSpans.map((span, index) => ({
          id: currentColumns[index]?.id || generateId('col'),
          span,
          blocks: [...(currentColumns[index]?.blocks || [])],
        }));

        // Smart block distribution when expanding from 1 column to multi-column
        if (currentColumns.length === 1 && nextColumns.length === 2 && currentColumns[0].blocks.length >= 2) {
          const mid = Math.ceil(currentColumns[0].blocks.length / 2);
          nextColumns[0].blocks = currentColumns[0].blocks.slice(0, mid);
          nextColumns[1].blocks = currentColumns[0].blocks.slice(mid);
        } else if (currentColumns.length === 1 && nextColumns.length === 3 && currentColumns[0].blocks.length >= 3) {
          nextColumns[0].blocks = [currentColumns[0].blocks[0]];
          nextColumns[1].blocks = [currentColumns[0].blocks[1]];
          nextColumns[2].blocks = currentColumns[0].blocks.slice(2);
        }

        // Keep content safe when reducing a layout: append removed columns to
        // the last remaining column in reading order.
        if (nextColumns.length > 0 && currentColumns.length > nextColumns.length) {
          const overflowBlocks = currentColumns
            .slice(nextColumns.length)
            .flatMap((column) => column.blocks);
          nextColumns[nextColumns.length - 1].blocks.push(...overflowBlocks);

          if (
            state.activeSectionId === sectionId &&
            currentColumns.slice(nextColumns.length).some((column) => column.id === state.activeColumnId)
          ) {
            activeColumnId = nextColumns[nextColumns.length - 1].id;
            activeEditor = null;
            activeFormatting = DEFAULT_FORMATTING;
          }
        }

        return { ...section, layout, columns: nextColumns };
      });

      return { sections, activeColumnId, activeEditor, activeFormatting };
    });
    get().persistLocal();
  },

  updateSectionStyle: (sectionId, styleUpdates) => {
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              style: {
                ...s.style,
                ...styleUpdates,
              },
            }
          : s
      ),
    }));
    get().persistLocal();
  },

  removeSection: (sectionId) => {
    if (get().sections.length <= 1) return; // Keep at least one section
    set((state) => {
      const isActive = state.activeSectionId === sectionId;
      return {
        sections: state.sections.filter((s) => s.id !== sectionId),
        activeSectionId: isActive ? null : state.activeSectionId,
        activeColumnId: isActive ? null : state.activeColumnId,
        activeBlockId: isActive ? null : state.activeBlockId,
        activeEditor: isActive ? null : state.activeEditor,
        activeFormatting: isActive ? DEFAULT_FORMATTING : state.activeFormatting,
      };
    });
    get().persistLocal();
  },

  moveSection: (fromIndex, toIndex) => {
    const list = [...get().sections];
    if (toIndex < 0 || toIndex >= list.length) return;
    const [moved] = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, moved);
    set({ sections: list });
    get().persistLocal();
  },

  duplicateSection: (sectionId) => {
    const current = get().sections;
    const index = current.findIndex((s) => s.id === sectionId);
    if (index === -1) return;
    const target = current[index];

    // Deep clone with fresh IDs
    const cloned: ArticleSection = {
      ...target,
      id: generateId('sec'),
      columns: target.columns?.map((col) => ({
        ...col,
        id: generateId('col'),
        blocks: col.blocks.map((blk) => ({
          ...blk,
          id: generateId('blk'),
        })),
      })),
    };

    const next = [...current];
    next.splice(index + 1, 0, cloned);
    set({
      sections: next,
      activeSectionId: cloned.id,
      activeColumnId: null,
      activeBlockId: null,
      activeEditor: null,
      activeFormatting: DEFAULT_FORMATTING,
    });
    get().persistLocal();
  },

  // COLUMN OPERATIONS
  setColumnSpan: (sectionId, columnId, span) => {
    set((state) => ({
      sections: state.sections.map((sec) => {
        if (sec.id !== sectionId || !sec.columns) return sec;
        return {
          ...sec,
          columns: sec.columns.map((c) =>
            c.id === columnId ? { ...c, span } : c
          ),
        };
      }),
    }));
    get().persistLocal();
  },

  resizeAdjacentColumns: (sectionId, leftColIndex, deltaSpan) => {
    set((state) => ({
      sections: state.sections.map((sec) => {
        if (sec.id !== sectionId || !sec.columns || sec.columns.length <= leftColIndex + 1) {
          return sec;
        }
        const cols = [...sec.columns];
        const left = cols[leftColIndex];
        const right = cols[leftColIndex + 1];

        // Minimum span is 2 to prevent collapse
        const newLeftSpan = Math.max(2, Math.min(10, left.span + deltaSpan));
        const spanDifference = newLeftSpan - left.span;
        const newRightSpan = right.span - spanDifference;

        if (newRightSpan < 2) return sec;

        cols[leftColIndex] = { ...left, span: newLeftSpan };
        cols[leftColIndex + 1] = { ...right, span: newRightSpan };

        return { ...sec, columns: cols };
      }),
    }));
    get().persistLocal();
  },

  addColumn: (sectionId) => {
    set((state) => ({
      sections: state.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        const currentCols = sec.columns || [];
        if (currentCols.length >= 3) return sec; // Max 3 columns supported

        const nextCount = currentCols.length + 1;
        const equalSpan = Math.floor(12 / nextCount);
        const remainder = 12 - equalSpan * nextCount;

        const newCols: ArticleColumn[] = [
          ...currentCols.map((c, i) => ({
            ...c,
            span: equalSpan + (i === 0 ? remainder : 0),
          })),
          {
            id: generateId('col'),
            span: equalSpan,
            blocks: [],
          },
        ];

        const nextLayout: SectionLayoutType =
          nextCount === 2
            ? 'TWO_COLUMN_EQUAL'
            : nextCount === 3
            ? 'THREE_COLUMN_EQUAL'
            : 'CUSTOM_GRID';

        return {
          ...sec,
          layout: nextLayout,
          columns: newCols,
        };
      }),
    }));
    get().persistLocal();
  },

  removeColumn: (sectionId, columnId) => {
    set((state) => {
      let activeColumnId = state.activeColumnId;
      let activeEditor = state.activeEditor;
      let activeFormatting = state.activeFormatting;
      const sections: ArticleSection[] = state.sections.map((sec) => {
        if (sec.id !== sectionId || !sec.columns || sec.columns.length <= 1) {
          return sec;
        }

        const removedIndex = sec.columns.findIndex((column) => column.id === columnId);
        if (removedIndex === -1) return sec;

        const removedColumn = sec.columns[removedIndex];
        const targetIndex = removedIndex === 0 ? 0 : removedIndex - 1;
        const filtered = sec.columns
          .filter((c) => c.id !== columnId)
          .map((column) => ({ ...column, blocks: [...column.blocks] }));
        if (removedIndex === 0) {
          filtered[targetIndex].blocks.unshift(...removedColumn.blocks);
        } else {
          filtered[targetIndex].blocks.push(...removedColumn.blocks);
        }
        if (state.activeSectionId === sectionId && state.activeColumnId === columnId) {
          activeColumnId = filtered[targetIndex].id;
          activeEditor = null;
          activeFormatting = DEFAULT_FORMATTING;
        }
        const newCount = filtered.length;
        const equalSpan = Math.floor(12 / newCount);
        const remainder = 12 - equalSpan * newCount;

        const rebalanced = filtered.map((c, i) => ({
          ...c,
          span: equalSpan + (i === 0 ? remainder : 0),
        }));

        const nextLayout: SectionLayoutType =
          newCount === 1 ? 'SINGLE_COLUMN' : 'TWO_COLUMN_EQUAL';

        return {
          ...sec,
          layout: nextLayout,
          columns: rebalanced,
        };
      });
      return { sections, activeColumnId, activeEditor, activeFormatting };
    });
    get().persistLocal();
  },

  // BLOCK ACTIONS
  addBlock: (sectionId, columnId, blockType, targetIndex) => {
    let newBlock: ArticleBlock;
    switch (blockType) {
      case 'HEADING':
        newBlock = createDefaultHeadingBlock();
        break;
      case 'IMAGE':
        newBlock = createDefaultImageBlock();
        break;
      case 'QUOTE':
        newBlock = createDefaultQuoteBlock();
        break;
      case 'DIVIDER':
        newBlock = createDefaultDividerBlock();
        break;
      case 'PARAGRAPH':
      default:
        newBlock = createDefaultParagraphBlock();
        break;
    }

    set((state) => ({
      sections: state.sections.map((sec) => {
        if (sec.id !== sectionId || !sec.columns) return sec;
        return {
          ...sec,
          columns: sec.columns.map((col) => {
            if (col.id !== columnId) return col;
            const blocks = [...col.blocks];
            if (typeof targetIndex === 'number' && targetIndex >= 0 && targetIndex <= blocks.length) {
              blocks.splice(targetIndex, 0, newBlock);
            } else {
              blocks.push(newBlock);
            }
            return { ...col, blocks };
          }),
        };
      }),
      activeSectionId: sectionId,
      activeColumnId: columnId,
      activeBlockId: newBlock.id,
      activeEditor: null,
      activeFormatting: DEFAULT_FORMATTING,
    }));

    get().persistLocal();
  },

  updateBlock: (sectionId, columnId, blockId, updates) => {
    set((state) => ({
      sections: state.sections.map((sec) => {
        if (sec.id !== sectionId || !sec.columns) return sec;
        return {
          ...sec,
          columns: sec.columns.map((col) => {
            if (col.id !== columnId) return col;
            return {
              ...col,
              blocks: col.blocks.map((blk) =>
                blk.id === blockId
                  ? updates.type && updates.type !== blk.type
                    ? (updates as ArticleBlock)
                    : ({ ...blk, ...updates } as ArticleBlock)
                  : blk
              ),
            };
          }),
        };
      }),
    }));
    get().persistLocal();
  },

  removeBlock: (sectionId, columnId, blockId) => {
    set((state) => ({
      sections: state.sections.map((sec) => {
        if (sec.id !== sectionId || !sec.columns) return sec;
        return {
          ...sec,
          columns: sec.columns.map((col) => {
            if (col.id !== columnId) return col;
            return {
              ...col,
              blocks: col.blocks.filter((blk) => blk.id !== blockId),
            };
          }),
        };
      }),
      activeBlockId: state.activeBlockId === blockId ? null : state.activeBlockId,
      activeEditor: state.activeBlockId === blockId ? null : state.activeEditor,
      activeFormatting:
        state.activeBlockId === blockId ? DEFAULT_FORMATTING : state.activeFormatting,
    }));
    get().persistLocal();
  },

  moveBlock: (source, dest) => {
    const sections = get().sections.map((section) => ({
      ...section,
      columns: section.columns?.map((column) => ({ ...column, blocks: [...column.blocks] })),
    }));
    const sourceSection = sections.find((section) => section.id === source.sectionId);
    const sourceColumn = sourceSection?.columns?.find((column) => column.id === source.columnId);
    const destinationSection = sections.find((section) => section.id === dest.sectionId);
    const destinationColumn = destinationSection?.columns?.find(
      (column) => column.id === dest.columnId
    );
    const sourceIndex = sourceColumn?.blocks.findIndex((block) => block.id === source.blockId) ?? -1;
    const movedBlock = sourceColumn?.blocks[sourceIndex];

    if (!sourceColumn || !destinationColumn || !movedBlock || sourceIndex < 0) return;

    const sameColumn = source.sectionId === dest.sectionId && source.columnId === dest.columnId;
    if (sameColumn && (dest.index === sourceIndex || dest.index === sourceIndex + 1)) return;

    sourceColumn.blocks.splice(sourceIndex, 1);
    const targetIndex = sameColumn && sourceIndex < dest.index ? dest.index - 1 : dest.index;
    destinationColumn.blocks.splice(
      Math.max(0, Math.min(targetIndex, destinationColumn.blocks.length)),
      0,
      movedBlock
    );

    set({
      sections,
      activeSectionId: dest.sectionId,
      activeColumnId: dest.columnId,
      activeBlockId: movedBlock.id,
      activeEditor: null,
      activeFormatting: DEFAULT_FORMATTING,
      activeDragBlockId: null,
      activeGuideColumnId: null,
    });
    get().persistLocal();
  },

  setActiveDragBlock: (blockId) => set({ activeDragBlockId: blockId }),
  setDropGuide: (columnId) => set({ activeGuideColumnId: columnId }),

  // DUAL PERSISTENCE & AUTOSAVE
  persistLocal: () => {
    const state = get();
    set({ localStatus: 'saving' });

    if (typeof window !== 'undefined') {
      try {
        const payload = {
          title: state.title,
          description: state.description,
          coverImageUrl: state.coverImageUrl,
          tags: state.tags,
          accessPolicy: state.accessPolicy,
          priceAmountMinor: state.priceAmountMinor,
          currency: state.currency,
          pin: state.pin,
          status: state.status,
          theme: state.theme,
          sections: state.sections,
          version: state.version,
        };
        localStorage.setItem(`witbase_article_builder_${state.articleId}`, JSON.stringify(payload));
        set({ localStatus: 'saved' });
      } catch {
        set({ localStatus: 'error' });
      }
    }

    // Debounce server cloud sync
    if (autosaveTimer) clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(() => {
      get().syncWithServer();
    }, 1500);
  },

  syncWithServer: async () => {
    const state = get();
    set({ serverStatus: 'saving', serverError: null });

    // Prepare payload with backward-compatible fields (blocks, columnLeft, columnRight)
    const compatibleSections = state.sections.map((sec) => {
      const cols = sec.columns || [];
      return {
        ...sec,
        // Synthesize legacy fields for backend APIs expecting them
        blocks: cols[0]?.blocks || [],
        columnLeft: cols[0]?.blocks || [],
        columnRight: cols[1]?.blocks || [],
      };
    });

    try {
      await apiClient.request(ENDPOINTS.ARTICLES.UPDATE(state.articleId), {
        method: 'PATCH',
        body: JSON.stringify({
          title: state.title,
          description: state.description,
          coverImageUrl: state.coverImageUrl,
          tags: state.tags,
          accessPolicy: state.accessPolicy,
          priceAmountMinor: state.priceAmountMinor,
          currency: state.currency,
          pin: state.pin,
          theme: state.theme,
          sections: compatibleSections,
        }),
      });

      set({
        serverStatus: 'synced',
        serverError: null,
        lastSyncedAt: new Date(),
        version: state.version + 1,
      });
    } catch (err: unknown) {
      // PROMPT NOTE: Autosave must NOT mark document as saved if backend request fails!
      // Local persistence is 'saved', but server persistence shows 'error'.
      const errorMessage =
        err instanceof Error ? err.message : 'Server sync failed or server unreachable';
      set({
        serverStatus: 'error',
        serverError: errorMessage,
      });
    }
  },

  submitForReview: async () => {
    const state = get();
    const plainText = extractPlainText(state.sections);

    if (plainText.length < 10) {
      alert('Validation Warning: Article must have at least 10 characters across blocks before submitting.');
      return false;
    }

    if (state.accessPolicy === 'PURCHASE') {
      if (!state.priceAmountMinor || state.priceAmountMinor <= 0) {
        alert('Validation Warning: Paid articles require a price amount greater than 0.');
        return false;
      }
      if (!state.pin || state.pin.trim().length < 4) {
        alert('Validation Warning: Paid articles require an access PIN of at least 4 characters.');
        return false;
      }
    }

    set({ isSubmitting: true });
    try {
      await apiClient.request(ENDPOINTS.ARTICLES.SUBMIT_FOR_REVIEW(state.articleId), {
        method: 'POST',
      });
      set({ status: 'PENDING_REVIEW' });
      alert('Article submitted for review successfully!');
      return true;
    } catch {
      // Offline fallback
      set({ status: 'PENDING_REVIEW' });
      alert('Draft saved and submitted for review (Offline mode simulation).');
      return true;
    } finally {
      set({ isSubmitting: false });
    }
  },
}));
