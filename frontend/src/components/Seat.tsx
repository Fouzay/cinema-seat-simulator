import { memo, useCallback } from 'react';
import type { Seat as SeatData, SeatVisualState } from '@/types';
import { SEAT_STATUS_THEME } from '@/constants/seatStatusTheme';
import { SEAT_RADIUS } from '@/constants/venueConfig';

export interface SeatProps {
  seat: SeatData;
  sectionLabel: string;
  selected?: boolean;
  focused?: boolean;
  onClick?: (seatId: string) => void;
}

function SeatComponent({ seat, sectionLabel, selected = false, focused = false, onClick }: SeatProps) {
  const visualState: SeatVisualState = selected ? 'selected' : seat.status;
  const theme = SEAT_STATUS_THEME[visualState];

  const handleClick = useCallback(() => {
    onClick?.(seat.id);
  }, [onClick, seat.id]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.(seat.id);
      }
    },
    [onClick, seat.id],
  );

  return (
    <rect
      x={seat.x - SEAT_RADIUS}
      y={seat.y - SEAT_RADIUS}
      width={SEAT_RADIUS * 2}
      height={SEAT_RADIUS * 2}
      fill={theme.fill}
      stroke={focused || selected ? '#facc15' : theme.stroke}
      strokeWidth={focused || selected ? 2.5 : 1}
      rx={3}
      style={{ cursor: theme.cursor }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${sectionLabel} Row ${seat.id.split('-')[1]} Seat ${seat.id.split('-')[2]}, ${visualState}`}
      aria-pressed={selected}
    />
  );
}

export const Seat = memo(SeatComponent);
