import React from 'react';
import { ArticleSection } from '@/types';
import { ArticleBlockRenderer } from './ArticleBlockRenderer';
import { normalizeSection } from '../builder/utils/article-builder.utils';

interface ArticleSectionRendererProps {
  section: ArticleSection;
}

export const ArticleSectionRenderer: React.FC<ArticleSectionRendererProps> = ({
  section: rawSection,
}) => {
  const section = normalizeSection(rawSection);
  const style = section.style || {};

  const isContinuous = !!style.isContinuousParagraph;
  const marginTopVal = isContinuous ? 0 : style.marginTop ?? 0;
  const marginBottomVal = isContinuous ? 8 : style.marginBottom ?? 24;

  const columnGapClass = {
    none: 'gap-x-0',
    small: 'gap-x-4',
    normal: 'gap-x-6',
    large: 'gap-x-10',
  }[style.columnGap || 'normal'];

  const rowGapClass = {
    none: 'space-y-0',
    small: 'space-y-2',
    normal: 'space-y-4',
    large: 'space-y-6',
  }[style.rowGap || 'normal'];

  const paddingYClass = {
    none: 'py-0',
    compact: 'py-2',
    normal: 'py-4',
    spacious: 'py-8',
  }[style.paddingY || 'normal'];

  const paddingXClass = {
    none: 'px-0',
    compact: 'px-2',
    normal: 'px-4',
    spacious: 'px-8',
  }[style.paddingX || 'normal'];

  const columns = section.columns || [];

  return (
    <section
      style={{
        marginTop: `${marginTopVal}px`,
        marginBottom: `${marginBottomVal}px`,
        backgroundColor: style.backgroundColor || undefined,
        borderColor: style.borderColor || undefined,
        borderWidth: style.borderWidth !== undefined ? `${style.borderWidth}px` : undefined,
        borderRadius: style.borderRadius !== undefined ? `${style.borderRadius}px` : '16px',
        color: style.textColor || undefined,
        fontFamily: style.fontFamily ? `${style.fontFamily}, sans-serif` : undefined,
      }}
      className={`w-full transition-colors ${paddingYClass} ${paddingXClass}`}
    >
      <div className={`flex flex-col md:flex-row ${columnGapClass} items-start w-full`}>
        {columns.map((col) => (
          <div
            key={col.id}
            style={{
              flex: `${col.span || 12} ${col.span || 12} 0%`,
              minWidth: 0,
            }}
            className={`w-full min-w-0 ${rowGapClass}`}
          >
            {col.blocks.map((block) => (
              <ArticleBlockRenderer
                key={block.id}
                block={block}
                sectionTextColor={style.textColor}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};
