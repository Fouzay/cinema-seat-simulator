import { useMemo } from 'react';
import type { Venue } from '@/types';
import { getPriceForTier } from '@/constants/priceTiers';
import { useSelectionContext } from '@/context/SelectionContext';
import { SEAT_STATUS_THEME } from '@/constants/seatStatusTheme';
import { buildQuickPickVenue } from '@/utils/quickPickSeats';

function findSeat(venue: Venue, seatId: string) {
  for (const section of venue.sections) {
    for (const row of section.rows) {
      for (const seat of row.seats) {
        if (seat.id === seatId) {
          return { section, row, seat, col: seat.col, rowIndex: row.index };
        }
      }
    }
  }
  return null;
}

export interface SeatDetailsPanelProps {
  venue: Venue;
  seatId: string;
}

export function SeatDetailsPanel({ venue, seatId }: SeatDetailsPanelProps) {
  const { setActiveSeat, toggleSeat } = useSelectionContext();

  const seatInfo = useMemo(() => {
    return findSeat(venue, seatId) ?? findSeat(buildQuickPickVenue(), seatId) ?? null;
  }, [venue, seatId]);

  if (!seatInfo) return null;

  const { section, rowIndex, col, seat } = seatInfo;
  const price = getPriceForTier(seat.priceTier);
  const statusLabel = SEAT_STATUS_THEME[seat.status].legendLabel;

  return (
    <div className="absolute left-4 top-12 z-20 min-w-48 rounded-lg border border-white/10 bg-neutral-900/90 p-4 shadow-xl backdrop-blur-md">
      <h3 className="mb-2 text-sm font-semibold text-white">{section.label}</h3>
      <dl className="space-y-1 text-xs text-neutral-300">
        <div className="flex justify-between">
          <dt>Row:</dt>
          <dd className="font-medium text-white">{rowIndex}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Seat:</dt>
          <dd className="font-medium text-white">{col}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Price:</dt>
          <dd className="font-medium text-amber-300">${price.toFixed(2)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Status:</dt>
          <dd className={`font-medium ${seat.status === 'available' ? 'text-green-400' : 'text-neutral-400'}`}>
            {statusLabel}
          </dd>
        </div>
      </dl>
      <button
        onClick={() => {
          toggleSeat(seat.id, seat.status);
          setActiveSeat(null);
        }}
        className="mt-3 w-full rounded bg-white/10 px-3 py-1.5 text-xs text-white transition-colors hover:bg-white/20"
      >
        Close
      </button>
    </div>
  );
}
