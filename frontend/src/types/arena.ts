/**
 * A seat's canonical 3D world position — computed exactly once per venue
 * load (see utils/arenaLayout.ts), never recomputed at click time. Both
 * the camera-jump logic and seat rendering read from this same data, so
 * they can never drift out of sync.
 */
export interface ArenaSeatPosition {
  seatId: string;
  sectionIndex: number;
  /** Horizontal offset from this section's own cluster center, always
   * bounded to [-CLUSTER_WIDTH/2, CLUSTER_WIDTH/2] by construction. */
  worldX: number;
  /** Vertical offset from viewport center in px — front rows at ~0,
   * back rows further down. Used for both camera positioning and
   * seat rendering so they always match. */
  worldY: number;
  /** Depth — sections stack back-to-back, so this only changes between
   * sections, never within one. */
  worldZ: number;
  /** 0 = front row of this section, 1 = back row — used for pitch. */
  rowFrac: number;
  /** Vertical placement (%) within the preview frame. */
  topPct: number;
}
