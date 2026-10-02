import { ImageResponse } from 'next/og';
import { SITE_CONFIG } from '@/config/site';

/**
 * Carte de partage generee a la volee (1200 x 630).
 *
 * Elle remplace `public/og-image.jpg`, un chemin declare dans la configuration
 * mais absent du depot : sans image, Facebook, WhatsApp, X et LinkedIn
 * n'affichent aucun apercu et le lien parait mort. Une image generee ne peut pas
 * disparaitre, et le texte suit le nom de la marque.
 */
export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${SITE_CONFIG.name} – ${SITE_CONFIG.slogan}`;

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#060B18',
          backgroundImage:
            'radial-gradient(circle at 15% 10%, #16a34a33 0%, transparent 55%), radial-gradient(circle at 90% 90%, #14b8a633 0%, transparent 55%)',
          padding: '72px 80px',
          color: '#f8fafc',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              backgroundColor: '#16a34a',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            V
          </div>
          <div style={{ display: 'flex', fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>
            {SITE_CONFIG.name}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', fontSize: 62, fontWeight: 700, lineHeight: 1.15, maxWidth: 900 }}>
            Énergie solaire durable à Kinshasa
          </div>
          <div style={{ display: 'flex', fontSize: 30, color: '#94a3b8', maxWidth: 880 }}>
            Installations solaires, hybridation et maintenance pour particuliers, entreprises et
            industries.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #1e293b',
            paddingTop: 28,
            fontSize: 24,
            color: '#64748b',
          }}
        >
          <div style={{ display: 'flex' }}>{SITE_CONFIG.address}</div>
          <div style={{ display: 'flex', color: '#22c55e' }}>{SITE_CONFIG.url.replace(/^https?:\/\//, '')}</div>
        </div>
      </div>
    ),
    size,
  );
}