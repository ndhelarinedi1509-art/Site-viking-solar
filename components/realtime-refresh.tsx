'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const REAL_TIME_TABLES = ['page_sections', 'services', 'projects'] as const;
const POLL_INTERVAL_MS = 4000;

export function RealtimeRefresh() {
  const router = useRouter();
  const lastUpdatedAtRef = useRef<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel('public-content-changes');
    let realtimeSubscribed = false;

    try {
      // Register handlers
      for (const table of REAL_TIME_TABLES) {
        channel.on('postgres_changes', { event: '*', schema: 'public', table }, () => {
          router.refresh();
        });
      }

      // Attempt to subscribe to realtime. On some iOS PWA / private contexts
      // WebSocket may be unavailable and attempt will throw "The operation is insecure.".
      // Guard with try/catch and fall back to polling only.
      channel.subscribe();
      realtimeSubscribed = true;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Realtime subscription failed, falling back to polling:', err);
    }

    const poll = async () => {
      try {
        const res = await fetch('/api/site-updated-at', { cache: 'no-store' });
        if (!res.ok) return;
        const json = (await res.json()) as { updatedAt?: string | null };
        const ts = json.updatedAt ?? null;

        if (ts === null) return;
        if (lastUpdatedAtRef.current === null) {
          lastUpdatedAtRef.current = ts;
          return;
        }
        if (ts !== lastUpdatedAtRef.current) {
          lastUpdatedAtRef.current = ts;
          router.refresh();
        }
      } catch {
        // Ignore transient errors; next poll will retry.
      }
    };

    const interval = setInterval(poll, POLL_INTERVAL_MS);
    poll();

    return () => {
      clearInterval(interval);
      try {
        if (realtimeSubscribed) supabase.removeChannel(channel);
      } catch (e) {
        // ignore removal errors
      }
    };
  }, [router]);

  return null;
}
