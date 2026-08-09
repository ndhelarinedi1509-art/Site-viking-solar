import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/config/site';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_CONFIG.url;

  const entries: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/actualites`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  ];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('news_posts')
      .select('slug, updated_at')
      .eq('status', 'published');
    for (const post of data ?? []) {
      entries.push({
        url: `${base}/actualites/${post.slug}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  } catch {
    // DB unavailable at build time → keep static entries
  }

  return entries;
}
