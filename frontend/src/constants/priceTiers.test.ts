import { describe, it, expect } from 'vitest';
import { PRICE_BY_TIER, getPriceForTier, DEFAULT_TIER_PRICE } from './priceTiers';

describe('PRICE_BY_TIER', () => {
  it('defines prices for tiers 1 through 5', () => {
    expect(PRICE_BY_TIER[1]).toBe(150);
    expect(PRICE_BY_TIER[2]).toBe(110);
    expect(PRICE_BY_TIER[3]).toBe(85);
    expect(PRICE_BY_TIER[4]).toBe(60);
    expect(PRICE_BY_TIER[5]).toBe(40);
  });
});

describe('getPriceForTier', () => {
  it('returns the mapped price for known tiers', () => {
    expect(getPriceForTier(1)).toBe(150);
    expect(getPriceForTier(3)).toBe(85);
  });

  it('falls back to DEFAULT_TIER_PRICE for unknown tiers', () => {
    expect(getPriceForTier(99)).toBe(DEFAULT_TIER_PRICE);
  });
});
