'use client';

import { cn } from '@/lib/utils';

export function SectionHeader({
  eyebrow,
  title,
  titleHighlight,
  description,
  center = true,
  className,
}: {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  description?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(center && 'text-center', 'mb-12 max-w-2xl', center && 'mx-auto', className)}>
      {eyebrow && (
        <span className="mb-3 inline-block rounded-full border border-green/20 bg-green/5 px-4 py-1.5 text-xs font-medium tracking-wider text-green uppercase">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
        {title}
        {titleHighlight && (
          <span className="bg-gradient-to-r from-green to-accent-blue bg-clip-text text-transparent">
            {' '}{titleHighlight}
          </span>
        )}
      </h2>
      {description && (
        <p className="mt-4 text-base text-gray-400 leading-relaxed">{description}</p>
      )}
    </div>
  );
}
