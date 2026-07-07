/**
 * Generates realistic, arena-shaped venue JSON files for local development
 * and performance testing.
 *
 * The assignment only provides a two-seat schema example — this script
 * produces full venues (curved rows, curved sections, growing row lengths
 * as you move away from the screen) so we can profile rendering at both a
 * small "demo" scale and the ~15,000-seat "performance" scale the brief
 * calls out explicitly.
 *
 * Usage:
 *   npm run generate:venue -- demo
 *   npm run generate:venue -- performance
 *   npm run generate:venue           (generates both, default)
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import type { Venue, Section, Row, Seat, SeatStatus } from '../src/types/venue';

interface TierConfig {
  /** Section ids that share this tier, arranged left-to-right. */
  sectionIds: string[];
  sectionLabelPrefix: string;
  rowCount: number;
  innerRadius: number;
  outerRadius: number;
  /** Total angular width of the tier, in degrees, centered on 0 (straight down). */
  angleSpanDeg: number;
  /** Approximate spacing between seat centers along a row's arc, in px. */
  seatSpacingPx: number;
  /** Gap between adjacent sections in the same tier, in degrees. */
  sectionGapDeg: number;
}

interface GenerateConfig {
  name: string;
  venueId: string;
  mapWidth: number;
  mapHeight: number;
  /** Focal point rows curve away from — roughly where the screen sits. */
  center: { x: number; y: number };
  tiers: TierConfig[];
}

const STATUS_WEIGHTS: Array<[SeatStatus, number]> = [
  ['available', 0.72],
  ['reserved', 0.14],
  ['sold', 0.1],
  ['held', 0.04],
];

function pickStatus(rand: () => number): SeatStatus {
  const roll = rand();
  let cumulative = 0;
  for (const [status, weight] of STATUS_WEIGHTS) {
    cumulative += weight;
    if (roll <= cumulative) return status;
  }
  return 'available';
}

/** Small seeded PRNG so generated venues are reproducible between runs. */
function createRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function priceTierForRow(rowIndex: number, rowCount: number): number {
  // Closer to the screen (early rows in a tier) = pricier. Display
  // heuristic only, not a business rule from the brief.
  const rowT = rowCount === 1 ? 0 : rowIndex / (rowCount - 1);
  return Math.min(5, Math.floor(1 + rowT * 4));
}

function buildSection(
  sectionId: string,
  label: string,
  tier: TierConfig,
  center: GenerateConfig['center'],
  rand: () => number,
): Section {
  const rows: Row[] = [];

  for (let rowIdx = 0; rowIdx < tier.rowCount; rowIdx += 1) {
    const seatGapX = Math.max(92, tier.seatSpacingPx + 40);
    const aisleGapX = Math.max(112, seatGapX + 24);
    const seatGapY = Math.max(108, Math.round(tier.seatSpacingPx * 1.5));
    const layout = [2, 6, 2];
    const seats: Seat[] = [];

    const totalWidth = layout.reduce((sum, groupSize) => sum + groupSize, 0) * seatGapX + 2 * aisleGapX;
    const startX = center.x - totalWidth / 2;

    let currentX = startX;
    let seatCol = 1;

    for (const groupSize of layout) {
      for (let offset = 0; offset < groupSize; offset += 1) {
        const x = currentX + offset * seatGapX;
        const y = center.y + 220 + rowIdx * seatGapY;

        seats.push({
          id: `${sectionId}-${rowIdx + 1}-${String(seatCol).padStart(2, '0')}`,
          col: seatCol,
          x: Math.round(x * 100) / 100,
          y: Math.round(y * 100) / 100,
          priceTier: priceTierForRow(rowIdx, tier.rowCount),
          status: pickStatus(rand),
        });
        seatCol += 1;
      }

      currentX += groupSize * seatGapX + aisleGapX;
    }

    rows.push({ index: rowIdx + 1, seats });
  }

  return {
    id: sectionId,
    label,
    transform: { x: 0, y: 0, scale: 1 },
    rows,
  };
}

function generateVenue(config: GenerateConfig): Venue {
  const rand = createRandom(42);
  const sections: Section[] = [];

  for (const tier of config.tiers) {
    const count = tier.sectionIds.length;
    const totalGapDeg = tier.sectionGapDeg * Math.max(0, count - 1);
    const usableSpanDeg = tier.angleSpanDeg - totalGapDeg;
    const perSectionSpanDeg = usableSpanDeg / count;

    let cursorDeg = -tier.angleSpanDeg / 2;

    tier.sectionIds.forEach((sectionId) => {
      const angleStartDeg = cursorDeg;
      const angleEndDeg = angleStartDeg + perSectionSpanDeg;

      sections.push(
        buildSection(
          sectionId,
          `${tier.sectionLabelPrefix}${sectionId}`,
          tier,
          config.center,
          rand,
        ),
      );

      cursorDeg = angleEndDeg + tier.sectionGapDeg;
    });
  }

  return {
    venueId: config.venueId,
    name: config.name,
    map: { width: config.mapWidth, height: config.mapHeight },
    sections,
  };
}

function countSeats(venue: Venue): number {
  return venue.sections.reduce(
    (sectionTotal, section) =>
      sectionTotal + section.rows.reduce((rowTotal, row) => rowTotal + row.seats.length, 0),
    0,
  );
}

const DEMO_CONFIG: GenerateConfig = {
  name: 'Seat Preview Demo',
  venueId: 'arena-demo',

  mapWidth: 1200,
  mapHeight: 800,

  // Places the centre above the screen so rows become almost straight
  center: {
    x: 600,
    y: -180,
  },

  tiers: [
    {
      // 20 sections × 5 rows × 10 seats = 1000 seats
      sectionIds: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T'],
      sectionLabelPrefix: 'Section ',

      // only 5 rows
      rowCount: 5,

      // make the section very wide and nearly flat
      innerRadius: 500,
      outerRadius: 520,

      // wide angular spread so the row stretches across the whole section
      angleSpanDeg: 140,

      // generous spacing so seats stay far apart
      seatSpacingPx: 70,

      sectionGapDeg: 0,
    },
  ],
};

const PERFORMANCE_CONFIG: GenerateConfig = {
  name: 'Metropolis Arena (Performance Test)',
  venueId: 'arena-performance',
  mapWidth: 2800,
  mapHeight: 2200,
  center: { x: 1400, y: 80 },
  tiers: [
    {
      sectionIds: ['A', 'B', 'C'],
      sectionLabelPrefix: 'Lower Bowl ',
      rowCount: 20,
      innerRadius: 160,
      outerRadius: 480,
      angleSpanDeg: 140,
      seatSpacingPx: 14,
      sectionGapDeg: 3,
    },
    {
      sectionIds: ['D'],
      sectionLabelPrefix: 'Club Level ',
      rowCount: 22,
      innerRadius: 500,
      outerRadius: 780,
      angleSpanDeg: 155,
      seatSpacingPx: 13,
      sectionGapDeg: 0,
    },
    {
      sectionIds: ['E'],
      sectionLabelPrefix: 'Upper Bowl ',
      rowCount: 24,
      innerRadius: 800,
      outerRadius: 1080,
      angleSpanDeg: 165,
      seatSpacingPx: 12,
      sectionGapDeg: 0,
    },
    {
      sectionIds: ['F', 'G'],
      sectionLabelPrefix: 'Balcony ',
      rowCount: 26,
      innerRadius: 1100,
      outerRadius: 1400,
      angleSpanDeg: 172,
      seatSpacingPx: 11,
      sectionGapDeg: 3,
    },
  ],
};

function writeVenue(config: GenerateConfig, outFile: string): void {
  const venue = generateVenue(config);
  const seatCount = countSeats(venue);
  const outDir = path.resolve(process.cwd(), 'public');
  mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, outFile);
  writeFileSync(outPath, JSON.stringify(venue), 'utf-8');
  console.log(`Wrote ${outPath} — ${seatCount.toLocaleString()} seats`);
}

const target = process.argv[2] ?? 'all';

if (target === 'demo' || target === 'all') {
  writeVenue(DEMO_CONFIG, 'venue-demo.json');
}

if (target === 'performance' || target === 'all') {
  writeVenue(PERFORMANCE_CONFIG, 'venue-performance.json');
}

if (!['demo', 'performance', 'all'].includes(target)) {
  console.error(`Unknown target "${target}". Use "demo", "performance", or "all".`);
  process.exit(1);
}
