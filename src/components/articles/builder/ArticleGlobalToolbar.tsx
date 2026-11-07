'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tiptap/react';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Code,
  Columns,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  RemoveFormatting,
  RotateCcw,
  RotateCw,
  Strikethrough,
  Underline as UnderlineIcon,
  Unlink,
} from 'lucide-react';
import { SectionLayoutType } from '@/types';
import { useArticleEditorStore } from './store/useArticleEditorStore';

interface ToolbarButtonProps {
  label: string;
  pressed?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const toolbarButtonClass =
  'inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-35';

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  label,
  pressed,
  disabled,
  onClick,
  children,
}) => (
  <button
    type="button"
    aria-label={label}
    aria-pressed={pressed}
    title={label}
    disabled={disabled}
    onMouseDown={(event) => event.preventDefault()}
    onClick={onClick}
    className={`${toolbarButtonClass} ${
      pressed
        ? 'bg-purple-100 text-[#6219BD]'
        : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950'
    }`}
  >
    {children}
  </button>
);

const sectionLayouts: { value: SectionLayoutType; label: string; detail: string }[] = [
  { value: 'SINGLE_COLUMN', label: 'Single column', detail: '12' },
  { value: 'TWO_COLUMN_EQUAL', label: 'Two columns', detail: '6 + 6' },
  { value: 'TWO_COLUMN_WIDE_LEFT', label: 'Wide left', detail: '8 + 4' },
  { value: 'TWO_COLUMN_WIDE_RIGHT', label: 'Wide right', detail: '4 + 8' },
  { value: 'THREE_COLUMN_EQUAL', label: 'Three columns', detail: '4 + 4 + 4' },
];

export const ArticleGlobalToolbar: React.FC = () => {
  const {
    activeEditor,
    activeFormatting,
    activeSectionId,
    sections,
    setSectionLayout,
    convertBlockStyle,
  } = useArticleEditorStore();
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeMenusOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !toolbarRef.current?.contains(event.target)) {
        setShowStyleMenu(false);
        setShowMoreMenu(false);
        setShowLayoutMenu(false);
      }
    };
    const closeMenusOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowStyleMenu(false);
        setShowMoreMenu(false);
        setShowLayoutMenu(false);
      }
    };

    document.addEventListener('pointerdown', closeMenusOutside);
    document.addEventListener('keydown', closeMenusOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeMenusOutside);
      document.removeEventListener('keydown', closeMenusOnEscape);
    };
  }, []);

  const activeSection = sections.find((section) => section.id === activeSectionId);
  const hasEditor = Boolean(activeEditor && !activeEditor.isDestroyed);
  const run = (action: (editor: Editor) => void) => {
    if (activeEditor && !activeEditor.isDestroyed) action(activeEditor);
  };

  const setTextStyle = (level: 0 | 1 | 2 | 3 | 4 | 'quote') => {
    if (activeEditor && !activeEditor.isDestroyed) {
      run((editor) => {
        if (level === 'quote') {
          if (activeFormatting.isBlockquote) {
            editor.chain().focus().lift('blockquote').run();
          } else {
            editor.chain().focus().setBlockquote().run();
          }
        } else if (level === 0) {
          let chain = editor.chain().focus();
          if (activeFormatting.isBlockquote) chain = chain.lift('blockquote');
          chain.setParagraph().run();
        } else {
          if (activeFormatting.headingLevel === level && !activeFormatting.isBlockquote) {
            editor.chain().focus().setParagraph().run();
          } else {
            let chain = editor.chain().focus();
            if (activeFormatting.isBlockquote) chain = chain.lift('blockquote');
            chain.setHeading({ level }).run();
          }
        }
      });
    } else {
      convertBlockStyle(level);
    }
    setShowStyleMenu(false);
  };

  const setLink = () => {
    run((editor) => {
      const previousUrl = editor.getAttributes('link').href;
      const url = window.prompt('Enter Web Link URL:', previousUrl || 'https://');
      if (url === null) return;
      if (url.trim() === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
      } else {
        editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: url, target: '_blank' })
          .run();
      }
    });
    setShowMoreMenu(false);
  };

  const styleLabel = activeFormatting.isMixedTextStyle
    ? 'Mixed styles'
    : activeFormatting.isBlockquote
      ? 'Quote'
      : activeFormatting.headingLevel > 0
        ? `Heading ${activeFormatting.headingLevel}`
        : 'Normal text';

  const setLayout = (layout: SectionLayoutType) => {
    if (!activeSection) return;
    setSectionLayout(activeSection.id, layout);
    setShowLayoutMenu(false);
  };

  return (
    <div
      ref={toolbarRef}
      className="sticky top-16 z-20 flex min-h-14 w-full flex-wrap items-center justify-between gap-2 border-b border-zinc-200 bg-white/95 px-3 py-2 text-sm shadow-xs backdrop-blur-md sm:px-4"
    >
      <div className="flex min-w-0 flex-wrap items-center gap-1.5">
        <div className="flex items-center rounded-lg border border-zinc-200 bg-white p-0.5">
          <ToolbarButton
            label="Undo"
            disabled={!hasEditor || !activeFormatting.canUndo}
            onClick={() => run((editor) => editor.chain().focus().undo().run())}
          >
            <RotateCcw className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Redo"
            disabled={!hasEditor || !activeFormatting.canRedo}
            onClick={() => run((editor) => editor.chain().focus().redo().run())}
          >
            <RotateCw className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <div className="mx-1 hidden h-6 w-px bg-zinc-200 sm:block" />

        {/* Text Style Dropdown */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            aria-label={`Text style: ${styleLabel}. Follows the current selection`}
            aria-expanded={showStyleMenu}
            title={hasEditor ? `Text style at cursor: ${styleLabel}` : `Text style: ${styleLabel}`}
            onClick={() => setShowStyleMenu((open) => !open)}
            className="flex min-h-9 min-w-32 items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white px-3 font-semibold text-zinc-800 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 cursor-pointer"
          >
            <span className="truncate">{styleLabel}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
          </button>
          {showStyleMenu && (
            <div className="absolute left-0 top-full z-50 mt-2 w-52 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl">
              <p className="px-2 py-1.5 text-xs font-semibold text-zinc-500">Text style</p>
              {([
                [0, 'Normal text'],
                [1, 'Heading 1'],
                [2, 'Heading 2'],
                [3, 'Heading 3'],
                [4, 'Heading 4'],
                ['quote', 'Quote'],
              ] as const).map(([level, label]) => {
                const selected =
                  level === 'quote'
                    ? activeFormatting.isBlockquote
                    : !activeFormatting.isBlockquote && activeFormatting.headingLevel === level;
                return (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={selected}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => setTextStyle(level)}
                    className={`flex min-h-10 w-full items-center justify-between rounded-lg px-2.5 text-left text-sm transition-colors hover:bg-purple-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 cursor-pointer ${
                      selected ? 'bg-purple-50 font-semibold text-[#6219BD]' : 'text-zinc-700'
                    }`}
                  >
                    {label}
                    {selected && <span className="text-xs">Current</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center rounded-lg border border-zinc-200 bg-white p-0.5">
          <ToolbarButton
            label="Bold"
            pressed={activeFormatting.isBold}
            disabled={!hasEditor}
            onClick={() => run((editor) => editor.chain().focus().toggleBold().run())}
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Italic"
            pressed={activeFormatting.isItalic}
            disabled={!hasEditor}
            onClick={() => run((editor) => editor.chain().focus().toggleItalic().run())}
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Underline"
            pressed={activeFormatting.isUnderline}
            disabled={!hasEditor}
            onClick={() => run((editor) => editor.chain().focus().toggleUnderline().run())}
          >
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <div className="relative">
          <button
            type="button"
            disabled={!hasEditor}
            aria-expanded={showMoreMenu}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setShowMoreMenu((open) => !open)}
            className="flex min-h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            More
            <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
          </button>
          {showMoreMenu && hasEditor && (
            <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-zinc-200 bg-white p-3 shadow-xl sm:left-auto sm:right-0">
              <div className="space-y-3">
                <div>
                  <p className="mb-1.5 px-1 text-xs font-semibold text-zinc-500">Inline style</p>
                  <div className="flex gap-1">
                    <ToolbarButton
                      label="Strikethrough"
                      pressed={activeFormatting.isStrike}
                      disabled={!hasEditor}
                      onClick={() => run((editor) => editor.chain().focus().toggleStrike().run())}
                    >
                      <Strikethrough className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                      label="Inline code"
                      pressed={activeFormatting.isCode}
                      disabled={!hasEditor}
                      onClick={() => run((editor) => editor.chain().focus().toggleCode().run())}
                    >
                      <Code className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                      label="Add or edit link"
                      pressed={Boolean(activeEditor?.isActive('link'))}
                      disabled={!hasEditor}
                      onClick={setLink}
                    >
                      <LinkIcon className="h-4 w-4" />
                    </ToolbarButton>
                    {activeEditor?.isActive('link') && (
                      <ToolbarButton
                        label="Remove link"
                        disabled={!hasEditor}
                        onClick={() => run((editor) => editor.chain().focus().unsetLink().run())}
                      >
                        <Unlink className="h-4 w-4" />
                      </ToolbarButton>
                    )}
                  </div>
                </div>

                <div>
                  <p className="mb-1.5 px-1 text-xs font-semibold text-zinc-500">Paragraph</p>
                  <div className="flex gap-1">
                    {([
                      ['left', 'Align left', AlignLeft],
                      ['center', 'Align center', AlignCenter],
                      ['right', 'Align right', AlignRight],
                      ['justify', 'Justify', AlignJustify],
                    ] as const).map(([alignment, label, Icon]) => (
                      <ToolbarButton
                        key={alignment}
                        label={label}
                        pressed={activeFormatting.textAlign === alignment}
                        disabled={!hasEditor}
                        onClick={() =>
                          run((editor) => editor.chain().focus().setTextAlign(alignment).run())
                        }
                      >
                        <Icon className="h-4 w-4" />
                      </ToolbarButton>
                    ))}
                    <ToolbarButton
                      label="Bulleted list"
                      pressed={activeFormatting.isBulletList}
                      disabled={!hasEditor}
                      onClick={() => run((editor) => editor.chain().focus().toggleBulletList().run())}
                    >
                      <List className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                      label="Numbered list"
                      pressed={activeFormatting.isOrderedList}
                      disabled={!hasEditor}
                      onClick={() => run((editor) => editor.chain().focus().toggleOrderedList().run())}
                    >
                      <ListOrdered className="h-4 w-4" />
                    </ToolbarButton>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-100 pt-2">
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => run((editor) => editor.chain().focus().unsetAllMarks().clearNodes().run())}
                    className="flex min-h-9 items-center gap-2 rounded-lg px-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                  >
                    <RemoveFormatting className="h-4 w-4" />
                    Clear formatting
                  </button>
                  {activeFormatting.isBlockquote && (
                    <button
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => run((editor) => editor.chain().focus().toggleBlockquote().run())}
                      className="flex min-h-9 items-center gap-2 rounded-lg px-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                    >
                      <Quote className="h-4 w-4" />
                      Remove quote
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <p className="hidden pl-1 text-xs text-zinc-500 lg:block">
          {hasEditor ? 'Formatting follows the cursor or selection' : 'Select text to format'}
        </p>
      </div>

      {activeSection && (
        <div className="relative ml-auto">
          <button
            type="button"
            aria-expanded={showLayoutMenu}
            onClick={() => setShowLayoutMenu((open) => !open)}
            className="flex min-h-9 items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-3 font-semibold text-[#6219BD] transition-colors hover:bg-purple-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
          >
            <Columns className="h-4 w-4" />
            <span>Section layout</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          {showLayoutMenu && (
            <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl">
              <p className="px-2 py-1.5 text-xs font-semibold text-zinc-500">Change selected section</p>
              {sectionLayouts.map(({ value, label, detail }) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={activeSection.layout === value}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => setLayout(value)}
                  className={`flex min-h-10 w-full items-center justify-between rounded-lg px-2.5 text-left text-sm transition-colors hover:bg-purple-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
                    activeSection.layout === value
                      ? 'bg-purple-50 font-semibold text-[#6219BD]'
                      : 'text-zinc-700'
                  }`}
                >
                  <span>{label}</span>
                  <span className="font-mono text-xs text-zinc-400">{detail}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
