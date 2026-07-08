import { useCallback, useMemo, useState, useRef } from 'react';
import type { SeatStatus, Venue } from '@/types';
import { Seat } from '@/components/Seat';
import { useSelectionContext } from '@/context/SelectionContext';

export interface SeatMapProps {
  venue: Venue;
  visibleSectionIndex?: number;
  onGridEdge?: (direction: 'prev' | 'next') => void;
}

interface GridEntry {
  id: string;
  row: number;
  col: number;
}

export function SeatMap({ venue, visibleSectionIndex = -1, onGridEdge }: SeatMapProps) {
  const { selectedSeatIds, toggleSeat, setActiveSeat } = useSelectionContext();
  const [focusedSeatId, setFocusedSeatId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const selectedSet = useMemo(() => new Set(selectedSeatIds), [selectedSeatIds]);

  const sections = useMemo(() => {
    if (visibleSectionIndex >= 0 && visibleSectionIndex < venue.sections.length) {
      return [venue.sections[visibleSectionIndex]];
    }
    return venue.sections;
  }, [venue, visibleSectionIndex]);

  const seatStatusById = useMemo(() => {
    const map = new Map<string, SeatStatus>();
    sections.forEach((section) => {
      section.rows.forEach((row) => {
        row.seats.forEach((seat) => {
          map.set(seat.id, seat.status);
        });
      });
    });
    return map;
  }, [sections]);

  const focusSeat = useCallback((seatId: string) => {
    setFocusedSeatId(seatId);
    const el = document.getElementById(seatId);
    el?.focus();
  }, []);

  const handleSeatFocus = useCallback((seatId: string) => {
    setFocusedSeatId(seatId);
  }, []);

  const grid = useMemo(() => {
    const rows = new Map<number, GridEntry[]>();
    const byId = new Map<string, GridEntry>();
    sections.forEach((section) => {
      section.rows.forEach((row) => {
        const entries: GridEntry[] = [];
        row.seats.forEach((seat) => {
          const entry: GridEntry = { id: seat.id, row: row.index, col: seat.col };
          entries.push(entry);
          byId.set(seat.id, entry);
        });
        entries.sort((a, b) => a.col - b.col);
        rows.set(row.index, entries);
      });
    });
    return { rows, byId };
  }, [sections]);

  const handleSeatClick = useCallback(
    (seatId: string) => {
      const status = seatStatusById.get(seatId);
      if (!status) return;
      toggleSeat(seatId, status);
      setActiveSeat(seatId);
      focusSeat(seatId);
    },
    [seatStatusById, toggleSeat, setActiveSeat, focusSeat],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const current = focusedSeatId;
      if (!current) return;
      const entry = grid.byId.get(current);
      if (!entry) return;

      let nextId: string | null = null;
      const sortedRows = [...grid.rows.keys()].sort((a, b) => a - b);
      const rowIdx = sortedRows.indexOf(entry.row);
      const sameRow = grid.rows.get(entry.row);

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (sameRow) {
          const idx = sameRow.findIndex(g => g.id === current);
          if (idx < sameRow.length - 1) {
            nextId = sameRow[idx + 1].id;
          } else if (rowIdx === sortedRows.length - 1) {
            onGridEdge?.('next');
          }
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (sameRow) {
          const idx = sameRow.findIndex(g => g.id === current);
          if (idx > 0) {
            nextId = sameRow[idx - 1].id;
          } else if (rowIdx === 0) {
            onGridEdge?.('prev');
          }
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (rowIdx < sortedRows.length - 1) {
          const nextRowSeats = grid.rows.get(sortedRows[rowIdx + 1]);
          if (nextRowSeats && nextRowSeats.length > 0) {
            const colIdx = Math.min(entry.col - 1, nextRowSeats.length - 1);
            nextId = nextRowSeats[colIdx].id;
          }
        } else {
          onGridEdge?.('next');
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (rowIdx > 0) {
          const prevRowSeats = grid.rows.get(sortedRows[rowIdx - 1]);
          if (prevRowSeats && prevRowSeats.length > 0) {
            const colIdx = Math.min(entry.col - 1, prevRowSeats.length - 1);
            nextId = prevRowSeats[colIdx].id;
          }
        } else {
          onGridEdge?.('prev');
        }
      }

      if (nextId) {
        focusSeat(nextId);
        handleSeatClick(nextId);
      }
    },
    [focusedSeatId, grid, focusSeat, handleSeatClick, onGridEdge],
  );

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${venue.map.width} ${venue.map.height}`}
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
      role="img"
      aria-label={`Seating map for ${venue.name}`}
      onKeyDown={handleKeyDown}
    >
      <g transform="translate(0,40)">
        {sections.map((section) =>
          section.rows.map((row) =>
            row.seats.map((seat) => (
              <Seat
                key={seat.id}
                seat={seat}
                sectionLabel={section.label}
                selected={selectedSet.has(seat.id)}
                focused={focusedSeatId === seat.id}
                onClick={handleSeatClick}
                onFocus={handleSeatFocus}
              />
            )),
          ),
        )}
      </g>
    </svg>
  );
}
