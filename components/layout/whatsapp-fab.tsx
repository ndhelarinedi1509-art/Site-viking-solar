'use client';

import { useEffect } from 'react';
import { SITE_CONFIG } from '@/config/site';
import { MessageCircle } from 'lucide-react';

export function WhatsAppFAB() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fab-float {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-6px) scale(1.03); }
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <a
      href={SITE_CONFIG.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(37,211,102,0.4)]"
      style={{ animation: 'fab-float 3s ease-in-out infinite' }}
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
