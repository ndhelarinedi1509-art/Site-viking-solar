import { generateSiteMetadata } from '@/config/seo';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ActualitesHero } from '@/components/sections/actualites-hero';
import { NewsFeed } from '@/components/news/news-feed';
import { GenericSections } from '@/components/sections/generic-sections';
import { RealtimeRefresh } from '@/components/realtime-refresh';

export const metadata = generateSiteMetadata(
  'Actualités',
  'Fil d’actualité Viking Solar : dernières actualités, promotions et nouveautés à Kinshasa, RDC. Lisez, aimez et commentez librement.',
  '/actualites',
);

export const dynamic = 'force-dynamic';

export default function ActualitesPage() {
  return (
    <>
      <Header />
      <main>
        <ActualitesHero />
        <NewsFeed />
        <GenericSections pageKey="actualites" />
      </main>
      <Footer />
      <RealtimeRefresh />
    </>
  );
}
