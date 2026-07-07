import type { SeatStatus } from '@/types';

/**
 * Centralized selectability rule. Only 'available' seats can be selected.
 * Any future status-based rule changes happen here, in one place.
 */
export function isSeatSelectable(status: SeatStatus): boolean {
  return status === 'available';
}