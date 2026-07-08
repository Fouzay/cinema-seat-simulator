import type { SeatVisualState } from '@/types';

export interface SeatStatusThemeEntry {
  fill: string;
  stroke: string;
  hoverFill: string;
  cursor: 'pointer' | 'not-allowed';
  legendLabel: string;
}

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

export const SEAT_STATUS_LEGEND_ORDER: SeatVisualState[] = [
  'available',
  'selected',
  'held',
  'reserved',
  'sold',
];