export interface SeatLocationInfo {
  sectionId: string;
  sectionIndex: number;
  col: number;
  rowIndex: number;
  rowCount: number;
  seatX: number;
  seatY: number;
}

/**
 * depthFraction: 0 = front row, 1 = back-most row.
 * horizontalOffset: -1 (far left) .. 0 (center) .. 1 (far right).
 * showForegroundRow: true whenever the active seat isn't in the very
 * front row — exactly one row renders in front of the camera, never a
 * stack of multiple rows.
 */
export interface SeatViewParams {
  depthFraction: number;
  horizontalOffset: number;
  showForegroundRow: boolean;
}