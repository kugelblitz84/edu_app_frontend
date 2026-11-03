'use client';

import React from 'react';
import { BookOpen, FileText, ChevronDown } from 'lucide-react';
import { BookItem } from '@/types';
import { NotchedSectionContainer } from './NotchedSectionContainer';
import { AccessPolicyBadge } from './AccessPolicyBadge';

interface FeaturedBooksSectionProps {
  books: BookItem[];
  viewMode: 'rich' | 'wireframe';
  showSymmetryGrid?: boolean;
  onSelectBook: (book: BookItem) => void;
}

export function FeaturedBooksSection({
  books,
  viewMode,
  showSymmetryGrid = false,
  onSelectBook
}: FeaturedBooksSectionProps) {
  const displayBooks = books.slice(0, 3);
  const spotlightBook = displayBooks[0] || books[0];

  return (
    <div className="wb-bento-book-col">
      <NotchedSectionContainer
        title="Featured Books"
        badge={showSymmetryGrid ? '40% • PDF' : null}
        actionLabel="Explore Books"
        actionIcon="grid"
        bgClass="bg-[#EFECE4]"
        titleColorClass="text-[#18181B]"
        onActionClick={() => spotlightBook && onSelectBook(spotlightBook)}
      >
        <div className="flex flex-col gap-2 2xl:gap-2.5">
          {displayBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => onSelectBook(book)}
              className="wb-book-card group"
            >
              {/* 3:4 Portrait Book Spine & Cover */}
              <div className="w-10 h-11 sm:w-11 sm:h-13 xl:w-12 xl:h-[58px] 2xl:w-[50px] 2xl:h-[66px] rounded-[5px] 2xl:rounded-[7px] overflow-hidden shrink-0 relative shadow-xs flex">
                {viewMode === 'wireframe' ? (
                  <div className="w-full h-full bg-[#D9DBD9]" />
                ) : (
                  <>
                    <div className={`w-1.5 2xl:w-2 h-full ${book.spineColor} shrink-0`} />
                    <div
                      className={`flex-1 h-full bg-gradient-to-b ${book.coverTint} p-1 flex flex-col justify-between text-white`}
                    >
                      <span className="text-[7px] 2xl:text-[8px] font-mono uppercase text-white/90 bg-black/35 px-1 rounded w-fit">
                        PDF
                      </span>
                      <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 2xl:w-4 2xl:h-4 text-white/90 mx-auto my-auto group-hover:scale-110 transition-transform" />
                    </div>
                  </>
                )}
              </div>

              {/* Rich Book Metadata */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xs sm:text-[13px] 2xl:text-[14px] font-medium text-zinc-900 group-hover:text-[#6219BD] transition-colors truncate">
                  {book.title}
                </h3>
                <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 2xl:gap-2.5 mt-1 sm:mt-1.5">
                  <span className="text-[10px] 2xl:text-[11px] text-zinc-600 font-medium truncate">
                    {book.metadata?.author}
                  </span>
                  <span className="text-zinc-300 text-[10px] 2xl:text-[11px]">•</span>
                  <span className="text-[10px] 2xl:text-[11px] text-zinc-500">{book.pages}</span>
                  <AccessPolicyBadge item={book} darkBg={false} />
                  {book.metadata?.tags?.slice(0, 1).map((tag) => (
                    <span
                      key={tag}
                      className="hidden xl:inline-block text-[9px] 2xl:text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Read PDF Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectBook(book);
                }}
                className="bg-[#09090B] hover:bg-[#6219BD] text-white text-[10px] 2xl:text-[11px] font-medium px-2.5 py-1.5 sm:px-3 sm:py-1.5 2xl:px-3.5 2xl:py-2 rounded-[7px] 2xl:rounded-[9px] shrink-0 transition-colors cursor-pointer flex items-center gap-1 2xl:gap-1.5"
              >
                <FileText className="w-3 h-3 2xl:w-3.5 2xl:h-3.5" />
                <span>Read</span>
              </button>
            </div>
          ))}

          {/* Bottom Chevron for symmetry */}
          <button
            onClick={() => spotlightBook && onSelectBook(spotlightBook)}
            aria-label="More featured books"
            className="mx-auto mt-0.5 text-zinc-700 hover:text-zinc-950 transition-colors cursor-pointer"
          >
            <ChevronDown className="w-4 h-4 2xl:w-5 2xl:h-5" />
          </button>
        </div>
      </NotchedSectionContainer>
    </div>
  );
}
