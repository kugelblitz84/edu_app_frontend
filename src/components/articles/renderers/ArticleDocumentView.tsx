import React from 'react';
import { ArticleContentPayload } from '@/types';
import { ArticleSectionRenderer } from './ArticleSectionRenderer';

interface ArticleDocumentViewProps {
  payload: ArticleContentPayload;
  title?: string;
  description?: string;
  coverImageUrl?: string;
  tags?: string[];
}

export const ArticleDocumentView: React.FC<ArticleDocumentViewProps> = ({
  payload,
  title,
  description,
  coverImageUrl,
  tags,
}) => {
  const maxWidthClass = {
    narrow: 'max-w-2xl',
    normal: 'max-w-4xl',
    wide: 'max-w-6xl',
  }[payload.theme?.containerWidth || 'normal'];

  const themeStyle: React.CSSProperties = {
    fontFamily: payload.theme?.baseFont ? `${payload.theme.baseFont}, sans-serif` : undefined,
  };

  return (
    <article
      className={`mx-auto w-full px-4 sm:px-6 transition-all ${maxWidthClass}`}
      style={themeStyle}
    >
      {/* Cover Image Banner */}
      {coverImageUrl && (
        <div className="mb-8 overflow-hidden rounded-2xl border border-zinc-200/80 shadow-md">
          <img
            src={coverImageUrl}
            alt={title || 'Article cover'}
            className="w-full aspect-video object-cover"
          />
        </div>
      )}

      {/* Header Info if provided */}
      {(title || description) && (
        <header className="mb-8 border-b border-zinc-100 pb-6 space-y-3">
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-purple-700"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {title && (
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900"
              style={{
                fontFamily: payload.theme?.headingFont
                  ? `${payload.theme.headingFont}, serif`
                  : undefined,
              }}
            >
              {title}
            </h1>
          )}

          {description && (
            <p className="text-base sm:text-lg text-zinc-600 leading-relaxed font-serif">
              {description}
            </p>
          )}
        </header>
      )}

      {/* Document Sections */}
      <div className="divide-y divide-zinc-100/50">
        {payload.sections.map((section) => (
          <ArticleSectionRenderer key={section.id} section={section} />
        ))}
      </div>
    </article>
  );
};
