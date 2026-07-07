import { describe, it, expect, beforeEach } from 'vitest';
import { selectionReducer, loadInitialState } from './selectionReducer';
import { SELECTION_STORAGE_KEY } from '@/constants/selection';

beforeEach(() => {
  localStorage.clear();
});

describe('selectionReducer', () => {
  it('adds a seatId on TOGGLE_SEAT when not selected', () => {
    const state = { selectedSeatIds: [] as readonly string[] };
    const next = selectionReducer(state, { type: 'TOGGLE_SEAT', seatId: 'A-1-1' });
    expect(next.selectedSeatIds).toEqual(['A-1-1']);
  });

  it('removes a seatId on TOGGLE_SEAT when already selected', () => {
    const state = { selectedSeatIds: ['A-1-1'] as readonly string[] };
    const next = selectionReducer(state, { type: 'TOGGLE_SEAT', seatId: 'A-1-1' });
    expect(next.selectedSeatIds).toEqual([]);
  });

  it('clears all seats on CLEAR_SELECTION', () => {
    const state = { selectedSeatIds: ['A-1-1', 'B-2-3'] as readonly string[] };
    const next = selectionReducer(state, { type: 'CLEAR_SELECTION' });
    expect(next.selectedSeatIds).toEqual([]);
  });

  it('returns the same state for unknown action types', () => {
    const state = { selectedSeatIds: ['A-1-1'] as readonly string[] };
    const next = selectionReducer(state, { type: 'UNKNOWN' } as never);
    expect(next).toBe(state);
  });
});

describe('loadInitialState', () => {
  it('returns empty array when nothing is stored', () => {
    const state = loadInitialState();
    expect(state.selectedSeatIds).toEqual([]);
  });

  it('parses stored JSON array', () => {
    localStorage.setItem(SELECTION_STORAGE_KEY, JSON.stringify(['A-1-1', 'B-2-3']));
    const state = loadInitialState();
    expect(state.selectedSeatIds).toEqual(['A-1-1', 'B-2-3']);
  });

  it('returns empty array for corrupted data', () => {
    localStorage.setItem(SELECTION_STORAGE_KEY, 'not-json');
    const state = loadInitialState();
    expect(state.selectedSeatIds).toEqual([]);
  });
});
