import { generateSiteMetadata } from '@/config/seo';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProjectsHero } from '@/components/sections/projects-hero';
import { ProjectsStats } from '@/components/sections/projects-stats';
import { ProjectsGallery } from '@/components/sections/projects-gallery';
import { ProjectsTestimonials } from '@/components/sections/projects-testimonials';
import { ProjectsCTA } from '@/components/sections/projects-cta';
import { ProjectsSocial } from '@/components/sections/projects-social';

export const metadata = generateSiteMetadata(
  'Projets',
  'Découvrez nos projets et installations solaires réalisés par Viking Solar en RDC. Résidentiel, industriel, commercial — des solutions durables pour chaque besoin énergétique.',
  '/projects',
);

export default function ProjectsPage() {
  return (
    <>
      <Header />
      <main>
        <ProjectsHero />
        <ProjectsStats />
        <ProjectsGallery />
        <ProjectsTestimonials />
        <ProjectsCTA />
        <ProjectsSocial />
      </main>
      <Footer />
    </>
  );
}
