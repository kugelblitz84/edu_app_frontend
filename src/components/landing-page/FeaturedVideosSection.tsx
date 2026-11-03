'use client';

import React from 'react';
import { Play, ChevronRight, ChevronDown } from 'lucide-react';
import { VideoItem } from '@/types';
import { NotchedSectionContainer } from './NotchedSectionContainer';
import { AccessPolicyBadge } from './AccessPolicyBadge';

interface FeaturedVideosSectionProps {
  videos: VideoItem[];
  viewMode: 'rich' | 'wireframe';
  showSymmetryGrid?: boolean;
  onSelectVideo: (video: VideoItem) => void;
}

export function FeaturedVideosSection({
  videos,
  viewMode,
  showSymmetryGrid = false,
  onSelectVideo
}: FeaturedVideosSectionProps) {
  const displayVideos = videos.slice(0, 3);
  const spotlightVideo = displayVideos[0] || videos[0];

  return (
    <div className="wb-bento-video-col">
      <NotchedSectionContainer
        title="Featured Videos"
        badge={showSymmetryGrid ? '40% • VIDEO' : null}
        actionLabel="Explore Videos"
        actionIcon="grid"
        bgClass="bg-[#E6E1FA]"
        titleColorClass="text-[#18181B]"
        onActionClick={() => spotlightVideo && onSelectVideo(spotlightVideo)}
      >
        <div className="flex flex-col gap-2 2xl:gap-2.5">
          {displayVideos.map((vid) => (
            <div
              key={vid.id}
              onClick={() => onSelectVideo(vid)}
              className="wb-video-card group"
            >
              {/* 16:9 Widescreen Video Thumbnail */}
              <div className="w-20 h-11 sm:w-24 sm:h-13 xl:w-28 xl:h-[58px] 2xl:w-[124px] 2xl:h-[66px] rounded-[8px] 2xl:rounded-[10px] overflow-hidden shrink-0 relative bg-[#D9DBD9] shadow-inner">
                {viewMode === 'wireframe' ? (
                  <div className="w-full h-full bg-[#D9DBD9] flex items-center justify-center">
                    <Play className="w-4 h-4 2xl:w-5 2xl:h-5 text-zinc-500" />
                  </div>
                ) : (
                  <div
                    className={`w-full h-full bg-gradient-to-br ${vid.gradient} flex items-center justify-center relative`}
                  >
                    <div className="w-5 h-5 sm:w-6 sm:h-6 2xl:w-7 2xl:h-7 rounded-full bg-white/95 text-[#6219BD] flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                      <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 2xl:w-3.5 2xl:h-3.5 fill-current ml-0.5" />
                    </div>
                    <span className="absolute bottom-1 right-1 bg-black/80 text-[8px] 2xl:text-[9px] font-mono px-1 py-0.2 sm:px-1.5 2xl:px-2 2xl:py-0.5 rounded text-white">
                      {vid.duration}
                    </span>
                  </div>
                )}
              </div>

              {/* Rich Video Metadata */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs sm:text-[13px] 2xl:text-[14px] font-medium text-white group-hover:text-purple-200 transition-colors truncate">
                    {vid.title}
                  </h3>
                </div>

                <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 2xl:gap-2.5 mt-1 sm:mt-1.5">
                  <span className="text-[10px] 2xl:text-[11px] text-zinc-300 font-medium truncate">
                    {vid.metadata?.author}
                  </span>
                  <span className="text-zinc-600 text-[10px] 2xl:text-[11px]">•</span>
                  <AccessPolicyBadge item={vid} darkBg />
                  {vid.metadata?.tags?.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="hidden sm:inline-block text-[9px] 2xl:text-[10px] px-1.5 py-0.5 2xl:px-2 2xl:py-0.5 rounded bg-white/10 text-purple-200/90"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Watch Action Pill */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="hidden sm:inline-block text-[10px] 2xl:text-[11px] font-medium text-purple-200/80 group-hover:text-white transition-colors">
                  Watch
                </span>
                <div className="w-5 h-5 sm:w-6 sm:h-6 2xl:w-7 2xl:h-7 rounded-full bg-white text-[#181722] group-hover:bg-purple-300 flex items-center justify-center transition-colors">
                  <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 2xl:w-4 2xl:h-4 stroke-[2.5]" />
                </div>
              </div>
            </div>
          ))}

          {/* Bottom Chevron for symmetry */}
          <button
            onClick={() => spotlightVideo && onSelectVideo(spotlightVideo)}
            aria-label="More featured videos"
            className="mx-auto mt-0.5 text-indigo-950/70 hover:text-indigo-950 transition-colors cursor-pointer"
          >
            <ChevronDown className="w-4 h-4 2xl:w-5 2xl:h-5" />
          </button>
        </div>
      </NotchedSectionContainer>
    </div>
  );
}
