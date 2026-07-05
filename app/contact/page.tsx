import { generateSiteMetadata } from '@/config/seo';
import { ContactHero } from '@/components/sections/contact-hero';
import { ContactFormSection } from '@/components/sections/contact-form-section';
import { ContactMap } from '@/components/sections/contact-map';
import { ContactFAQ } from '@/components/sections/contact-faq';
import { ContactCTA } from '@/components/sections/contact-cta';

export const metadata = generateSiteMetadata(
  'Contact',
  'Contactez Viking Solar à Kinshasa pour vos projets solaires. Devis gratuit, accompagnement personnalisé et solutions durables en RDC.',
  '/contact',
);

export default function ContactPage() {
  return (
    <div className="pt-20">
      <ContactHero />
      <ContactFormSection />
      <ContactMap />
      <ContactFAQ />
      <ContactCTA />
    </div>
  );
}
