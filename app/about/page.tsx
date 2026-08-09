import { generateSiteMetadata } from '@/config/seo';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AboutHero } from '@/components/sections/about-hero';
import { AboutInnovation } from '@/components/sections/about-innovation';
import { AboutPillars } from '@/components/sections/about-pillars';
import { AboutTeam } from '@/components/sections/about-team';
import { AboutExpertise } from '@/components/sections/about-expertise';
import { AboutCTA } from '@/components/sections/about-cta';
import { ContactFormSection } from '@/components/sections/contact-form-section';

export const metadata = generateSiteMetadata(
  'À propos',
  'Découvrez Vicking Solar, entreprise congolaise spécialisée dans les solutions solaires innovantes à Kinshasa, RDC. Notre équipe d\'experts vous accompagne vers un avenir énergétique durable.',
  '/about',
);

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <AboutHero />
        <AboutInnovation />
        <AboutPillars />
        <AboutTeam />
        <AboutExpertise />
        <AboutCTA />
        <div id="contact" className="scroll-mt-24">
          <ContactFormSection />
        </div>
      </main>
      <Footer />
    </>
  );
}
