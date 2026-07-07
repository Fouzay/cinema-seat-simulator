import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { SeatStatus } from '@/types';
import { MAX_SELECTABLE_SEATS, SELECTION_STORAGE_KEY } from '@/constants/selection';
import { isSeatSelectable } from '@/utils/selection';
import { selectionReducer, loadInitialState } from '@/context/selectionReducer';

export interface SelectionContextValue {
  selectedSeatIds: readonly string[];
  toggleSeat: (seatId: string, status: SeatStatus) => void;
  clearSelection: () => void;
  activeSeatId: string | null;
  activeClusterId: string | null;
  setActiveSeat: (seatId: string | null) => void;
  getClusterForSeat: (seatId: string) => string | null;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(selectionReducer, undefined, loadInitialState);
  const [activeSeatId, setActiveSeat] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(SELECTION_STORAGE_KEY, JSON.stringify(state.selectedSeatIds));
    } catch {
      // localStorage may be unavailable
    }
  }, [state.selectedSeatIds]);

  const selectedIdsRef = useRef(state.selectedSeatIds);

  useEffect(() => {
    selectedIdsRef.current = state.selectedSeatIds;
  }, [state.selectedSeatIds]);

  const toggleSeat = useCallback((seatId: string, status: SeatStatus) => {
    const current = selectedIdsRef.current;
    const alreadySelected = current.includes(seatId);

    if (!alreadySelected) {
      if (!isSeatSelectable(status)) return;
      if (current.length >= MAX_SELECTABLE_SEATS) return;
    }

    dispatch({ type: 'TOGGLE_SEAT', seatId });
  }, []);

  const clearSelection = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTION' });
  }, []);

  const getClusterForSeat = useCallback((seatId: string): string | null => {
    // Parse cluster from seat ID format: e.g. "A-1-01" → "A"
    const parts = seatId.split('-');
    return parts.length >= 1 ? parts[0] : null;
  }, []);

  const activeClusterId = activeSeatId ? getClusterForSeat(activeSeatId) : null;

  const value = useMemo<SelectionContextValue>(
    () => ({
      selectedSeatIds: state.selectedSeatIds,
      toggleSeat,
      clearSelection,
      activeSeatId,
      activeClusterId,
      setActiveSeat,
      getClusterForSeat,
    }),
    [state.selectedSeatIds, toggleSeat, clearSelection, activeSeatId, activeClusterId, getClusterForSeat],
  );

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelectionContext(): SelectionContextValue {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelectionContext must be used within a SelectionProvider');
  }
  return context;
}
