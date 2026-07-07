import type { SeatVisualState } from '@/types';

export interface SeatStatusThemeEntry {
  fill: string;
  stroke: string;
  hoverFill: string;
  cursor: 'pointer' | 'not-allowed';
  legendLabel: string;
}

/**
 * Single source of truth for how each seat visual state is styled.
 * Every component that needs a color, cursor, or legend text for a
 * seat status should read from this map — never hardcode colors inline.
 */
export const SEAT_STATUS_THEME: Record<SeatVisualState, SeatStatusThemeEntry> = {
  available: {
    fill: '#ffffff',
    stroke: '#cbd5e1',
    hoverFill: '#f8fafc',
    cursor: 'pointer',
    legendLabel: 'Available',
  },
  held: {
    fill: '#94a3b8',
    stroke: '#475569',
    hoverFill: '#cbd5e1',
    cursor: 'not-allowed',
    legendLabel: 'Held',
  },
  reserved: {
    fill: '#94a3b8',
    stroke: '#475569',
    hoverFill: '#cbd5e1',
    cursor: 'not-allowed',
    legendLabel: 'Reserved',
  },
  sold: {
    fill: '#94a3b8',
    stroke: '#475569',
    hoverFill: '#cbd5e1',
    cursor: 'not-allowed',
    legendLabel: 'Sold',
  },
  selected: {
    fill: '#facc15',
    stroke: '#a16207',
    hoverFill: '#fde047',
    cursor: 'pointer',
    legendLabel: 'Selected',
  },
};

/** Stable, predictable order for rendering a legend. */
export const SEAT_STATUS_LEGEND_ORDER: SeatVisualState[] = [
  'available',
  'selected',
  'held',
  'reserved',
  'sold',
];