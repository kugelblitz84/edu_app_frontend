'use client';

import React, { useEffect } from 'react';
import { useArticleEditorStore } from './store/useArticleEditorStore';
import { ArticleBuilderHeader } from './ArticleBuilderHeader';
import { ArticleGlobalToolbar } from './ArticleGlobalToolbar';
import { ArticleCanvas } from './ArticleCanvas';
import { ArticleInspector } from './ArticleInspector';

interface ArticleBuilderProps {
  initialArticleId?: string;
}

export const ArticleBuilder: React.FC<ArticleBuilderProps> = ({ initialArticleId }) => {
  const { initArticle, isInspectorOpen, viewMode } = useArticleEditorStore();

  useEffect(() => {
    initArticle(initialArticleId);
  }, [initialArticleId, initArticle]);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#F8F7FC]">
      {/* 1. Header with Dual Persistence (Local + Server) status & Review actions */}
      <ArticleBuilderHeader />

      {/* 2. Keep editing controls out of the reader preview. */}
      {viewMode === 'edit' && <ArticleGlobalToolbar />}

      {/* 3. Main Structure Grid Canvas Workspace + Right Inspector */}
      <div className="flex flex-1 overflow-hidden relative">
        <ArticleCanvas />

        {isInspectorOpen && <ArticleInspector />}
      </div>
    </div>
  );
};
