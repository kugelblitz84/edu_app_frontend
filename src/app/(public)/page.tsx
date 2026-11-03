'use client';

import React, { useState, useMemo } from 'react';
import { MaterialItem } from '@/types';
import { usePublicSearch } from '@/hooks';
import {
  FEATURED_COLLECTIONS,
  FEATURED_VIDEOS,
  FEATURED_BOOKS,
  TOP_INSTITUTIONS,
  UPCOMING_EXAMS
} from '@/data';
import {
  FeaturedCoursesCarousel,
  BentoGridSection,
  TopInstitutionsSection,
  DesignControlsToolbar,
  SymmetryGridOverlay,
  MaterialDetailModal
} from '@/components/landing-page';

export default function LandingPage() {
  // UI Modes: 'rich' (populated educational UI) vs 'wireframe' (clean geometric blocks)
  const [viewMode, setViewMode] = useState<'rich' | 'wireframe'>('rich');
  const [showSymmetryGrid, setShowSymmetryGrid] = useState(false);

  // Search & Filter state consumed from PublicLayout context
  const { searchQuery, accessFilter } = usePublicSearch();

  // Tier 1: Featured Courses Carousel active index
  const [activeCourseIdx, setActiveCourseIdx] = useState(1);

  // Tier 3: Top Institutions active spotlight index
  const [activeInstitutionIdx, setActiveInstitutionIdx] = useState(0);

  // Interactive API Contract Inspector Modal
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialItem | null>(null);

  // Filter logic for search / access policy
  const filteredVideos = useMemo(() => {
    return FEATURED_VIDEOS.filter((v) => {
      const matchesPolicy = accessFilter === 'ALL' || v.accessPolicy === accessFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.metadata?.author?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPolicy && matchesSearch;
    });
  }, [accessFilter, searchQuery]);

  const filteredBooks = useMemo(() => {
    return FEATURED_BOOKS.filter((b) => {
      const matchesPolicy = accessFilter === 'ALL' || b.accessPolicy === accessFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.metadata?.author?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPolicy && matchesSearch;
    });
  }, [accessFilter, searchQuery]);

  return (
    <>
      {/* 40 / 40 / 20 Symmetry Grid Overlay */}
      {showSymmetryGrid && <SymmetryGridOverlay />}

      {/* Tier 2: Featured Courses Coverflow Carousel */}
      <FeaturedCoursesCarousel
        collections={FEATURED_COLLECTIONS}
        activeIdx={activeCourseIdx}
        setActiveIdx={setActiveCourseIdx}
        viewMode={viewMode}
        onSelectCourse={setSelectedMaterial}
      />

      {/* Tier 3: 40% / 40% / 20% Bento Grid (Videos, Books, Exams) */}
      <BentoGridSection
        videos={filteredVideos}
        books={filteredBooks}
        exams={UPCOMING_EXAMS}
        viewMode={viewMode}
        showSymmetryGrid={showSymmetryGrid}
        onSelectVideo={setSelectedMaterial}
        onSelectBook={setSelectedMaterial}
      />

      {/* Tier 4: Top Institutions Showcase */}
      <TopInstitutionsSection
        institutions={TOP_INSTITUTIONS}
        activeIdx={activeInstitutionIdx}
        setActiveIdx={setActiveInstitutionIdx}
      />

      {/* Floating Design Controls Toolbar */}
      <DesignControlsToolbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        showSymmetryGrid={showSymmetryGrid}
        setShowSymmetryGrid={setShowSymmetryGrid}
      />

      {/* API Contract Inspector Modal */}
      <MaterialDetailModal
        material={selectedMaterial}
        onClose={() => setSelectedMaterial(null)}
      />
    </>
  );
}
