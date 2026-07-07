import { describe, it, expect } from 'vitest';
import { buildArenaLayout } from './arenaLayout';
import type { Venue } from '@/types';

function makeVenue(overrides?: Partial<Venue>): Venue {
  return {
    venueId: 'test',
    name: 'Test',
    map: { width: 2000, height: 1200 },
    sections: [
      {
        id: 'A',
        label: 'Section A',
        transform: { x: 100, y: 100, scale: 1 },
        rows: [
          { index: 1, seats: [{ id: 'A-1-1', col: 1, x: 0, y: 0, priceTier: 1, status: 'available' }] },
        ],
      },
    ],
    ...overrides,
  };
}

describe('buildArenaLayout', () => {
  it('returns a Map with the correct number of entries', () => {
    const venue = makeVenue();
    const layout = buildArenaLayout(venue);
    expect(layout).toBeInstanceOf(Map);
    expect(layout.size).toBe(1);
  });

  it('computes worldX centered around 0', () => {
    const venue = makeVenue();
    venue.sections[0].rows[0].seats = [
      { id: 'A-1-1', col: 1, x: 0, y: 0, priceTier: 1, status: 'available' },
      { id: 'A-1-2', col: 2, x: 0, y: 0, priceTier: 1, status: 'available' },
    ];
    const layout = buildArenaLayout(venue);
    const s1 = layout.get('A-1-1')!;
    const s2 = layout.get('A-1-2')!;
    expect(s1.worldX).toBeLessThan(0);
    expect(s2.worldX).toBeGreaterThan(0);
  });

  it('computes worldZ by multiplying section index by SECTION_Z_STEP_PX', () => {
    const venue = makeVenue();
    venue.sections.push({
      id: 'B',
      label: 'Section B',
      transform: { x: 200, y: 100, scale: 1 },
      rows: [{ index: 1, seats: [{ id: 'B-1-1', col: 1, x: 0, y: 0, priceTier: 2, status: 'available' }] }],
    });
    const layout = buildArenaLayout(venue);
    const a = layout.get('A-1-1')!;
    const b = layout.get('B-1-1')!;
    expect(b.worldZ).toBeGreaterThan(a.worldZ);
  });

  it('stores seatId matching the input seat id', () => {
    const venue = makeVenue();
    const layout = buildArenaLayout(venue);
    const pos = layout.get('A-1-1')!;
    expect(pos.seatId).toBe('A-1-1');
  });

  it('handles multiple rows per section', () => {
    const venue = makeVenue();
    venue.sections[0].rows = [
      { index: 1, seats: [{ id: 'A-1-1', col: 1, x: 0, y: 0, priceTier: 1, status: 'available' }] },
      { index: 2, seats: [{ id: 'A-2-1', col: 1, x: 0, y: 0, priceTier: 1, status: 'available' }] },
    ];
    const layout = buildArenaLayout(venue);
    const row1 = layout.get('A-1-1')!;
    const row2 = layout.get('A-2-1')!;
    expect(row2.worldY).toBeLessThan(row1.worldY);
  });
});
