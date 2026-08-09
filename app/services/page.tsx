import { generateSiteMetadata } from '@/config/seo';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ServicesHero } from '@/components/sections/services-hero';
import { ServicesGrid } from '@/components/sections/services-grid';
import { ServicesProcess } from '@/components/sections/services-process';
import { ServicesBenefits } from '@/components/sections/services-benefits';
import { ServicesProjects } from '@/components/sections/services-projects';
import { ServicesCTA } from '@/components/sections/services-cta';
import { fetchServices, fetchProjects, fetchPublishedSections, getSection } from '@/lib/cms-queries';
import { sectionItems } from '@/lib/section-utils';
import { RealtimeRefresh } from '@/components/realtime-refresh';
import type { Benefit } from '@/types';

export const metadata = generateSiteMetadata(
  'Services',
  'Découvrez nos services solaires : installation, systèmes hybrides, maintenance, énergie industrielle et résidentielle. Des solutions durables adaptées au Congo.',
  '/services',
);

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  let services = [] as Awaited<ReturnType<typeof fetchServices>>;
  let projects = [] as Awaited<ReturnType<typeof fetchProjects>>;
  let benefits: Benefit[] = [];

  try {
    [services, projects] = await Promise.all([fetchServices(), fetchProjects()]);
    const sections = await fetchPublishedSections('services');
    benefits = sectionItems(getSection(sections, 'benefits')).map((item, idx) => ({
      id: `ben-${idx}`,
      title: item.title ?? '',
      description: item.description ?? '',
      iconColor: item.iconColor ?? 'green',
    }));
  } catch {
    // Tables not configured — sections render their fallbacks.
  }

  return (
    <>
      <Header />
      <main>
        <ServicesHero />
        <ServicesGrid services={services} />
        <ServicesProcess />
        <ServicesBenefits benefits={benefits} />
        <ServicesProjects projects={projects} />
        <ServicesCTA />
      </main>
      <Footer />
      <RealtimeRefresh />
    </>
  );
}
