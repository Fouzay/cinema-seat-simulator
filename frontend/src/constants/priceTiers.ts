import type { PriceTierId } from '@/types';

/**
 * ASSUMPTION: the assignment's venue.json schema gives each seat a
 * `priceTier` number but never defines what each tier actually costs.
 * These dollar amounts are a placeholder mapping — swap in real values
 * whenever/if real pricing is provided.
 */
export const PRICE_BY_TIER: Record<PriceTierId, number> = {
  1: 150,
  2: 110,
  3: 85,
  4: 60,
  5: 40,
};

export const DEFAULT_TIER_PRICE = 50;

export function getPriceForTier(tier: PriceTierId): number {
  return PRICE_BY_TIER[tier] ?? DEFAULT_TIER_PRICE;
}