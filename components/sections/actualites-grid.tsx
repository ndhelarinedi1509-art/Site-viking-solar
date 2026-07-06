'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/auth-context';
import { ACTUALITES } from '@/constants/actualites';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import { Lock, Unlock, Calendar, ArrowRight } from 'lucide-react';
import { ActualitesAuthModal } from './actualites-auth-modal';

const FREE_COUNT = 3;

function FadeCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isInView } = useInView();
  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-[0.6s] ease-premium',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function ActualitesGrid() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const canAccess = (index: number) => index < FREE_COUNT || !!user;

  const handleCardClick = (id: string, index: number) => {
    if (canAccess(index)) {
      setSelectedId(selectedId === id ? null : id);
    } else {
      setModalOpen(true);
    }
  };

  return (
    <section className="py-20 sm:py-24 border-t border-border bg-bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-[clamp(1.9rem,3.5vw,2.8rem)] font-extrabold text-white tracking-[-0.03em] leading-[1.15] mb-3">
            {t('actualites.grid.title')}
          </h2>
          <p className="text-base text-gray-400 max-w-[580px] mx-auto leading-relaxed">
            {t('actualites.grid.description')}
          </p>
          {!user && (
            <p className="text-sm text-gray-500 mt-3">
              {t('actualites.grid.freeInfo')}
            </p>
          )}
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ACTUALITES.map((item, i) => (
            <FadeCard key={item.id} delay={i * 80}>
              <article
                onClick={() => handleCardClick(item.id, i)}
                className={cn(
                  'group relative rounded-[20px] border bg-bg-card overflow-hidden flex flex-col transition-all duration-[0.45s] ease-premium cursor-pointer',
                  canAccess(i)
                    ? 'border-border hover:-translate-y-2 hover:border-green/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)]'
                    : 'border-white/6 hover:border-green/20',
                )}
              >
                {/* Image placeholder */}
                <div className="relative h-48 overflow-hidden bg-bg-elevated">
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#0A1020] to-[#0F1A2E]">
                    <div className="flex flex-col items-center gap-2">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-500">{t('common.photoComing')}</span>
                    </div>
                  </div>

                  {/* Category badge */}
                  <span className="absolute top-3 left-3 z-[2] rounded-full bg-green/80 px-3 py-1 text-[0.65rem] font-bold text-white uppercase tracking-[0.05em] shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
                    {t(`actualites.categories.${item.category}`)}
                  </span>

                  {/* Lock overlay for locked items */}
                  {!canAccess(i) && (
                    <div className="absolute inset-0 z-[3] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity group-hover:bg-black/40">
                      <div className="flex flex-col items-center gap-2 text-gray-300">
                        <Lock className="h-8 w-8" />
                        <span className="text-xs font-semibold">{t('actualites.grid.locked')}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{item.date}</span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug mb-2 transition-colors group-hover:text-green">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-400 leading-relaxed flex-1 line-clamp-3">
                    {item.excerpt}
                  </p>

                  {/* Bottom: read more or unlock */}
                  <div className="mt-4 pt-4 border-t border-border flex items-center gap-1.5 text-xs font-semibold transition-all duration-300"
                    style={{ color: canAccess(i) ? '#22C55E' : '#6B7280' }}
                  >
                    {canAccess(i) ? (
                      <>
                        <Unlock className="h-3.5 w-3.5" />
                        {t('actualites.grid.readMore')}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </>
                    ) : (
                      <>
                        <Lock className="h-3.5 w-3.5" />
                        {t('actualites.grid.loginToAccess')}
                      </>
                    )}
                  </div>
                </div>
              </article>
            </FadeCard>
          ))}
        </div>

        {/* Expanded content for selected item */}
        {selectedId && (() => {
          const item = ACTUALITES.find((a) => a.id === selectedId);
          if (!item) return null;
          const idx = ACTUALITES.indexOf(item);
          if (!canAccess(idx)) return null;
          return (
            <div className="mt-8 rounded-2xl border border-green/20 bg-bg-card p-6 sm:p-8 shadow-card">
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">{item.content}</p>
              <button onClick={() => setSelectedId(null)} className="mt-4 text-sm font-semibold text-green hover:text-green-dark transition-colors">
                {t('actualites.grid.close')}
              </button>
            </div>
          );
        })()}

        {/* CTA for non-logged-in users */}
        {!user && (
          <div className="mt-14 text-center">
            <p className="text-sm text-gray-500 mb-4">{t('actualites.grid.ctaText')}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-green px-6 py-3 font-semibold text-bg-primary text-sm transition-all hover:bg-green-dark hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(34,197,94,0.25)]">
                {t('actualites.auth.login')}
              </button>
              <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 rounded-full border border-green/30 px-6 py-3 font-semibold text-green text-sm transition-all hover:bg-green/10 hover:-translate-y-px">
                {t('actualites.auth.register')}
              </button>
            </div>
          </div>
        )}

        {/* Logged in info */}
        {user && (
          <div className="mt-14 text-center">
            <p className="text-sm text-green font-semibold">
              {t('actualites.grid.loggedInAs')} {user.name}
            </p>
          </div>
        )}
      </div>

      <ActualitesAuthModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
