import type { ArenaSeatPosition, Venue } from '@/types';
import { CLUSTER_WIDTH_PX, SECTION_Z_STEP_PX, ROW_Z_STEP_PX, SECTION_Y_STEP_PX, BASE_Y_OFFSET_PX, ROW_Y_STEP_PX } from '@/constants/preview';

/**
 * Builds every seat's canonical 3D world position ONCE per venue load.
 * Sections are stacked back-to-back along the depth (Z) axis — not
 * spread side-by-side — so each section's own horizontal spread is
 * always the same fixed CLUSTER_WIDTH_PX, regardless of which section
 * it is. That's what keeps camera yaw naturally bounded: worldX can
 * never exceed CLUSTER_WIDTH_PX / 2 by construction, so no clamping
 * hack is needed downstream.
 *
 * This is the single source of truth — SeatPickerPanel/SeatMap only
 * ever look up a seatId here; they never generate or recompute a
 * position themselves.
 */
export function buildArenaLayout(venue: Venue): Map<string, ArenaSeatPosition> {
  const layout = new Map<string, ArenaSeatPosition>();

  venue.sections.forEach((section, sectionIndex) => {
      const worldZ = sectionIndex * SECTION_Z_STEP_PX;
      const rowCount = section.rows.length;

      section.rows.forEach((row) => {
        const rowFrac = rowCount <= 1 ? 0.5 : (row.index - 1) / (rowCount - 1);
        const topPct = 88 + rowFrac * 10;
        const worldY = BASE_Y_OFFSET_PX - (sectionIndex * SECTION_Y_STEP_PX + rowFrac * ROW_Y_STEP_PX);
        const rowZ = worldZ + rowFrac * ROW_Z_STEP_PX;
      const seatsInRow = row.seats.length;

      row.seats.forEach((seat) => {
        const colFrac = seatsInRow <= 1 ? 0.5 : (seat.col - 1) / (seatsInRow - 1);
        const worldX = (colFrac - 0.5) * CLUSTER_WIDTH_PX;

        layout.set(seat.id, {
          seatId: seat.id,
          sectionIndex,
          worldX,
          worldY,
          worldZ: rowZ,
          rowFrac,
          topPct,
        });
      });
    });
  });

  return layout;
}
