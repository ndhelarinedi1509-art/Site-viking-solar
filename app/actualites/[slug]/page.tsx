import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SITE_CONFIG } from '@/config/site';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { NewsArticle } from '@/components/news/news-article';
import { fetchNewsBySlug, fetchPublishedComments } from '@/lib/news-queries';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchNewsBySlug(slug);
  if (!post) return { title: 'Actualité introuvable' };

  const url = `${SITE_CONFIG.url}/actualites/${post.slug}`;
  const ogImage = post.cover_image || SITE_CONFIG.ogImage;

  return {
    title: `${post.title} | ${SITE_CONFIG.name}`,
    description: post.excerpt || SITE_CONFIG.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      locale: SITE_CONFIG.locale,
      siteName: SITE_CONFIG.name,
      title: post.title,
      description: post.excerpt || SITE_CONFIG.description,
      url,
      publishedTime: post.published_at ?? undefined,
      images: [{ url: ogImage, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || SITE_CONFIG.description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export default async function ActualitePage({ params }: PageProps) {
  const { slug } = await params;
  const post = await fetchNewsBySlug(slug);
  if (!post) notFound();
  const comments = await fetchPublishedComments(post.id);

  return (
    <>
      <Header />
      <main>
        <NewsArticle post={post} comments={comments} />
      </main>
      <Footer />
    </>
  );
}
