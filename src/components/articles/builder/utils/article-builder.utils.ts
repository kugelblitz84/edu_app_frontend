import {
  ArticleSection,
  ArticleColumn,
  ArticleBlock,
  SectionLayoutType,
} from '@/types';

/**
 * Generate a unique ID with an optional prefix
 */
export function generateId(prefix = 'id'): string {
  const timePart = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timePart}-${randomPart}`;
}

/**
 * Normalizes any section (including legacy ones with blocks/columnLeft/columnRight)
 * into a structured multi-column grid representation.
 */
export function normalizeSection(section: ArticleSection): ArticleSection {
  // If modern columns already exist and are valid, use them
  if (section.columns && section.columns.length > 0) {
    // Ensure all columns have ids and blocks
    const normalizedCols = section.columns.map((col, idx) => ({
      id: col.id || `col-${idx}-${generateId('c')}`,
      span: typeof col.span === 'number' && col.span >= 1 && col.span <= 12 ? col.span : 12,
      blocks: Array.isArray(col.blocks) ? col.blocks : [],
    }));
    return {
      ...section,
      columns: normalizedCols,
      style: {
        marginTop: 0,
        marginBottom: 24,
        columnGap: 'normal',
        rowGap: 'normal',
        borderWidth: 0,
        borderRadius: 16,
        isContinuousParagraph: false,
        ...section.style,
      },
    };
  }

  // Legacy fallback: convert layout + blocks/columnLeft/columnRight to columns
  let columns: ArticleColumn[] = [];

  switch (section.layout) {
    case 'TWO_COLUMN_WIDE_LEFT':
      columns = [
        {
          id: generateId('col'),
          span: 8,
          blocks: section.columnLeft || [],
        },
        {
          id: generateId('col'),
          span: 4,
          blocks: section.columnRight || [],
        },
      ];
      break;

    case 'TWO_COLUMN_WIDE_RIGHT':
      columns = [
        {
          id: generateId('col'),
          span: 4,
          blocks: section.columnLeft || [],
        },
        {
          id: generateId('col'),
          span: 8,
          blocks: section.columnRight || [],
        },
      ];
      break;

    case 'TWO_COLUMN_EQUAL':
    case 'MEDIA_TEXT_SPLIT':
      columns = [
        {
          id: generateId('col'),
          span: 6,
          blocks: section.columnLeft || [],
        },
        {
          id: generateId('col'),
          span: 6,
          blocks: section.columnRight || [],
        },
      ];
      break;

    case 'THREE_COLUMN_EQUAL':
      columns = [
        { id: generateId('col'), span: 4, blocks: [] },
        { id: generateId('col'), span: 4, blocks: [] },
        { id: generateId('col'), span: 4, blocks: [] },
      ];
      break;

    case 'SINGLE_COLUMN':
    default:
      columns = [
        {
          id: generateId('col'),
          span: 12,
          blocks: section.blocks || [],
        },
      ];
      break;
  }

  return {
    ...section,
    columns,
    style: {
      marginTop: 0,
      marginBottom: 24,
      columnGap: 'normal',
      rowGap: 'normal',
      borderWidth: 0,
      borderRadius: 16,
      isContinuousParagraph: false,
      ...section.style,
    },
  };
}

/**
 * Creates preset columns for given layout type
 */
export function createColumnsForLayout(layout: SectionLayoutType): ArticleColumn[] {
  switch (layout) {
    case 'SINGLE_COLUMN':
      return [
        {
          id: generateId('col'),
          span: 12,
          blocks: [createDefaultParagraphBlock()],
        },
      ];

    case 'TWO_COLUMN_EQUAL':
      return [
        {
          id: generateId('col'),
          span: 6,
          blocks: [createDefaultParagraphBlock()],
        },
        {
          id: generateId('col'),
          span: 6,
          blocks: [createDefaultParagraphBlock()],
        },
      ];

    case 'TWO_COLUMN_WIDE_LEFT':
      return [
        {
          id: generateId('col'),
          span: 8,
          blocks: [createDefaultParagraphBlock()],
        },
        {
          id: generateId('col'),
          span: 4,
          blocks: [createDefaultParagraphBlock()],
        },
      ];

    case 'TWO_COLUMN_WIDE_RIGHT':
      return [
        {
          id: generateId('col'),
          span: 4,
          blocks: [createDefaultParagraphBlock()],
        },
        {
          id: generateId('col'),
          span: 8,
          blocks: [createDefaultParagraphBlock()],
        },
      ];

    case 'THREE_COLUMN_EQUAL':
      return [
        {
          id: generateId('col'),
          span: 4,
          blocks: [createDefaultParagraphBlock()],
        },
        {
          id: generateId('col'),
          span: 4,
          blocks: [createDefaultParagraphBlock()],
        },
        {
          id: generateId('col'),
          span: 4,
          blocks: [createDefaultParagraphBlock()],
        },
      ];

    case 'MEDIA_TEXT_SPLIT':
      return [
        {
          id: generateId('col'),
          span: 6,
          blocks: [createDefaultImageBlock()],
        },
        {
          id: generateId('col'),
          span: 6,
          blocks: [createDefaultParagraphBlock()],
        },
      ];

    default:
      return [
        {
          id: generateId('col'),
          span: 12,
          blocks: [createDefaultParagraphBlock()],
        },
      ];
  }
}

export function createDefaultParagraphBlock(html = ''): ArticleBlock {
  return {
    id: generateId('blk'),
    type: 'PARAGRAPH',
    html: html || '<p>Start typing your paragraph here...</p>',
    fontSize: 'base',
    align: 'left',
  };
}

export function createDefaultHeadingBlock(text = '', level: 1 | 2 | 3 | 4 = 2): ArticleBlock {
  return {
    id: generateId('blk'),
    type: 'HEADING',
    level,
    text: text || 'Heading Title',
    align: 'left',
  };
}

export function createDefaultImageBlock(url = ''): ArticleBlock {
  return {
    id: generateId('blk'),
    type: 'IMAGE',
    url: url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200',
    caption: 'Figure: Enter your image caption',
    placement: 'CONTAINED',
    aspectRatio: '16:9',
    widthPercentage: 100,
    borderRadius: 12,
  };
}

export function createDefaultQuoteBlock(text = '', author = ''): ArticleBlock {
  return {
    id: generateId('blk'),
    type: 'QUOTE',
    text: text || 'Simplicity is prerequisite for reliability.',
    author: author || 'Edsger W. Dijkstra',
    style: 'highlight',
  };
}

export function createDefaultDividerBlock(): ArticleBlock {
  return {
    id: generateId('blk'),
    type: 'DIVIDER',
    style: 'solid',
  };
}

/**
 * Extracts plain text across all blocks for summarization and validation
 */
export function extractPlainText(sections: ArticleSection[]): string {
  let text = '';
  sections.forEach((sec) => {
    const processBlocks = (blocks?: ArticleBlock[]) => {
      blocks?.forEach((b) => {
        if ('text' in b && b.text) text += ' ' + b.text;
        if ('html' in b && b.html) {
          text += ' ' + b.html.replace(/<[^>]*>/g, ' ');
        }
        if ('caption' in b && b.caption) text += ' ' + b.caption;
      });
    };

    if (sec.columns) {
      sec.columns.forEach((c) => processBlocks(c.blocks));
    }
    processBlocks(sec.blocks);
    processBlocks(sec.columnLeft);
    processBlocks(sec.columnRight);
  });

  return text.trim().replace(/\s+/g, ' ');
}
