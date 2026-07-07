import { useCallback, useMemo } from 'react';
import type { SeatStatus, Venue } from '@/types';
import { Seat } from '@/components/Seat';
import { useSelectionContext } from '@/context/SelectionContext';

export interface SeatMapProps {
  venue: Venue;
  visibleSectionIndex?: number;
}

export function SeatMap({ venue, visibleSectionIndex = -1 }: SeatMapProps) {
  const { selectedSeatIds, toggleSeat, setActiveSeat } = useSelectionContext();

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

  const handleSeatClick = useCallback(
    (seatId: string) => {
      const status = seatStatusById.get(seatId);
      if (!status) return;
      toggleSeat(seatId, status);
      setActiveSeat(seatId);
    },
    [seatStatusById, toggleSeat, setActiveSeat],
  );

  return (
    <svg
      viewBox={`0 0 ${venue.map.width} ${venue.map.height}`}
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
      role="img"
      aria-label={`Seating map for ${venue.name}`}
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
                onClick={handleSeatClick}
              />
            )),
          ),
        )}
      </g>
    </svg>
  );
}
