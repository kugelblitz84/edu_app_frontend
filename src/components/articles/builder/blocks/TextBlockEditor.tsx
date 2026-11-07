'use client';

import React, { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { ArticleBlock, HeadingBlock, ParagraphBlock } from '@/types';
import { useArticleEditorStore } from '../store/useArticleEditorStore';
import { Trash2, GripVertical } from 'lucide-react';

interface TextBlockEditorProps {
  block: ParagraphBlock | HeadingBlock;
  sectionId: string;
  columnId: string;
  onChange: (updated: ArticleBlock) => void;
  onDelete: () => void;
  dragHandleProps?: Record<string, unknown>;
}

const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });

export const TextBlockEditor: React.FC<TextBlockEditorProps> = ({
  block,
  sectionId,
  columnId,
  onChange,
  onDelete,
  dragHandleProps,
}) => {
  const blockRef = useRef(block);
  useEffect(() => {
    blockRef.current = block;
  }, [block]);
  const {
    setActiveEditor,
    updateActiveFormatting,
    setActiveSelection,
    activeBlockId,
    theme,
    sections,
  } = useArticleEditorStore();
  const sectionStyle = sections.find((section) => section.id === sectionId)?.style;

  const isHeading = block.type === 'HEADING';
  const headingClass = {
    1: 'text-2xl font-extrabold tracking-tight sm:text-3xl',
    2: 'text-xl font-bold tracking-tight sm:text-2xl',
    3: 'text-lg font-bold sm:text-xl',
    4: 'text-base font-semibold sm:text-lg',
  }[(block as HeadingBlock).level || 2];
  const paragraphClass = {
    sm: 'text-xs leading-relaxed sm:text-sm',
    base: 'text-sm leading-relaxed sm:text-base',
    lg: 'text-base leading-loose sm:text-lg',
  }[(block as ParagraphBlock).fontSize || 'base'];
  const initialContent = isHeading
    ? `<h${block.level || 2}>${escapeHtml(block.text || '')}</h${block.level || 2}>`
    : (block as ParagraphBlock).html || '<p></p>';

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#6219BD] underline hover:text-[#4d1396] transition-colors',
        },
      }),
      Placeholder.configure({
        placeholder: isHeading ? 'Heading text...' : 'Start typing your paragraph...',
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          `article-rich-content min-h-[2.5rem] max-w-none focus:outline-hidden ${
            isHeading ? headingClass : paragraphClass
          }`,
      },
    },
    onFocus: ({ editor }) => {
      setActiveSelection(sectionId, columnId, block.id);
      setActiveEditor(editor, block.id);
    },
    onSelectionUpdate: ({ editor }) => {
      if (useArticleEditorStore.getState().activeBlockId !== block.id) {
        setActiveSelection(sectionId, columnId, block.id);
        setActiveEditor(editor, block.id);
      } else {
        updateActiveFormatting(editor);
      }
    },
    onTransaction: ({ editor }) => {
      updateActiveFormatting(editor);
    },
    onUpdate: ({ editor }) => {
      const currentBlock = blockRef.current;
      if (currentBlock.type === 'HEADING') {
        const currentHeading = currentBlock as HeadingBlock;
        const text = editor.getText();
        const html = editor.getHTML();
        const headingLevel = ([1, 2, 3, 4] as const).find((level) =>
          editor.isActive('heading', { level })
        );
        const hasInlineMarks = /<(strong|b|em|i|u|s|del|code|a)\b/i.test(html);
        const isSingleHeading =
          editor.state.doc.childCount === 1 && editor.state.doc.firstChild?.type.name === 'heading';

        if (
          headingLevel &&
          isSingleHeading &&
          !editor.isActive('blockquote') &&
          !hasInlineMarks
        ) {
          onChange({ ...currentHeading, text, level: headingLevel });
        } else {
          onChange({
            id: currentHeading.id,
            type: 'PARAGRAPH',
            html,
            fontSize: 'lg',
            align: currentHeading.align,
            fontFamily: currentHeading.fontFamily,
          });
        }
      } else {
        onChange({
          ...currentBlock,
          html: editor.getHTML(),
        });
      }
    },
  });

  // Sync external text/html changes if needed
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    const currentHTML = editor.getHTML();
    const targetHTML = isHeading
      ? `<h${block.level || 2}>${escapeHtml(block.text || '')}</h${block.level || 2}>`
      : (block as ParagraphBlock).html;

    if (targetHTML && targetHTML !== currentHTML && !editor.isFocused) {
      editor.commands.setContent(targetHTML, { emitUpdate: false });
    }
  }, [block, editor, isHeading]);

  const isSelected = activeBlockId === block.id;
  const fontFamily = block.fontFamily || sectionStyle?.fontFamily || theme.baseFont;
  const textColor = isHeading ? sectionStyle?.textColor : sectionStyle?.textColor || '#3F3F46';

  return (
    <div
      data-article-block
      onClick={() => {
        setActiveSelection(sectionId, columnId, block.id);
        if (editor && !editor.isFocused) {
          editor.commands.focus();
        }
      }}
      className={`group relative rounded-lg border px-1.5 py-1 transition-all ${
        isSelected
          ? 'border-purple-200 bg-purple-50/20 ring-2 ring-purple-500/10'
          : 'border-transparent hover:border-zinc-100'
      }`}
    >
      {/* Floating Action Controls on Hover */}
      <div className="absolute right-2 top-2 z-10 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <div
          {...dragHandleProps}
          aria-label={`Move ${block.type.toLowerCase()} block`}
          title="Drag to move; press Space and use arrow keys"
          className="flex min-h-9 min-w-9 cursor-grab items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-700 active:cursor-grabbing"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </div>

        <button
          type="button"
          aria-label={`Delete ${block.type.toLowerCase()} block`}
          onClick={(e) => {
            e.stopPropagation();
            setActiveSelection(sectionId, columnId, block.id);
            onDelete();
          }}
          title="Delete block"
          className="flex min-h-9 min-w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Editor Content Area */}
      <div
        className="pt-1"
        style={{
          fontFamily: fontFamily ? `${fontFamily}, sans-serif` : undefined,
          color: textColor || undefined,
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
