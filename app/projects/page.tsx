import { generateSiteMetadata } from '@/config/seo';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProjectsHero } from '@/components/sections/projects-hero';
import { ProjectsStats } from '@/components/sections/projects-stats';
import { ProjectsGallery } from '@/components/sections/projects-gallery';
import { ProjectsTestimonials } from '@/components/sections/projects-testimonials';
import { ProjectsCTA } from '@/components/sections/projects-cta';
import { GenericSection } from '@/components/sections/generic-section';
import { fetchPublishedSections, fetchProjects, fetchTestimonials } from '@/lib/cms-queries';
import type { PageSection, CmsProject, CmsTestimonial } from '@/types';
import { RealtimeRefresh } from '@/components/realtime-refresh';

export const metadata = generateSiteMetadata(
  'Projets',
  'Découvrez nos projets et installations solaires réalisés par Viking Solar en RDC. Résidentiel, industriel, commercial — des solutions durables pour chaque besoin énergétique.',
  '/projects',
);

export const dynamic = 'force-dynamic';

interface ProjectsSectionProps {
  section?: PageSection;
  projects?: CmsProject[];
  testimonials?: CmsTestimonial[];
}

const sectionComponents: Record<string, React.ComponentType<ProjectsSectionProps>> = {
  hero: ProjectsHero,
  stats: ProjectsStats,
  gallery: ProjectsGallery,
  testimonials: ProjectsTestimonials,
  cta: ProjectsCTA,
};

export default async function ProjectsPage() {
  let sections: Awaited<ReturnType<typeof fetchPublishedSections>> = [];
  let projects: Awaited<ReturnType<typeof fetchProjects>> = [];
  let testimonials: Awaited<ReturnType<typeof fetchTestimonials>> = [];

  try {
    [sections, projects, testimonials] = await Promise.all([
      fetchPublishedSections('projects'),
      fetchProjects(),
      fetchTestimonials(),
    ]);
  } catch {
    // Tables not configured — components render their fallbacks.
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
              projects={projects}
              testimonials={testimonials}
            />
          );
        })}
      </main>
      <Footer />
      <RealtimeRefresh />
    </>
  );
}
