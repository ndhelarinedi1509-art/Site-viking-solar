'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { SiteLoader } from '@/components/layout/site-loader';

const MIN_VISIBLE_MS = 650;
const EXIT_ANIMATION_MS = 800;

export function PageLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let exitTimer: number | undefined;
    let removeTimer: number | undefined;
    const startedAt = window.performance.now();

    setVisible(true);
    setExiting(false);

    const hideLoader = () => {
      const elapsed = window.performance.now() - startedAt;
      const wait = Math.max(MIN_VISIBLE_MS - elapsed, 0);

      exitTimer = window.setTimeout(() => {
        setExiting(true);
        removeTimer = window.setTimeout(() => setVisible(false), EXIT_ANIMATION_MS);
      }, wait);
    };

    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      window.addEventListener('load', hideLoader, { once: true });
    }

    return () => {
      window.removeEventListener('load', hideLoader);
      if (exitTimer !== undefined) window.clearTimeout(exitTimer);
      if (removeTimer !== undefined) window.clearTimeout(removeTimer);
    };
  }, [pathname]);

  if (!visible) return null;

  return <SiteLoader exiting={exiting} />;
}
