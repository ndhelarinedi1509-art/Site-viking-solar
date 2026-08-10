import { generateSiteMetadata } from '@/config/seo';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ServicesHero } from '@/components/sections/services-hero';
import { ServicesGrid } from '@/components/sections/services-grid';
import { ServicesProcess } from '@/components/sections/services-process';
import { ServicesBenefits } from '@/components/sections/services-benefits';
import { ServicesProjects } from '@/components/sections/services-projects';
import { ServicesCTA } from '@/components/sections/services-cta';
import { GenericSection } from '@/components/sections/generic-section';
import { fetchServices, fetchProjects, fetchPublishedSections, getSection } from '@/lib/cms-queries';
import type { PageSection, CmsService, CmsProject } from '@/types';
import { RealtimeRefresh } from '@/components/realtime-refresh';

export const metadata = generateSiteMetadata(
  'Services',
  'Découvrez nos services solaires : installation, systèmes hybrides, maintenance, énergie industrielle et résidentielle. Des solutions durables adaptées au Congo.',
  '/services',
);

export const dynamic = 'force-dynamic';

interface ServicesSectionProps {
  section?: PageSection;
  services?: CmsService[];
  projects?: CmsProject[];
  benefitsSection?: PageSection;
}

const sectionComponents: Record<string, React.ComponentType<ServicesSectionProps>> = {
  hero: ServicesHero,
  grid: ServicesGrid,
  process: ServicesProcess,
  benefits: ServicesBenefits,
  projects: ServicesProjects,
  cta: ServicesCTA,
};

export default async function ServicesPage() {
  let sections: Awaited<ReturnType<typeof fetchPublishedSections>> = [];
  let services: Awaited<ReturnType<typeof fetchServices>> = [];
  let projects: Awaited<ReturnType<typeof fetchProjects>> = [];
  let homeSections: Awaited<ReturnType<typeof fetchPublishedSections>> = [];

  try {
    [sections, services, projects, homeSections] = await Promise.all([
      fetchPublishedSections('services'),
      fetchServices(),
      fetchProjects(),
      fetchPublishedSections('home'),
    ]);
  } catch {
    // Tables not configured — sections render their fallbacks.
  }

  // "Pourquoi nous choisir" is shared with the home page: the services
  // page renders the home benefits section content at its position.
  const benefitsSection = getSection(homeSections, 'benefits');

  return (
    <>
      <Header />
      <main>
        {sections.map((section) => {
          const Component = sectionComponents[section.section_key] ?? GenericSection;
          return (
            <Component
              key={section.id}
              section={section}
              services={services}
              projects={projects}
              benefitsSection={benefitsSection}
            />
          );
        })}
      </main>
      <Footer />
      <RealtimeRefresh />
    </>
  );
}
