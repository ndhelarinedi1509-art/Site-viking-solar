import { generateSiteMetadata } from '@/config/seo';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AboutHero } from '@/components/sections/about-hero';
import { AboutInnovation } from '@/components/sections/about-innovation';
import { AboutPillars } from '@/components/sections/about-pillars';
import { AboutTeam } from '@/components/sections/about-team';
import { FaqSection } from '@/components/sections/faq-section';
import { AboutCTA } from '@/components/sections/about-cta';
import { ContactFormSection } from '@/components/sections/contact-form-section';
import { GenericSection } from '@/components/sections/generic-section';
import { fetchPublishedSections } from '@/lib/cms-queries';
import type { PageSection } from '@/types';
import { RealtimeRefresh } from '@/components/realtime-refresh';

export const metadata = generateSiteMetadata(
  'À propos',
  'Découvrez Vicking Solar, entreprise congolaise spécialisée dans les solutions solaires innovantes à Kinshasa, RDC. Notre équipe d\'experts vous accompagne vers un avenir énergétique durable.',
  '/about',
);

export const dynamic = 'force-dynamic';

interface AboutSectionProps {
  section?: PageSection;
}

const sectionComponents: Record<string, React.ComponentType<AboutSectionProps>> = {
  hero: AboutHero,
  innovation: AboutInnovation,
  pillars: AboutPillars,
  team: AboutTeam,
  faq: FaqSection,
  cta: AboutCTA,
};

export default async function AboutPage() {
  let sections: Awaited<ReturnType<typeof fetchPublishedSections>> = [];

  try {
    sections = await fetchPublishedSections('about');
  } catch {
    // Tables not configured — components render their fallbacks.
  }

  return (
    <>
      <Header />
      <main>
        {sections.map((section) => {
          const Component = sectionComponents[section.section_key] ?? GenericSection;
          return <Component key={section.id} section={section} />;
        })}
        <div id="contact" className="scroll-mt-24">
          <ContactFormSection />
        </div>
      </main>
      <Footer />
      <RealtimeRefresh />
    </>
  );
}
