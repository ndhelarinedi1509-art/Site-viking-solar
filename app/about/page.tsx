import { generateSiteMetadata } from '@/config/seo';
import { AboutHero } from '@/components/sections/about-hero';
import { AboutInnovation } from '@/components/sections/about-innovation';
import { AboutPillars } from '@/components/sections/about-pillars';
import { AboutTeam } from '@/components/sections/about-team';
import { AboutExpertise } from '@/components/sections/about-expertise';
import { AboutCTA } from '@/components/sections/about-cta';

export const metadata = generateSiteMetadata(
  'À propos',
  'Découvrez Vicking Solar, entreprise congolaise spécialisée dans les solutions solaires innovantes à Kinshasa, RDC. Notre équipe d\'experts vous accompagne vers un avenir énergétique durable.',
  '/about',
);

export default function AboutPage() {
  return (
    <div className="pt-20">
      <AboutHero />
      <AboutInnovation />
      <AboutPillars />
      <AboutTeam />
      <AboutExpertise />
      <AboutCTA />
    </div>
  );
}
