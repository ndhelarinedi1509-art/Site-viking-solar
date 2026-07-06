import { generateSiteMetadata } from '@/config/seo';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ContactHero } from '@/components/sections/contact-hero';
import { ContactFormSection } from '@/components/sections/contact-form-section';
import { ContactMap } from '@/components/sections/contact-map';
import { ContactFAQ } from '@/components/sections/contact-faq';
import { ContactCTA } from '@/components/sections/contact-cta';
import { ProjectsSocial } from '@/components/sections/projects-social';

export const metadata = generateSiteMetadata(
  'Contact',
  'Contactez Viking Solar à Kinshasa pour vos projets solaires. Devis gratuit, accompagnement personnalisé et solutions durables en RDC.',
  '/contact',
);

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <ContactHero />
        <ContactFormSection />
        <ContactMap />
        <ContactFAQ />
        <ProjectsSocial />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
