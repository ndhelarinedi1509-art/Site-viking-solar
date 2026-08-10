import { ContactFormSection } from '@/components/sections/contact-form-section';
import { resolveMapsEmbedUrl } from '@/lib/google-maps';
import type { PageSection } from '@/types';

interface ContactFormBlockProps {
  section?: PageSection;
}

export async function ContactFormBlock({ section }: ContactFormBlockProps) {
  const mapUrl = (section?.content?.mapUrl as string) || 'https://maps.app.goo.gl/voTqLWVc3Qxdw2sa7';
  const embedUrl = await resolveMapsEmbedUrl(mapUrl);
  return (
    <div id="contact" className="scroll-mt-24">
      <ContactFormSection mapUrl={mapUrl} embedUrl={embedUrl} />
    </div>
  );
}
