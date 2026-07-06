import fr from '@/locales/fr.json';
import en from '@/locales/en.json';

type Dict = typeof fr;
const dicts: Record<string, Dict> = { fr, en };

function resolve(obj: unknown, path: string): string {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (!current || typeof current !== 'object' || !(part in current)) return path;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : path;
}

export function serverT(key: string, locale: string = 'fr'): string {
  const dict = dicts[locale] || dicts.fr;
  return resolve(dict, key);
}
