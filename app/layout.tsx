import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Viking Solar | Énergie solaire durable à Kinshasa RDC',
  description:
    "Viking Solar – Votre partenaire en énergie solaire durable à Kinshasa, RDC. Solutions solaires fiables pour particuliers, entreprises et industries. Énergie de demain, disponible aujourd'hui.",
  icons: {
    icon: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#060B18',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans bg-bg-primary text-gray-100 antialiased">
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}