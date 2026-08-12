import Image from 'next/image';
import { cn } from '@/lib/utils';

interface SiteLoaderProps {
  exiting?: boolean;
  className?: string;
}

export function SiteLoader({ exiting = false, className }: SiteLoaderProps) {
  return (
    <div
      className={cn('vs-loader-overlay', exiting && 'vs-loaded', className)}
      role="status"
      aria-busy="true"
      aria-label="Chargement du site Viking Solar"
    >
      <div className="vs-loader-corona" aria-hidden="true" />
      <div className="vs-loader-center">
        <div className="vs-loader-logo-wrap" aria-hidden="true">
          <span className="vs-loader-logo-ring" />
          <span className="vs-loader-logo-ring vs-loader-logo-ring-secondary" />
          <Image
            src="/logo.webp"
            alt=""
            width={120}
            height={96}
            className="vs-loader-logo-image"
            priority
          />
        </div>
        <div className="vs-loader-progress-wrap" aria-hidden="true">
          <div className="vs-loader-progress-bar" />
        </div>
      </div>
    </div>
  );
}
