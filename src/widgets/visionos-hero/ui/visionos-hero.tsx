'use client';

import React from 'react';
import Link from 'next/link';

import { clsx } from 'clsx';

export type VisionOsHeroOrb = {
  id: string;
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  /** Tailwind classes for the orb background (e.g. `bg-gradient-to-br from-blue-500 to-blue-600`) */
  colorClassName?: string;
};

function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(!!mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return reduced;
}

export const VisionOsHero: React.FC<{ actions?: React.ReactNode; orbs?: VisionOsHeroOrb[] }> = ({
  actions,
  orbs,
}) => {
  const reducedMotion = useReducedMotion();
  const ref = React.useRef<HTMLDivElement | null>(null);

  const onPointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reducedMotion) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width; // 0..1
      const y = (e.clientY - rect.top) / rect.height; // 0..1
      // Map to -1..1
      const nx = (x - 0.5) * 2;
      const ny = (y - 0.5) * 2;
      el.style.setProperty('--mx', String(nx.toFixed(4)));
      el.style.setProperty('--my', String(ny.toFixed(4)));
    },
    [reducedMotion],
  );

  const onPointerLeave = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--mx', '0');
    el.style.setProperty('--my', '0');
  }, []);

  return (
    <section
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={clsx(
        'relative overflow-hidden rounded-[32px] border border-white/30 bg-[#DFDFE1] shadow-xl',
        'dark:border-gray-700/40 dark:bg-black',
      )}
      style={
        {
          // default values; updated on pointer move
          ['--mx' as any]: 0,
          ['--my' as any]: 0,
        } as React.CSSProperties
      }
    >
      <div className="relative h-[520px] w-full sm:h-[560px] lg:h-[620px]">
        {/* Scene: matte “room” diorama */}
        <div
          className={clsx(
            'absolute left-1/2 top-1/2 h-[360px] w-[680px] -translate-x-1/2 -translate-y-1/2',
            'sm:h-[420px] sm:w-[760px] lg:h-[480px] lg:w-[920px]',
            'will-change-transform',
          )}
          style={{
            transform: reducedMotion
              ? undefined
              : 'translate(-50%, -50%) perspective(1200px) rotateX(calc(var(--my) * -2deg)) rotateY(calc(var(--mx) * 3deg))',
          }}
        >
          {/* Outer soft vignette */}
          <div className="pointer-events-none absolute inset-[-120px] rounded-[56px] bg-white/35 blur-3xl dark:bg-white/10" />

          {/* Room shell */}
          <div className="absolute inset-0 rounded-[40px] bg-gradient-to-b from-[#F7F7F8] to-[#E9EBEF] shadow-[0_30px_90px_rgba(0,0,0,0.12)] dark:from-[#111214] dark:to-[#070708]">
            {/* Ceiling lip */}
            <div className="absolute left-8 right-8 top-7 h-10 rounded-[28px] bg-gradient-to-b from-white/80 to-transparent opacity-90 dark:from-white/10" />

            {/* Left wall column */}
            <div className="absolute left-10 top-12 h-[72%] w-[110px] rounded-[24px] bg-gradient-to-b from-white/70 to-[#E2E6ED] shadow-[0_10px_35px_rgba(0,0,0,0.08)] dark:from-white/10 dark:to-[#0A0B0C]" />

            {/* Back wall */}
            <div className="absolute left-32 right-28 top-12 bottom-20 rounded-[28px] bg-gradient-to-b from-[#F9FAFB] to-[#E6EAF1] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:from-[#0E0F10] dark:to-[#070708] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]" />

            {/* Floor */}
            <div className="absolute left-16 right-16 bottom-10 h-[110px] rounded-[30px] bg-gradient-to-b from-[#ECEFF4] to-[#DDE2EA] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] dark:from-[#0B0C0D] dark:to-[#060607]" />

            {/* Right window bars */}
            <div className="absolute right-10 top-12 bottom-18 w-[150px] rounded-[26px] bg-gradient-to-b from-white/75 to-[#E2E7EF] shadow-[0_12px_45px_rgba(0,0,0,0.10)] dark:from-white/10 dark:to-[#070708]">
              <div className="absolute inset-3 rounded-[20px] border border-white/40 bg-white/10 dark:border-white/10 dark:bg-white/5" />
              <div className="absolute left-1/2 top-4 bottom-4 w-[10px] -translate-x-1/2 rounded-full bg-white/40 dark:bg-white/10" />
              <div className="absolute left-4 right-4 top-1/2 h-[10px] -translate-y-1/2 rounded-full bg-white/40 dark:bg-white/10" />
            </div>

            {/* Sunlight shadow cast */}
            <div className="pointer-events-none absolute left-36 right-36 top-20 bottom-20 rounded-[26px] bg-gradient-to-r from-transparent via-transparent to-black/10 opacity-40 blur-[0.5px] dark:to-white/5" />
            <div
              className={clsx(
                'pointer-events-none absolute right-20 top-16 h-[320px] w-[320px] rounded-full',
                'bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.85),rgba(255,255,255,0)_65%)]',
                'opacity-80 blur-2xl dark:opacity-20',
              )}
            />
          </div>

          {/* Floating “icons” cluster (non-proprietary) */}
          <div
            className={clsx(
              'absolute left-[56%] top-[50%] -translate-x-1/2 -translate-y-1/2',
              'grid grid-cols-3 gap-4 sm:gap-5',
              'will-change-transform',
            )}
            style={{
              transform: reducedMotion
                ? undefined
                : 'translate(-50%, -50%) translate3d(calc(var(--mx) * 10px), calc(var(--my) * 8px), 0)',
            }}
            aria-label="Floating feature orbs"
          >
            {(orbs ?? []).map(({ id, Icon, colorClassName, href, label }, idx) => (
              <div
                key={id}
                className={clsx(
                  'relative h-[58px] w-[58px] sm:h-[64px] sm:w-[64px]',
                  reducedMotion ? undefined : 'animate-[float_5.5s_ease-in-out_infinite]',
                )}
                style={
                  reducedMotion
                    ? undefined
                    : ({
                        animationDelay: `${idx * 110}ms`,
                      } as React.CSSProperties)
                }
              >
                <Link
                  href={href}
                  className={clsx(
                    'group absolute inset-0 z-20 block rounded-full',
                    'shadow-[0_18px_40px_rgba(0,0,0,0.18)]',
                    'ring-1 ring-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/30 dark:ring-white/10 dark:focus-visible:ring-white/30',
                    'transition-transform duration-200 group-hover:scale-[1.04] group-active:scale-[0.98]',
                  )}
                  aria-label={label}
                >
                  <span className="sr-only">{label}</span>
                </Link>
                {/* base color */}
                <div
                  className={clsx(
                    'pointer-events-none absolute inset-0 z-0 rounded-full',
                    colorClassName ?? 'bg-gradient-to-br from-zinc-400 to-zinc-500',
                  )}
                />
                {/* glossy sheen overlay */}
                <div className="pointer-events-none absolute inset-0 z-10 rounded-full bg-gradient-to-br from-white/55 via-white/0 to-black/25 opacity-90" />
                {/* highlight */}
                <div className="pointer-events-none absolute left-2 top-2 z-10 h-7 w-7 rounded-full bg-white/50 blur-[1px] dark:bg-white/10" />
                {/* inner shadow */}
                <div className="pointer-events-none absolute inset-0 z-10 rounded-full shadow-[inset_0_-10px_18px_rgba(0,0,0,0.20)]" />
                {/* glyph */}
                <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
                  <Icon className="h-6 w-6 text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        
        {/* Keyframes */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translate3d(0, 0, 0); }
            50% { transform: translate3d(0, -6px, 0); }
          }
        `}</style>
      </div>
    </section>
  );
};


