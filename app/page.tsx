import { generateSiteMetadata } from '@/config/seo';
import { HomeHero } from '@/components/sections/home-hero';
import { HomeAboutPreview } from '@/components/sections/home-about-preview';
import { HomeServicesPreview } from '@/components/sections/home-services-preview';
import { HomeProjectsPreview } from '@/components/sections/home-projects-preview';
import { HomeBenefits } from '@/components/sections/home-benefits';
import { HomeCTA } from '@/components/sections/home-cta';

export const metadata = generateSiteMetadata();

export default function HomePage() {
  return (
    <div className="pt-20">
      <HomeHero />
      <HomeAboutPreview />
      <HomeServicesPreview />
      <HomeProjectsPreview />
      <HomeBenefits />
      <HomeCTA />
    </div>
  );
}
