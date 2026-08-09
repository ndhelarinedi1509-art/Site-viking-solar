import { generateSiteMetadata } from '@/config/seo';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ActualitesHero } from '@/components/sections/actualites-hero';
import { NewsFeed } from '@/components/news/news-feed';

export const metadata = generateSiteMetadata(
  'Actualités',
  'Fil d’actualité Viking Solar : dernières actualités, promotions et nouveautés à Kinshasa, RDC. Lisez, aimez et commentez librement.',
  '/actualites',
);

export default function ActualitesPage() {
  return (
    <>
      <Header />
      <main>
        <ActualitesHero />
        <NewsFeed />
      </main>
      <Footer />
    </>
  );
}
