'use client';

import React, { use } from 'react';
import { ArticleBuilder } from '@/components/articles/builder/ArticleBuilder';

export default function EditArticleStudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <ArticleBuilder initialArticleId={id} />;
}
