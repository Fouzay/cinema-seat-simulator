import { useState, useCallback, type ReactNode } from 'react';
import type { Venue } from '@/types';
import { SeatMap } from '@/components/SeatMap';

export interface SeatPickerPanelProps {
  venue: Venue;
  children?: ReactNode;
}

export function SeatPickerPanel({ venue, children }: SeatPickerPanelProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const sectionCount = venue.sections.length;

  const goNext = useCallback(() => {
    setCurrentSection(s => Math.min(s + 1, sectionCount - 1));
  }, [sectionCount]);

  const goPrev = useCallback(() => {
    setCurrentSection(s => Math.max(s - 1, 0));
  }, []);

  const slidePx = Math.max(8, 32 - currentSection * 1.5);
  const animName = `sectionSlideIn-${currentSection}`;

  const content = children ?? <SeatMap venue={venue} visibleSectionIndex={currentSection} />;

  return (
    <div
      className="absolute bottom-6 left-1/2 z-10 h-72 w-[80rem] max-w-[96vw] -translate-x-1/2 rounded-xl border border-white/20 bg-black/10 p-3 shadow-2xl backdrop-blur-md"
      style={{ WebkitBackdropFilter: 'blur(6px)', backdropFilter: 'blur(6px)' }}
    >
      <div className="flex h-full w-full flex-col">
        <div className="relative flex-1 overflow-hidden">
          <div
            key={currentSection}
            className="flex h-full w-full items-center justify-center"
            style={{ animation: `${animName} 0.35s ease-out` }}
          >
            {content}
          </div>
        </div>
        <div className="flex items-center justify-between px-1 pt-1">
          <button
            onClick={goPrev}
            disabled={currentSection === 0}
            className="rounded bg-white/10 px-3 py-1 text-xs text-white transition-colors hover:bg-white/20 disabled:opacity-30"
          >
            ← Prev
          </button>
          <span className="text-xs text-white/70">
            {venue.sections[currentSection].label} — {currentSection + 1} / {sectionCount}
          </span>
          <button
            onClick={goNext}
            disabled={currentSection === sectionCount - 1}
            className="rounded bg-white/10 px-3 py-1 text-xs text-white transition-colors hover:bg-white/20 disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      </div>
      <style>{`
        @keyframes ${animName} {
          from {
            opacity: 0;
            transform: translateX(${slidePx}px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
