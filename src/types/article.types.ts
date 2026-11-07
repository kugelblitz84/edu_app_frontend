// Complete Article contracts matching Articles_API.md and MongoDB schema

export type ArticleFontFamily =
  | 'Inter'
  | 'Roboto'
  | 'Merriweather'
  | 'Playfair Display'
  | 'Fira Code'
  | 'System'
  | string;

export type ArticleTextAlignment = 'left' | 'center' | 'right' | 'justify';

export type SectionLayoutType =
  | 'SINGLE_COLUMN'
  | 'TWO_COLUMN_EQUAL'
  | 'TWO_COLUMN_WIDE_LEFT'
  | 'TWO_COLUMN_WIDE_RIGHT'
  | 'THREE_COLUMN_EQUAL'
  | 'MEDIA_TEXT_SPLIT'
  | 'CUSTOM_GRID';

export interface ArticleTheme {
  baseFont: ArticleFontFamily;
  headingFont: ArticleFontFamily;
  containerWidth: 'normal' | 'wide' | 'narrow';
}

export interface HeadingBlock {
  id: string;
  type: 'HEADING';
  level: 1 | 2 | 3 | 4;
  text: string;
  align?: ArticleTextAlignment;
  fontFamily?: ArticleFontFamily;
}

export interface ParagraphBlock {
  id: string;
  type: 'PARAGRAPH';
  html: string;
  align?: ArticleTextAlignment;
  fontSize?: 'sm' | 'base' | 'lg';
  fontFamily?: ArticleFontFamily;
}

export interface ImageBlock {
  id: string;
  type: 'IMAGE';
  url: string;
  altText?: string;
  caption?: string;
  placement?: 'CONTAINED' | 'FULL_BLEED' | 'FLOAT_LEFT' | 'FLOAT_RIGHT';
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto';
  widthPercentage?: number; // 10 to 100
  borderRadius?: number; // in px
}

export interface QuoteBlock {
  id: string;
  type: 'QUOTE';
  text: string;
  author?: string;
  style?: 'modern' | 'classic' | 'highlight';
}

export interface DividerBlock {
  id: string;
  type: 'DIVIDER';
  style?: 'solid' | 'dashed' | 'dotted';
}

export type ArticleBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | QuoteBlock
  | DividerBlock;

export interface ArticleColumn {
  id: string;
  span: number; // 1 to 12 in a 12-column grid
  blocks: ArticleBlock[];
}

export interface SectionStyle {
  fontFamily?: ArticleFontFamily;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: number; // 0, 1, 2, 4 px
  borderRadius?: number; // 0, 8, 16, 24 px
  marginTop?: number; // 0, 8, 16, 24, 32, 48 px
  marginBottom?: number; // 0, 8, 16, 24, 32, 48 px
  paddingY?: 'none' | 'compact' | 'normal' | 'spacious';
  paddingX?: 'none' | 'compact' | 'normal' | 'spacious';
  columnGap?: 'none' | 'small' | 'normal' | 'large';
  rowGap?: 'none' | 'small' | 'normal' | 'large';
  isContinuousParagraph?: boolean; // Whether section flows seamlessly as part of the same paragraph
}

export interface ArticleSection {
  id: string;
  layout: SectionLayoutType;
  style?: SectionStyle;
  columns?: ArticleColumn[];
  // Backwards compatibility fields:
  blocks?: ArticleBlock[];        // Used when layout is SINGLE_COLUMN in legacy drafts
  columnLeft?: ArticleBlock[];    // Used in legacy two-column drafts
  columnRight?: ArticleBlock[];   // Used in legacy two-column drafts
}

export interface ArticleContentPayload {
  articleId: string;
  version: number;
  theme: ArticleTheme;
  sections: ArticleSection[];
  plainTextSummary?: string;
}

export type ArticleAccessPolicy = 'FREE' | 'PURCHASE';
export type ArticleStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'REJECTED' | 'ARCHIVED';

export interface ArticleSummaryView {
  id: string;
  contentId: string;
  title: string;
  description?: string;
  accessPolicy: ArticleAccessPolicy;
  priceAmountMinor?: number;
  currency?: string;
  status: ArticleStatus;
  tags: string[];
  coverImageUrl?: string;
  authorUsername: string;
  authorFullName?: string;
  createdAt: string;
  publishedAt?: string;
}

export interface ArticleDetailView extends ArticleSummaryView {
  content?: string;
  contentPayload?: ArticleContentPayload;
  previewSnippet?: string;
  access: {
    canAccess: boolean;
    reason?: 'FREE' | 'PIN_REQUIRED' | 'OWNER' | 'UNLOCKED' | 'UNAVAILABLE' | 'SUPER_ADMIN';
    source?: 'OWNER' | 'UNLOCKED';
  };
  rejectReason?: string;
  reviewNotes?: string;
}

export interface CreateArticleDto {
  title: string;
  description?: string;
  coverImageUrl?: string;
  tags?: string[];
  accessPolicy?: ArticleAccessPolicy;
  priceAmountMinor?: number;
  currency?: string;
  pin?: string;
  theme?: ArticleTheme;
  sections?: ArticleSection[];
}

export interface UpdateArticleDto {
  title?: string;
  description?: string;
  coverImageUrl?: string;
  tags?: string[];
  accessPolicy?: ArticleAccessPolicy;
  priceAmountMinor?: number;
  currency?: string;
  pin?: string;
  theme?: ArticleTheme;
  sections?: ArticleSection[];
}
