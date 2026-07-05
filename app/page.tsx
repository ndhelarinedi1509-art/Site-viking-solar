import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HomeHero } from '@/components/sections/home-hero';
import { HomeAboutPreview } from '@/components/sections/home-about-preview';
import { HomeServicesPreview } from '@/components/sections/home-services-preview';
import { HomeProjectsPreview } from '@/components/sections/home-projects-preview';
import { HomeBenefits } from '@/components/sections/home-benefits';
import { HomeCTA } from '@/components/sections/home-cta';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HomeHero />
        <HomeAboutPreview />
        <HomeServicesPreview />
        <HomeProjectsPreview />
        <HomeBenefits />
        <HomeCTA />
      </main>
      <Footer />
    </>
  );
}
