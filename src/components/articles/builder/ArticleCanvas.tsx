'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  CollisionDetection,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import { useArticleEditorStore } from './store/useArticleEditorStore';
import { ArticleSectionItem } from './ArticleSectionItem';
import { ArticleDocumentView } from '../renderers/ArticleDocumentView';
import {
  Layout,
  ChevronDown,
  Image as ImageIcon,
  Sparkles,
  GripVertical,
} from 'lucide-react';
import { ArticleBlock, ArticleContentPayload } from '@/types';

export const ArticleCanvas: React.FC = () => {
  const {
    title,
    description,
    coverImageUrl,
    tags,
    theme,
    sections,
    version,
    viewport,
    viewMode,
    setTitle,
    setDescription,
    setCoverImageUrl,
    addSection,
    moveBlock,
    setActiveDragBlock,
    setDropGuide,
  } = useArticleEditorStore();

  const [activeOverlayBlock, setActiveOverlayBlock] = useState<ArticleBlock | null>(null);
  const [showSectionMenu, setShowSectionMenu] = useState(false);
  const sectionMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !sectionMenuRef.current?.contains(event.target)) {
        setShowSectionMenu(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowSectionMenu(false);
    };

    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  // Configure pointer sensor with activation constraint so text clicks don't accidentally drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const collisionDetection: CollisionDetection = (args) => {
    const pointerCollisions = pointerWithin(args);
    return pointerCollisions.length > 0 ? pointerCollisions : rectIntersection(args);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current;
    if (data && data.type === 'block') {
      setActiveOverlayBlock(data.block);
      setActiveDragBlock(data.block.id);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const over = event.over;
    if (over && over.data.current) {
      const { sectionId, columnId } = over.data.current;
      setDropGuide(sectionId && columnId ? `${sectionId}:${columnId}` : null);
    } else {
      setDropGuide(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveOverlayBlock(null);
    setActiveDragBlock(null);
    setDropGuide(null);

    if (!over || !active.data.current || !over.data.current) return;

    const source = active.data.current;
    const dest = over.data.current;

    if (
      source.sectionId &&
      source.columnId &&
      source.block &&
      dest.sectionId &&
      dest.columnId &&
      typeof dest.index === 'number'
    ) {
      moveBlock(
        {
          sectionId: source.sectionId,
          columnId: source.columnId,
          blockId: source.block.id,
        },
        {
          sectionId: dest.sectionId,
          columnId: dest.columnId,
          index: dest.index,
        }
      );
    }
  };

  const handleDragCancel = () => {
    setActiveOverlayBlock(null);
    setActiveDragBlock(null);
    setDropGuide(null);
  };

  // Viewport container width class
  const viewportWidthClass = {
    desktop: 'w-full max-w-4xl',
    tablet:
      'w-full max-w-2xl shadow-xl border-x border-zinc-200/80 bg-white/70 min-h-screen my-4 rounded-3xl',
    mobile:
      'w-full max-w-sm shadow-2xl border border-zinc-300 bg-white min-h-screen my-6 rounded-[2.5rem] p-2 ring-8 ring-zinc-900/10',
  }[viewport];

  const fullPayload: ArticleContentPayload = {
    articleId: 'preview',
    version,
    theme,
    sections,
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F7FC] p-4 sm:p-8 flex justify-center">
      <div className={`transition-all duration-300 ${viewportWidthClass}`}>
        {/* PREVIEW MODE: Public reader preview simulation */}
        {viewMode === 'preview' ? (
          <div className="rounded-3xl bg-white p-6 sm:p-12 shadow-md border border-purple-100/80">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-[#6219BD]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Reader Preview Simulation</span>
            </div>

            <ArticleDocumentView
              payload={fullPayload}
              title={title}
              description={description}
              coverImageUrl={coverImageUrl}
              tags={tags}
            />
          </div>
        ) : (
          /* EDIT MODE: Interactive Structure Grid Canvas */
          <DndContext
            sensors={sensors}
            collisionDetection={collisionDetection}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <div className="min-h-screen space-y-6 bg-white px-5 py-7 shadow-sm sm:px-10 sm:py-12">
              {/* Article header mirrors the reader view while keeping cover and metadata editable. */}
              <header className="mb-8 space-y-3 border-b border-zinc-100 pb-6">
                {/* Cover Image Banner */}
                <div className="group relative mb-8 overflow-hidden rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 transition-colors hover:border-purple-300">
                  {coverImageUrl ? (
                    <div className="relative aspect-video w-full">
                      <img
                        src={coverImageUrl}
                        alt="Article Cover"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const url = window.prompt('Enter Cover Image URL:', coverImageUrl);
                            if (url !== null) setCoverImageUrl(url);
                          }}
                          className="rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-zinc-900 shadow-sm cursor-pointer hover:bg-zinc-100"
                        >
                          Change Cover
                        </button>
                        <button
                          type="button"
                          onClick={() => setCoverImageUrl('')}
                          className="rounded-xl bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm cursor-pointer hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        const url = window.prompt(
                          'Enter Cover Image URL:',
                          'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200'
                        );
                        if (url) setCoverImageUrl(url);
                      }}
                      className="flex w-full flex-col items-center justify-center p-8 text-center text-zinc-400 hover:text-purple-600 cursor-pointer"
                    >
                      <ImageIcon className="mb-2 w-7 h-7 opacity-50" />
                      <span className="text-xs font-semibold">
                        + Add Article Cover Banner (16:9 recommended)
                      </span>
                    </button>
                  )}
                </div>

                {/* Article Title */}
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Article Title..."
                  style={{
                    fontFamily: theme.headingFont ? `${theme.headingFont}, serif` : undefined,
                  }}
                  className="w-full bg-transparent text-3xl font-extrabold tracking-tight text-zinc-900 focus:outline-hidden placeholder:text-zinc-300 sm:text-4xl lg:text-5xl"
                />

                {/* Subtitle / Excerpt */}
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write a subtitle or brief summary..."
                  style={{
                    fontFamily: theme.baseFont ? `${theme.baseFont}, sans-serif` : undefined,
                  }}
                  className="w-full resize-none bg-transparent font-serif text-base leading-relaxed text-zinc-600 focus:outline-hidden placeholder:text-zinc-300 sm:text-lg"
                />

                {/* Tags chips */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-purple-700"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </header>

              {/* Grid Sections List */}
              <div className="space-y-4">
                {sections.map((section, idx) => (
                  <ArticleSectionItem
                    key={section.id}
                    section={section}
                    index={idx}
                    totalSections={sections.length}
                    viewport={viewport}
                  />
                ))}
              </div>

              {/* Add New Section Bar */}
              <div className="flex justify-center border-t border-dashed border-zinc-200 pt-6">
                <div className="relative" ref={sectionMenuRef}>
                  <button
                    type="button"
                    onClick={() => setShowSectionMenu((open) => !open)}
                    aria-expanded={showSectionMenu}
                    className="flex min-h-10 items-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-600 transition-colors hover:border-[#6219BD] hover:bg-purple-50 hover:text-[#6219BD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                  >
                    <Layout className="h-4 w-4" />
                    <span>Add a section</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {showSectionMenu && (
                    <div className="absolute bottom-full left-1/2 z-20 mb-2 w-64 -translate-x-1/2 rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl">
                      <p className="px-2 py-1.5 text-xs font-semibold text-zinc-500">
                        Choose a layout
                      </p>
                      {([
                        ['SINGLE_COLUMN', 'Single column'],
                        ['TWO_COLUMN_EQUAL', 'Two columns - 50 / 50'],
                        ['TWO_COLUMN_WIDE_LEFT', 'Wide left - 66 / 33'],
                        ['TWO_COLUMN_WIDE_RIGHT', 'Wide right - 33 / 66'],
                        ['THREE_COLUMN_EQUAL', 'Three columns - 33 / 33 / 33'],
                      ] as const).map(([layout, label]) => (
                        <button
                          key={layout}
                          type="button"
                          onClick={() => {
                            addSection(layout);
                            setShowSectionMenu(false);
                          }}
                          className="flex min-h-10 w-full items-center rounded-xl px-3 text-left text-sm text-zinc-700 transition-colors hover:bg-purple-50 hover:text-[#6219BD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Drag Overlay Preview */}
            <DragOverlay>
              {activeOverlayBlock ? (
                <div className="rounded-2xl border-2 border-[#6219BD] bg-white p-4 shadow-2xl opacity-90 scale-105 pointer-events-none w-80">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#6219BD]">
                    <GripVertical className="w-4 h-4" />
                    <span>Moving {activeOverlayBlock.type.toLowerCase()}...</span>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
};
