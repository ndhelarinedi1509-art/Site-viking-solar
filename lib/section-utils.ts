import type { PageSection } from '@/types';

export function sectionContent(section: PageSection | undefined): Record<string, unknown> {
  return section?.content ?? {};
}

export function sectionString(
  section: PageSection | undefined,
  key: string,
  fallback = '',
): string {
  const val = sectionContent(section)[key];
  return typeof val === 'string' ? val : fallback;
}

export function sectionButtons(section: PageSection | undefined): Array<{ label: string; href: string; variant: string }> {
  const buttons = sectionContent(section).buttons;
  return Array.isArray(buttons) ? (buttons as Array<{ label: string; href: string; variant: string }>) : [];
}

export function sectionButton(section: PageSection | undefined): { label: string; href: string; variant: string } | null {
  const btn = sectionContent(section).button;
  return btn && typeof btn === 'object' ? (btn as { label: string; href: string; variant: string }) : null;
}

export function sectionStats(section: PageSection | undefined): Array<{ value: number; suffix: string; label: string }> {
  const stats = sectionContent(section).stats;
  return Array.isArray(stats) ? (stats as Array<{ value: number; suffix: string; label: string }>) : [];
}

export function sectionItems(section: PageSection | undefined): Array<Record<string, string>> {
  const items = sectionContent(section).items;
  return Array.isArray(items) ? (items as Array<Record<string, string>>) : [];
}

export function sectionHighlights(section: PageSection | undefined): string[] {
  const highlights = sectionContent(section).highlights;
  return Array.isArray(highlights) ? (highlights as string[]) : [];
}

export function sectionImage(section: PageSection | undefined): { url: string; alt?: string } | null {
  const images = section?.images ?? [];
  return images[0] ?? null;
}
