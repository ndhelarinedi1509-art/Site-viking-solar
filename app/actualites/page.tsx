import { generateSiteMetadata } from '@/config/seo';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ActualitesHero } from '@/components/sections/actualites-hero';
import { ActualitesGrid } from '@/components/sections/actualites-grid';

export const metadata = generateSiteMetadata(
  'Actualités',
  'Restez informé des dernières actualités, promotions et nouveautés de Vicking Solar à Kinshasa, RDC.',
  '/actualites',
);

export default function ActualitesPage() {
  return (
    <>
      <Header />
      <main>
        <ActualitesHero />
        <ActualitesGrid />
      </main>
      <Footer />
    </>
  );
}
