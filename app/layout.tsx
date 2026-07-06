import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { I18nProvider } from '@/components/providers/i18n-provider';
import { AuthProvider } from '@/lib/auth-context';
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
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  appleWebApp: {
    capable: true,
    title: 'Viking Solar',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  themeColor: '#060B18',
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans bg-bg-primary text-gray-400 antialiased">
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false} storageKey="viking-theme">
          <I18nProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}