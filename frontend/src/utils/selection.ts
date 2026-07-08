import type { SeatStatus } from '@/types';

export function isSeatSelectable(status: SeatStatus): boolean {
  return status === 'available';
}