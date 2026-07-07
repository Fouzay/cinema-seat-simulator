/**
 * Core domain types for the venue / seating map data model.
 *
 * These interfaces mirror the shape of the venue JSON (see public/venue-*.json)
 * and match the schema given in the assignment brief, extended with a small
 * set of optional visual/transform fields reserved for future animation work
 * (rotation, scale, opacity, label) so the seat model doesn't need a schema
 * change later.
 */

export type SeatStatus = 'available' | 'reserved' | 'sold' | 'held';

/**
 * The full set of visual states a seat can be rendered in.
 * 'selected' is not part of the raw data — it's a derived, client-side
 * state applied on top of an 'available' seat once the user picks it.
 */
export type SeatVisualState = SeatStatus | 'selected';

/**
 * Numeric identifier for a pricing tier. The actual dollar amount for a
 * tier is looked up separately (see constants/priceTiers.ts) rather than
 * being embedded in the seat itself.
 */
export type PriceTierId = number;

export interface Seat {
  id: string;
  col: number;
  x: number;
  y: number;
  priceTier: PriceTierId;
  status: SeatStatus;

  /**
   * Optional visual/transform properties, reserved for future animation
   * work (e.g. faking perspective/curvature to match the demo). Unused
   * today, but present on the type so components can consume them
   * without a schema change.
   */
  rotation?: number;
  scale?: number;
  opacity?: number;
  label?: string;
}

export interface Row {
  index: number;
  seats: Seat[];
}

export interface SectionTransform {
  x: number;
  y: number;
  scale: number;
  rotation?: number;
}

export interface Section {
  id: string;
  label: string;
  transform: SectionTransform;
  rows: Row[];
}

export interface VenueMap {
  width: number;
  height: number;
}

export interface Venue {
  venueId: string;
  name: string;
  map: VenueMap;
  sections: Section[];
}