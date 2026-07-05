import type { Metadata } from 'next';
import { SITE_CONFIG } from './site';

export function generateSiteMetadata(
  titleSuffix?: string,
  description?: string,
  path?: string,
): Metadata {
  const title = titleSuffix
    ? `${titleSuffix} | ${SITE_CONFIG.name}`
    : `${SITE_CONFIG.name} – ${SITE_CONFIG.slogan}`;

  const url = path ? `${SITE_CONFIG.url}${path}` : SITE_CONFIG.url;

  return {
    title,
    description: description || SITE_CONFIG.description,
    openGraph: {
      type: 'website',
      locale: SITE_CONFIG.locale,
      siteName: SITE_CONFIG.name,
      title,
      description: description || SITE_CONFIG.description,
      url,
      images: [{ url: SITE_CONFIG.ogImage, width: 1200, height: 630, alt: SITE_CONFIG.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description || SITE_CONFIG.description,
      images: [SITE_CONFIG.ogImage],
    },
    robots: { index: true, follow: true },
    alternates: { canonical: url },
  };
}
