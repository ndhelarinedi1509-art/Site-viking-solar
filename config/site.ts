export const SITE_CONFIG = {
  name: 'Viking Solar',
  slogan: 'Votre partenaire en énergie solaire durable',
  description:
    'Viking Solar accompagne les particuliers et entreprises en RDC avec des solutions solaires modernes, fiables et durables à Kinshasa.',
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
  ogImage: '/og-image.jpg',
  logo: { icon: '/logo-icon.svg', full: '/logo-full.svg' },
} as const;
