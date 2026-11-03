'use client';

import React from 'react';
import { VideoItem, BookItem, UpcomingExamItem } from '@/types';
import { FeaturedVideosSection } from './FeaturedVideosSection';
import { FeaturedBooksSection } from './FeaturedBooksSection';
import { UpcomingExamsSection } from './UpcomingExamsSection';

interface BentoGridSectionProps {
  videos: VideoItem[];
  books: BookItem[];
  exams: UpcomingExamItem[];
  viewMode: 'rich' | 'wireframe';
  showSymmetryGrid?: boolean;
  onSelectVideo: (video: VideoItem) => void;
  onSelectBook: (book: BookItem) => void;
  onRegisterExam?: (exam: UpcomingExamItem) => void;
  onVisitGym?: () => void;
}

export function BentoGridSection({
  videos,
  books,
  exams,
  viewMode,
  showSymmetryGrid = false,
  onSelectVideo,
  onSelectBook,
  onRegisterExam,
  onVisitGym
}: BentoGridSectionProps) {
  return (
    <section
      aria-label="Featured Videos, Featured Books, and Upcoming Certification Exams"
      className="wb-bento-grid"
    >
      {/* 40% Videos Column */}
      <FeaturedVideosSection
        videos={videos}
        viewMode={viewMode}
        showSymmetryGrid={showSymmetryGrid}
        onSelectVideo={onSelectVideo}
      />

      {/* 40% Books Column */}
      <FeaturedBooksSection
        books={books}
        viewMode={viewMode}
        showSymmetryGrid={showSymmetryGrid}
        onSelectBook={onSelectBook}
      />

      {/* 20% Upcoming Exams Column */}
      <UpcomingExamsSection
        exams={exams}
        showSymmetryGrid={showSymmetryGrid}
        onRegisterExam={onRegisterExam}
        onVisitGym={onVisitGym}
      />
    </section>
  );
}
