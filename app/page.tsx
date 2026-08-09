import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HomeHero } from '@/components/sections/home-hero';
import { HomeAboutPreview } from '@/components/sections/home-about-preview';
import { HomeServicesPreview } from '@/components/sections/home-services-preview';
import { HomeProjectsPreview } from '@/components/sections/home-projects-preview';
import { HomeBenefits } from '@/components/sections/home-benefits';
import { HomeCTA } from '@/components/sections/home-cta';
import { fetchPublishedSections, fetchServices, fetchProjects, getSection } from '@/lib/cms-queries';
import { RealtimeRefresh } from '@/components/realtime-refresh';

export const dynamic = 'force-dynamic';

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
        <HomeHero section={getSection(sections, 'hero')} />
        <HomeAboutPreview section={getSection(sections, 'about-preview')} />
        <HomeServicesPreview section={getSection(sections, 'services-preview')} services={services} />
        <HomeProjectsPreview section={getSection(sections, 'projects-preview')} projects={projects} />
        <HomeBenefits section={getSection(sections, 'benefits')} />
        <HomeCTA section={getSection(sections, 'cta')} />
      </main>
      <Footer />
      <RealtimeRefresh />
    </>
  );
}
