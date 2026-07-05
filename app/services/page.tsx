import { generateSiteMetadata } from '@/config/seo';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ServicesHero } from '@/components/sections/services-hero';
import { ServicesGrid } from '@/components/sections/services-grid';
import { ServicesProcess } from '@/components/sections/services-process';
import { ServicesBenefits } from '@/components/sections/services-benefits';
import { ServicesProjects } from '@/components/sections/services-projects';
import { ServicesCTA } from '@/components/sections/services-cta';

export const metadata = generateSiteMetadata(
  'Services',
  'Découvrez nos services solaires : installation, systèmes hybrides, maintenance, énergie industrielle et résidentielle. Des solutions durables adaptées au Congo.',
  '/services',
);

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main>
        <ServicesHero />
        <ServicesGrid />
        <ServicesProcess />
        <ServicesBenefits />
        <ServicesProjects />
        <ServicesCTA />
      </main>
      <Footer />
    </>
  );
}
