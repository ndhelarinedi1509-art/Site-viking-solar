'use client';

import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

export function ContactMap() {
  const { ref, isInView } = useInView();
  return (
    <section className="pb-12 sm:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={cn(
            'relative flex h-[450px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-bg-card text-center transition-all duration-700 ease-premium',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.05)_0%,transparent_60%)]" />

          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" className="text-green/70 mb-4">
            <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
          </svg>

          <h4 className="text-[1.5rem] font-bold text-white mb-2">Nos Bureaux à Kinshasa</h4>
          <p className="text-base text-gray-500">Bientôt disponible sur la carte interactive</p>
        </div>
      </div>
    </section>
  );
}
