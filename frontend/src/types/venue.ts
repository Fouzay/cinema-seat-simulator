export type SeatStatus = 'available' | 'reserved' | 'sold' | 'held';

export type SeatVisualState = SeatStatus | 'selected';

export type PriceTierId = number;

export interface Seat {
  id: string;
  col: number;
  x: number;
  y: number;
  priceTier: PriceTierId;
  status: SeatStatus;
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