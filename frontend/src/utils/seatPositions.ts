import type { Venue } from '@/types';

export interface SeatWorldPosition {
  seatId: string;
  clusterId: string;
  worldX: number;
  worldY: number;
  worldZ: number;
}

// Screen is at SCREEN_Z (-600) — fixed position furthest from viewer.
// Clusters arranged front-to-back at POSITIVE Z (no negative sign).
// Cluster 0 (front-most, closest to screen): Z = 0..150
// Cluster 19 (back-most, furthest from screen): Z = 1900..2050
export const CLUSTER_HALF_WIDTH = 200;
const CLUSTER_SPACING = 100;
const CLUSTER_WIDTH = CLUSTER_HALF_WIDTH * 2;
const CLUSTER_DEPTH = 150;

export function computeSeatPositions(venue: Venue): Map<string, SeatWorldPosition> {
  const positions = new Map<string, SeatWorldPosition>();

  venue.sections.forEach((section, si) => {
    const numRows = section.rows.length;

    section.rows.forEach((row) => {
      const seatsInRow = row.seats.length;
      const rowFrac = numRows <= 1 ? 0.5 : (row.index - 1) / (numRows - 1);

      row.seats.forEach((seat) => {
        const colFrac = seatsInRow <= 1 ? 0.5 : (seat.col - 1) / (seatsInRow - 1);

        positions.set(seat.id, {
          seatId: seat.id,
          clusterId: section.id,
          worldX: (colFrac - 0.5) * CLUSTER_WIDTH,
          worldY: -rowFrac * 80,
          worldZ: si * CLUSTER_SPACING + rowFrac * CLUSTER_DEPTH,
        });
      });
    });
  });

  return positions;
}
