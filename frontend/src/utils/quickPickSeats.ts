import type { Venue } from '@/types';

const COLS = 50;
const ROWS = 20;
const SEAT_SPACING_X = 56;
const SEAT_SPACING_Y = 48;
const START_X = 20;
const START_Y = 30;
const MAP_WIDTH = 2800;
const MAP_HEIGHT = 800;

const statuses: Array<'available' | 'sold' | 'reserved' | 'held'> = ['available', 'available', 'available', 'available', 'sold', 'available', 'reserved', 'available', 'held', 'available'];

export function buildQuickPickVenue(): Venue {
  const rows = [];
  for (let row = 1; row <= ROWS; row++) {
    const seats = [];
    for (let col = 1; col <= COLS; col++) {
      const seatIndex = (row - 1) * COLS + (col - 1);
      const priceTier = row <= 4 ? 1 : row <= 8 ? 2 : row <= 12 ? 3 : row <= 16 ? 4 : 5;
      seats.push({
        id: `QP-${row}-${String(col).padStart(2, '0')}`,
        col,
        x: START_X + (col - 1) * SEAT_SPACING_X,
        y: START_Y + (row - 1) * SEAT_SPACING_Y,
        priceTier,
        status: statuses[seatIndex % statuses.length],
      });
    }
    rows.push({ index: row, seats });
  }

  return {
    venueId: 'quick-pick',
    name: 'Quick Pick',
    map: { width: MAP_WIDTH, height: MAP_HEIGHT },
    sections: [{
      id: 'QP',
      label: 'All Seats',
      transform: { x: 0, y: 0, scale: 1 },
      rows,
    }],
  };
}
