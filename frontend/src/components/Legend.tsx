import type { SeatVisualState } from '@/types';
import { SEAT_STATUS_THEME, SEAT_STATUS_LEGEND_ORDER } from '@/constants/seatStatusTheme';

export function Legend() {
  return (
    <div className="absolute top-4 left-4 z-20 rounded-lg border border-white/10 bg-neutral-900/80 px-3 py-2 shadow-lg backdrop-blur-md">
      <div className="flex flex-wrap gap-3">
        {SEAT_STATUS_LEGEND_ORDER.map((state: SeatVisualState) => (
          <div key={state} className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 12 12">
              <rect
                x="0"
                y="0"
                width="12"
                height="12"
                rx="2"
                fill={SEAT_STATUS_THEME[state].fill}
                stroke={SEAT_STATUS_THEME[state].stroke}
                strokeWidth="1"
              />
            </svg>
            <span className="text-xs text-neutral-400">{SEAT_STATUS_THEME[state].legendLabel}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
