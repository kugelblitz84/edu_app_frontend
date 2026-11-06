'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface VideoPlayerProps {
  title: string;
  duration?: string;
  author?: string;
  streamUrl?: string;
}

export function VideoPlayer({
  title,
  duration = '28:15',
  author = 'WitBase Faculty'
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulated duration in seconds
  const totalSeconds = 1695; // ~28:15

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => (prev >= totalSeconds ? 0 : prev + 1 * playbackSpeed));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, totalSeconds]);

  const togglePlay = () => setIsPlaying((p) => !p);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(Number(e.target.value));
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl overflow-hidden bg-[#0F0E17] text-white shadow-2xl border border-white/10 group flex flex-col justify-between aspect-video max-h-[580px] w-full"
    >
      {/* Video Content Stage / Poster Simulation */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-purple-950 via-[#141418] to-indigo-950">
        <div className="text-center p-6 space-y-3 z-10 select-none">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#6219BD]/80 hover:bg-[#6219BD] text-white mx-auto flex items-center justify-center cursor-pointer transition-all shadow-lg shadow-purple-900/40 hover:scale-105"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current translate-x-0.5" />
            )}
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-bold text-white max-w-lg mx-auto line-clamp-1">
              {title}
            </h4>
            <p className="text-xs text-purple-200/70 mt-1">
              Lecturer: {author} • 1080p 60fps Stream
            </p>
          </div>
        </div>

        {/* Dynamic Grid Background Accent */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />
      </div>

      {/* Top Banner overlay */}
      <div className="relative z-20 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-purple-600/60 text-purple-100 border border-purple-400/30">
            HLS Video Stream
          </span>
          <span className="text-xs text-zinc-300 font-medium truncate max-w-xs sm:max-w-md">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-purple-200 bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Signed Token Active</span>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="relative z-20 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent space-y-2 opacity-95 group-hover:opacity-100 transition-opacity">
        {/* Timeline Scrub Bar */}
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={totalSeconds}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/20 hover:bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#673DE6]"
          />
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={togglePlay}
              className="p-1.5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            <button
              onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
              className="p-1.5 hover:bg-white/10 rounded-lg cursor-pointer text-zinc-300 hover:text-white"
              title="Rewind 10s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Volume control */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsMuted((m) => !m)}
                className="p-1 hover:bg-white/10 rounded cursor-pointer"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-zinc-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-zinc-200" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  setIsMuted(false);
                }}
                className="w-16 h-1 bg-white/20 rounded accent-[#673DE6] hidden sm:inline"
              />
            </div>

            <span className="text-xs text-zinc-300 font-mono">
              {formatTime(currentTime)} / {duration}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Speed selector */}
            <button
              onClick={() => {
                const speeds = [1, 1.25, 1.5, 2];
                const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                setPlaybackSpeed(speeds[nextIdx]);
              }}
              className="text-xs font-semibold px-2 py-1 bg-white/10 hover:bg-white/20 rounded cursor-pointer font-mono"
            >
              {playbackSpeed}x
            </button>

            <span className="hidden sm:inline-flex text-[11px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              1080p HD
            </span>

            <button
              onClick={toggleFullscreen}
              className="p-1.5 hover:bg-white/10 rounded-lg cursor-pointer text-zinc-300 hover:text-white"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
