import { useVenue } from '@/hooks/useVenue';
import { PreviewViewport } from '@/components/PreviewViewport';
import { SeatPickerPanel } from '@/components/SeatPickerPanel';
import { SeatDetailsPanel } from '@/components/SeatDetailsPanel';
import { BillingBox } from '@/components/BillingBox';
import {
  SelectionProvider,
  useSelectionContext,
} from '@/context/SelectionContext';
import { Legend } from '@/components/Legend';

function VenueView({
  venue,
}: {
  venue: NonNullable<ReturnType<typeof useVenue>['venue']>;
}) {
  const { activeSeatId } = useSelectionContext();

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-black">
      <PreviewViewport venue={venue} />

      <SeatPickerPanel venue={venue} />

      {activeSeatId && (
        <SeatDetailsPanel
          venue={venue}
          seatId={activeSeatId}
        />
      )}

      <BillingBox venue={venue} />
      <Legend />
    </div>
  );
}

function App() {
  const { venue, loading, error } = useVenue();

  return (
    <SelectionProvider>
      <main className="h-dvh w-full bg-black">
        {loading && (
          <p className="flex h-full items-center justify-center text-neutral-400">
            Loading venue…
          </p>
        )}

        {error && (
          <p className="flex h-full items-center justify-center text-red-400">
            Failed to load venue: {error}
          </p>
        )}

        {venue && <VenueView venue={venue} />}
      </main>
    </SelectionProvider>
  );
}

export default App;