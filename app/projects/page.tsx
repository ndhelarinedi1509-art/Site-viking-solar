import { generateSiteMetadata } from '@/config/seo';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProjectsHero } from '@/components/sections/projects-hero';
import { ProjectsStats } from '@/components/sections/projects-stats';
import { ProjectsGallery } from '@/components/sections/projects-gallery';
import { ProjectsTestimonials } from '@/components/sections/projects-testimonials';
import { ProjectsCTA } from '@/components/sections/projects-cta';
import { ProjectsSocial } from '@/components/sections/projects-social';
import { fetchProjects } from '@/lib/cms-queries';
import { RealtimeRefresh } from '@/components/realtime-refresh';

export const metadata = generateSiteMetadata(
  'Projets',
  'Découvrez nos projets et installations solaires réalisés par Viking Solar en RDC. Résidentiel, industriel, commercial — des solutions durables pour chaque besoin énergétique.',
  '/projects',
);

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  let projects = [] as Awaited<ReturnType<typeof fetchProjects>>;

  try {
    projects = await fetchProjects();
  } catch {
    // Tables not configured — sections render their fallbacks.
  }

  return (
    <>
      <Header />
      <main>
        <ProjectsHero />
        <ProjectsStats />
        <ProjectsGallery projects={projects} />
        <ProjectsTestimonials />
        <ProjectsCTA />
        <ProjectsSocial />
      </main>
      <Footer />
      <RealtimeRefresh />
    </>
  );
}
