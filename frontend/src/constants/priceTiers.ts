import type { PriceTierId } from '@/types';

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