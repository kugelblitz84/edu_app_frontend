import React from 'react';
import { ArticleBlock } from '@/types';

interface ArticleBlockRendererProps {
  block: ArticleBlock;
  sectionTextColor?: string;
}

export const ArticleBlockRenderer: React.FC<ArticleBlockRendererProps> = ({
  block,
  sectionTextColor,
}) => {
  switch (block.type) {
    case 'HEADING': {
      const alignClass = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
        justify: 'text-justify',
      }[block.align || 'left'];

      const sizeClasses = {
        1: 'text-2xl sm:text-3xl font-extrabold tracking-tight mt-6 mb-3',
        2: 'text-xl sm:text-2xl font-bold tracking-tight mt-5 mb-2',
        3: 'text-lg sm:text-xl font-bold mt-4 mb-2',
        4: 'text-base sm:text-lg font-semibold mt-3 mb-1',
      }[block.level || 2];

      const Tag = `h${block.level || 2}` as keyof React.JSX.IntrinsicElements;

      return (
        <Tag
          className={`${sizeClasses} ${alignClass}`}
          style={{ fontFamily: block.fontFamily, color: sectionTextColor }}
        >
          {block.text}
        </Tag>
      );
    }

    case 'PARAGRAPH': {
      const alignClass = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
        justify: 'text-justify',
      }[block.align || 'left'];

      const sizeClasses = {
        sm: 'text-xs sm:text-sm leading-relaxed',
        base: 'text-sm sm:text-base leading-relaxed',
        lg: 'text-base sm:text-lg leading-loose',
      }[block.fontSize || 'base'];

      return (
        <div
          className={`article-rich-content my-2 ${sizeClasses} ${alignClass} max-w-none`}
          style={{
            fontFamily: block.fontFamily,
            color: sectionTextColor || '#3F3F46',
          }}
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      );
    }

    case 'IMAGE': {
      const widthPercent = block.widthPercentage ? `${block.widthPercentage}%` : '100%';
      const aspectClasses = {
        '16:9': 'aspect-video',
        '4:3': 'aspect-[4/3]',
        '1:1': 'aspect-square',
        auto: 'aspect-auto',
      }[block.aspectRatio || 'auto'];

      const placementClass = {
        CONTAINED: 'mx-auto',
        FULL_BLEED: '-mx-4 sm:-mx-8 w-[calc(100%+2rem)] sm:w-[calc(100%+4rem)]',
        FLOAT_LEFT: 'md:float-left md:mr-6 md:mb-4',
        FLOAT_RIGHT: 'md:float-right md:ml-6 md:mb-4',
      }[block.placement || 'CONTAINED'];

      const borderRadius = block.borderRadius !== undefined ? `${block.borderRadius}px` : '12px';

      return (
        <figure className={`my-3 ${placementClass}`} style={{ maxWidth: widthPercent }}>
          <div
            className="overflow-hidden border border-zinc-200/80 bg-zinc-50 shadow-sm"
            style={{ borderRadius }}
          >
            <img
              src={
                block.url ||
                'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200'
              }
              alt={block.altText || ''}
              className={`w-full object-cover transition-transform duration-300 ${aspectClasses}`}
              loading="lazy"
            />
          </div>
          {block.caption && (
            <figcaption className="mt-1.5 text-center text-xs text-zinc-500 italic">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case 'QUOTE': {
      const styleClasses = {
        modern:
          'border-l-4 border-[#6219BD] pl-4 py-2 italic bg-purple-50/40 rounded-r-lg text-zinc-800',
        classic: 'border-l-4 border-zinc-400 pl-4 py-2 font-serif italic text-zinc-700',
        highlight:
          'bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/60 p-5 rounded-2xl text-purple-950 font-medium',
      }[block.style || 'modern'];

      return (
        <blockquote className={`my-4 ${styleClasses}`} style={{ color: sectionTextColor }}>
          <p className="text-sm sm:text-base leading-relaxed">&ldquo;{block.text}&rdquo;</p>
          {block.author && (
            <footer className="mt-2 text-right text-xs font-semibold text-zinc-500 not-italic">
              &mdash; {block.author}
            </footer>
          )}
        </blockquote>
      );
    }

    case 'DIVIDER': {
      const borderClass = {
        solid: 'border-solid',
        dashed: 'border-dashed',
        dotted: 'border-dotted',
      }[block.style || 'solid'];

      return (
        <div className="my-6 w-full">
          <hr className={`border-t border-zinc-200 ${borderClass}`} />
        </div>
      );
    }

    default:
      return null;
  }
};
