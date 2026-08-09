'use client';

const VISITOR_KEY = 'viking-visitor-id';

export function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  let id = window.localStorage.getItem(VISITOR_KEY);
  if (!id || id.length < 8) {
    id = crypto.randomUUID();
    window.localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export function timeAgo(iso: string | null, lang: string): string {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const seconds = Math.floor((Date.now() - then) / 1000);
  const isFr = lang === 'fr';

  const label = (value: number, unit: string) => {
    if (isFr) {
      const u = value > 1 ? `${unit}s` : unit;
      return `il y a ${value} ${u}`;
    }
    const u = value > 1 ? `${unit}s` : unit;
    return `${value} ${u} ago`;
  };

  if (seconds < 60) return isFr ? "à l'instant" : 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return label(minutes, isFr ? 'minute' : 'minute');
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return label(hours, isFr ? 'heure' : 'hour');
  const days = Math.floor(hours / 24);
  if (days < 7) return label(days, isFr ? 'jour' : 'day');
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return label(weeks, isFr ? 'semaine' : 'week');
  return new Intl.DateTimeFormat(isFr ? 'fr-FR' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso));
}
