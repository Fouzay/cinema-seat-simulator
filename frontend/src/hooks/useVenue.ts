import { useEffect, useState } from 'react';
import type { Venue } from '@/types';
import { DEFAULT_VENUE_PATH } from '@/constants/venueConfig';

export interface UseVenueResult {
  venue: Venue | null;
  loading: boolean;
  error: string | null;
}

export function useVenue(venuePath: string = DEFAULT_VENUE_PATH): UseVenueResult {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadVenue(): Promise<void> {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(venuePath);

        if (!response.ok) {
          throw new Error(`Failed to load venue (${response.status})`);
        }

        const data = (await response.json()) as Venue;

        if (!cancelled) {
          setVenue(data);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Unknown error loading venue';
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadVenue();

    return () => {
      cancelled = true;
    };
  }, [venuePath]);

  return { venue, loading, error };
}