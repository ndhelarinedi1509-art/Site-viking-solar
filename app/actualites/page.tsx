import { generateSiteMetadata } from '@/config/seo';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ActualitesHero } from '@/components/sections/actualites-hero';
import { NewsFeed } from '@/components/news/news-feed';
import { GenericSections } from '@/components/sections/generic-sections';
import { RealtimeRefresh } from '@/components/realtime-refresh';
import { fetchPublishedSections, getSection } from '@/lib/cms-queries';

export const metadata = generateSiteMetadata(
  'Actualités',
  'Fil d’actualité Viking Solar : dernières actualités, promotions et nouveautés à Kinshasa, RDC. Lisez, aimez et commentez librement.',
  '/actualites',
);

export const dynamic = 'force-dynamic';

export default async function ActualitesPage() {
  let sections: Awaited<ReturnType<typeof fetchPublishedSections>> = [];

  try {
    sections = await fetchPublishedSections('actualites');
  } catch {
    // Sections not configured yet — components fall back to their defaults.
  }

  const hero = getSection(sections, 'hero');
  const grid = getSection(sections, 'grid');

  return (
    <>
      <Header />
      <main>
        <ActualitesHero section={hero} />
        <NewsFeed
          headerTitle={grid?.title || undefined}
          headerDescription={grid?.description || undefined}
        />
        <GenericSections pageKey="actualites" />
      </main>
      <Footer />
      <RealtimeRefresh />
    </>
  );
}
