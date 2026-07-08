import { useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Venue } from '@/types';
import { SeatMap } from '@/components/SeatMap';
import { buildQuickPickVenue } from '@/utils/quickPickSeats';

export interface SeatPickerPanelProps {
  venue: Venue;
  children?: ReactNode;
}

export function SeatPickerPanel({ venue, children }: SeatPickerPanelProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [minimized, setMinimized] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const sectionCount = venue.sections.length;

  const quickPickVenue = buildQuickPickVenue();

  const goNext = useCallback(() => {
    setCurrentSection(s => Math.min(s + 1, sectionCount - 1));
  }, [sectionCount]);

  const goPrev = useCallback(() => {
    setCurrentSection(s => Math.max(s - 1, 0));
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMinimized(m => !m);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleGridEdge = useCallback((direction: 'prev' | 'next') => {
    if (showAll) return;
    if (direction === 'next') {
      const btn = document.querySelector<HTMLButtonElement>('button[aria-label="Next section"]');
      btn?.focus();
    } else {
      const btn = document.querySelector<HTMLButtonElement>('button[aria-label="Previous section"]');
      btn?.focus();
    }
  }, [showAll]);

  const slidePx = Math.max(8, 32 - currentSection * 1.5);
  const animName = showAll ? `sectionSlideIn-all` : `sectionSlideIn-${currentSection}`;

  const content = showAll
    ? <SeatMap venue={quickPickVenue} visibleSectionIndex={0} />
    : (children ?? <SeatMap venue={venue} visibleSectionIndex={currentSection} onGridEdge={handleGridEdge} />);

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-lg border border-white/20 bg-neutral-900/80 px-4 py-2 text-xs text-white shadow-lg backdrop-blur-md transition-colors hover:bg-white/20"
        aria-label="Show seat map"
      >
        ▲ Show Map
      </button>
    );
  }

  return (
    <div
      className="absolute bottom-6 left-1/2 z-10 h-72 w-[80rem] max-w-[96vw] -translate-x-1/2 rounded-xl border border-white/20 bg-black/10 p-3 shadow-2xl backdrop-blur-md"
      style={{ WebkitBackdropFilter: 'blur(6px)', backdropFilter: 'blur(6px)' }}
    >
      <div className="flex h-full w-full flex-col">
        <div className="relative flex-1 overflow-hidden">
          <button
            onClick={() => setMinimized(true)}
            className="absolute right-1 top-1 z-20 rounded bg-white/10 px-2 py-0.5 text-xs text-white/70 transition-colors hover:bg-white/20"
            aria-label="Minimize seat map"
          >
            ▼
          </button>
          <div
            key={showAll ? 'all' : currentSection}
            className="flex h-full w-full items-center justify-center"
            style={{ animation: `${animName} 0.35s ease-out` }}
          >
            {content}
          </div>
        </div>
        <div className="flex items-center justify-between px-1 pt-1">
          {showAll ? (
            <>
              <button
                onClick={() => setShowAll(false)}
                className="rounded bg-white/10 px-3 py-1 text-xs text-white transition-colors hover:bg-white/20"
              >
                ← Sections
              </button>
              <span className="text-xs text-white/70">All Seats — 1 / 1</span>
              <div />
            </>
          ) : (
            <>
              <button
                onClick={goPrev}
                disabled={currentSection === 0}
                className="rounded bg-white/10 px-3 py-1 text-xs text-white transition-colors hover:bg-white/20 disabled:opacity-30"
                aria-label="Previous section"
              >
                ← Prev
              </button>
              <span className="text-xs text-white/70">
                {venue.sections[currentSection]?.label ?? ''} — {currentSection + 1} / {sectionCount}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setShowAll(true)}
                  className="rounded bg-white/10 px-3 py-1 text-xs text-white transition-colors hover:bg-white/20"
                >
                  All
                </button>
                <button
                  onClick={goNext}
                  disabled={currentSection === sectionCount - 1}
                  className="rounded bg-white/10 px-3 py-1 text-xs text-white transition-colors hover:bg-white/20 disabled:opacity-30"
                  aria-label="Next section"
                >
                  Next →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <style>{`
        @keyframes ${animName} {
          from {
            opacity: 0;
            transform: translateX(${showAll ? 32 : slidePx}px);
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
