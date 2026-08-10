import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HomeHero } from '@/components/sections/home-hero';
import { HomeAboutPreview } from '@/components/sections/home-about-preview';
import { HomeServicesPreview } from '@/components/sections/home-services-preview';
import { HomeProjectsPreview } from '@/components/sections/home-projects-preview';
import { HomeBenefits } from '@/components/sections/home-benefits';
import { HomeCTA } from '@/components/sections/home-cta';
import { GenericSection } from '@/components/sections/generic-section';
import { fetchPublishedSections, fetchServices, fetchProjects } from '@/lib/cms-queries';
import type { PageSection, CmsService, CmsProject } from '@/types';
import { RealtimeRefresh } from '@/components/realtime-refresh';

export const dynamic = 'force-dynamic';

interface HomeSectionProps {
  section?: PageSection;
  services?: CmsService[];
  projects?: CmsProject[];
}

const sectionComponents: Record<string, React.ComponentType<HomeSectionProps>> = {
  hero: HomeHero,
  'about-preview': HomeAboutPreview,
  'services-preview': HomeServicesPreview,
  'projects-preview': HomeProjectsPreview,
  benefits: HomeBenefits,
  cta: HomeCTA,
};

export default async function HomePage() {
  let sections: Awaited<ReturnType<typeof fetchPublishedSections>> = [];
  let services: Awaited<ReturnType<typeof fetchServices>> = [];
  let projects: Awaited<ReturnType<typeof fetchProjects>> = [];

  try {
    [sections, services, projects] = await Promise.all([
      fetchPublishedSections('home'),
      fetchServices(),
      fetchProjects(),
    ]);
  } catch {
    // Sections not configured yet — components fall back to their defaults.
  }

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
            />
          );
        })}
      </main>
      <Footer />
      <RealtimeRefresh />
    </>
  );
}
