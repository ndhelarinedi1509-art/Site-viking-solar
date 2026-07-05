'use client';

import { useEffect, useRef, useState } from 'react';

export function useCountUp(end: number, duration = 1800) {
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    function update(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(end * eased);
      if (ref.current) ref.current.textContent = current.toLocaleString('fr-FR');
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }, [started, end, duration]);

  return { ref };
}
