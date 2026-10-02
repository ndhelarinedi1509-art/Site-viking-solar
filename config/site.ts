export const SITE_CONFIG = {
  name: 'Viking Solar',
  slogan: 'Your trusted partner in sustainable solar energy',
  description:
    'Viking Solar provides modern, reliable and durable solar solutions for individuals and businesses in Kinshasa, DRC.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://vickingsolar.com',
  locale: 'fr',
  phone: '+243 820 128 315',
  whatsapp: 'https://wa.me/243820128315',
  email: 'vikingsolar58@gmail.com',
  address: 'Kinshasa, RDC',
  country: 'RD Congo',
  socials: {
    facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || 'https://www.facebook.com/share/1CiMtZAPkx/',
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || 'https://www.instagram.com/vickingsolar58',
    twitter: process.env.NEXT_PUBLIC_SOCIAL_TWITTER || 'https://x.com/vikingsolar',
    tiktok: process.env.NEXT_PUBLIC_SOCIAL_TIKTOK || 'https://www.tiktok.com/@vicking.solar',
  },
  copyright: `© ${new Date().getFullYear()} Viking Solar. Tous droits réservés.`,
  // Generee a la volee par app/og/route.tsx : une image declaree mais absente
  // du depot donne un lien sans apercu sur WhatsApp, Facebook et LinkedIn.
  ogImage: '/og',
  logo: { icon: '/logo-icon.svg', full: '/logo-full.svg' },
} as const;
