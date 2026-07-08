import type { SelectionState } from '@/types';
import { SELECTION_STORAGE_KEY } from '@/constants/selection';

export type SelectionAction = { type: 'TOGGLE_SEAT'; seatId: string } | { type: 'CLEAR_SELECTION' };

const defaultState: SelectionState = {
  selectedSeatIds: [],
};

export function loadInitialState(): SelectionState {
  try {
    const stored = localStorage.getItem(SELECTION_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as string[];
      if (Array.isArray(parsed)) {
        return { selectedSeatIds: parsed };
      }
    }
  } catch {
  }
  return defaultState;
}

export function selectionReducer(state: SelectionState, action: SelectionAction): SelectionState {
  switch (action.type) {
    case 'TOGGLE_SEAT': {
      const isSelected = state.selectedSeatIds.includes(action.seatId);
      return {
        selectedSeatIds: isSelected
          ? state.selectedSeatIds.filter((id) => id !== action.seatId)
          : [...state.selectedSeatIds, action.seatId],
      };
    }
    case 'CLEAR_SELECTION':
      return defaultState;
    default:
      return state;
  }
}
