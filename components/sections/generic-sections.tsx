import { fetchPublishedSections } from '@/lib/cms-queries';
import { GenericSection } from '@/components/sections/generic-section';
import type { PageSection } from '@/types';

interface GenericSectionsProps {
  pageKey: string;
}

export async function GenericSections({ pageKey }: GenericSectionsProps) {
  let sections: PageSection[] = [];
  try {
    sections = await fetchPublishedSections(pageKey);
  } catch {
    return null;
  }

  const extra = sections.filter((s) => s.section_key.startsWith('section-'));
  if (extra.length === 0) return null;

  return (
    <>
      {extra.map((section) => (
        <GenericSection key={section.id} section={section} />
      ))}
    </>
  );
}
