import { useMemo } from 'react';
import type { Venue } from '@/types';
import { useSelectionContext } from '@/context/SelectionContext';
import { getPriceForTier } from '@/constants/priceTiers';
import { buildQuickPickVenue } from '@/utils/quickPickSeats';

function buildPriceMap(venue: Venue): Map<string, number> {
  const map = new Map<string, number>();
  venue.sections.forEach((section) => {
    section.rows.forEach((row) => {
      row.seats.forEach((seat) => {
        map.set(seat.id, getPriceForTier(seat.priceTier));
      });
    });
  });
  return map;
}

export interface BillingBoxProps {
  venue: Venue;
}

export function BillingBox({ venue }: BillingBoxProps) {
  const { selectedSeatIds } = useSelectionContext();

  const seatPriceMap = useMemo(() => {
    const map = buildPriceMap(venue);
    buildPriceMap(buildQuickPickVenue()).forEach((price, id) => map.set(id, price));
    return map;
  }, [venue]);

  const total = useMemo(() => {
    return selectedSeatIds.reduce((sum, id) => {
      return sum + (seatPriceMap.get(id) ?? 0);
    }, 0);
  }, [selectedSeatIds, seatPriceMap]);

  const count = selectedSeatIds.length;

  return (
    <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-1.5">
      <div className="rounded-lg border border-amber-200/10 bg-neutral-900/80 px-4 py-2 shadow-lg backdrop-blur-md">
        <div className="text-right text-xs text-neutral-400">
          Selected: <span className="font-medium text-white">{count}</span>
          {count > 0 && <span className="ml-1">/ 8</span>}
        </div>
        {count > 0 && (
          <div className="text-right text-lg font-semibold text-amber-300">
            ${total.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
}
