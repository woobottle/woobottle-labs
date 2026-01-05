'use client';

import React from 'react';
import Link from 'next/link';

import { clsx } from 'clsx';

import type { VisionOsHeroOrb } from './visionos-hero';

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

function useIsDarkMode() {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const el = document.documentElement;
    const update = () => setIsDark(el.classList.contains('dark'));
    update();

    const mo = new MutationObserver(update);
    mo.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => mo.disconnect();
  }, []);

  return isDark;
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

export const VisionOsHeroCanvas: React.FC<{
  orbs?: VisionOsHeroOrb[];
  /** Optional footer actions; rendered as HTML overlay */
  actions?: React.ReactNode;
}> = ({ orbs, actions }) => {
  const reducedMotion = useReducedMotion();
  const isDark = useIsDarkMode();
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  // Pointer-parallax for subtle “spatial” vibe.
  const onPointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reducedMotion) return;
      const el = rootRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const nx = (x - 0.5) * 2;
      const ny = (y - 0.5) * 2;
      el.style.setProperty('--mx', String(nx.toFixed(4)));
      el.style.setProperty('--my', String(ny.toFixed(4)));
    },
    [reducedMotion],
  );

  const onPointerLeave = React.useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    el.style.setProperty('--mx', '0');
    el.style.setProperty('--my', '0');
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const palette = isDark
      ? {
          pageBg: '#050506',
          roomTop: '#111214',
          roomBottom: '#070708',
          roomShadow: 'rgba(0,0,0,0.55)',
          wallTop: '#0E0F10',
          wallBottom: '#070708',
          floorTop: '#0B0C0D',
          floorBottom: '#060607',
          windowTop: 'rgba(255,255,255,0.08)',
          windowBottom: '#070708',
          windowBar: 'rgba(255,255,255,0.12)',
          sunlight: 'rgba(255,255,255,0.07)',
          bloomCenter: 'rgba(255,255,255,0.18)',
          bloomEdge: 'rgba(255,255,255,0)',
          castAlpha: 0.08,
        }
      : {
          pageBg: '#DFDFE1',
          roomTop: '#F7F7F8',
          roomBottom: '#E9EBEF',
          roomShadow: 'rgba(0,0,0,0.14)',
          wallTop: '#F9FAFB',
          wallBottom: '#E6EAF1',
          floorTop: '#ECEFF4',
          floorBottom: '#DDE2EA',
          windowTop: 'rgba(255,255,255,0.78)',
          windowBottom: '#E2E7EF',
          windowBar: 'rgba(255,255,255,0.46)',
          sunlight: 'rgba(0,0,0,0.10)',
          bloomCenter: 'rgba(255,255,255,0.90)',
          bloomEdge: 'rgba(255,255,255,0)',
          castAlpha: 0.10,
        };

    const draw = () => {
      const rect = root.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));

      // Resize canvas for crispness.
      const targetW = Math.floor(w * dpr);
      const targetH = Math.floor(h * dpr);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Background (observed cool light gray)
      ctx.fillStyle = palette.pageBg;
      ctx.fillRect(0, 0, w, h);

      // Room frame (centered)
      const roomW = Math.min(w * 0.88, 920);
      const roomH = Math.min(h * 0.72, 480);
      const roomX = (w - roomW) / 2;
      const roomY = (h - roomH) / 2;
      const r = 40;

      // Soft shadow
      ctx.save();
      ctx.shadowColor = palette.roomShadow;
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 24;
      roundRectPath(ctx, roomX, roomY, roomW, roomH, r);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.restore();

      // Room gradient
      const roomGrad = ctx.createLinearGradient(roomX, roomY, roomX, roomY + roomH);
      roomGrad.addColorStop(0, palette.roomTop);
      roomGrad.addColorStop(1, palette.roomBottom);
      roundRectPath(ctx, roomX, roomY, roomW, roomH, r);
      ctx.fillStyle = roomGrad;
      ctx.fill();

      // Back wall
      const wallPadL = roomW * 0.18;
      const wallPadR = roomW * 0.16;
      const wallTop = roomY + roomH * 0.11;
      const wallH = roomH * 0.63;
      const wallX = roomX + wallPadL;
      const wallW = roomW - wallPadL - wallPadR;
      const wallGrad = ctx.createLinearGradient(wallX, wallTop, wallX, wallTop + wallH);
      wallGrad.addColorStop(0, palette.wallTop);
      wallGrad.addColorStop(1, palette.wallBottom);
      roundRectPath(ctx, wallX, wallTop, wallW, wallH, 28);
      ctx.fillStyle = wallGrad;
      ctx.fill();

      // Floor
      const floorH = roomH * 0.22;
      const floorY = roomY + roomH - roomH * 0.12 - floorH;
      const floorX = roomX + roomW * 0.10;
      const floorW = roomW * 0.80;
      const floorGrad = ctx.createLinearGradient(floorX, floorY, floorX, floorY + floorH);
      floorGrad.addColorStop(0, palette.floorTop);
      floorGrad.addColorStop(1, palette.floorBottom);
      roundRectPath(ctx, floorX, floorY, floorW, floorH, 30);
      ctx.fillStyle = floorGrad;
      ctx.fill();

      // Right-side “window” block
      const winW = roomW * 0.16;
      const winX = roomX + roomW - roomW * 0.06 - winW;
      const winY = wallTop;
      const winH = wallH + floorH * 0.55;
      const winGrad = ctx.createLinearGradient(winX, winY, winX, winY + winH);
      winGrad.addColorStop(0, palette.windowTop);
      winGrad.addColorStop(1, palette.windowBottom);
      roundRectPath(ctx, winX, winY, winW, winH, 26);
      ctx.fillStyle = winGrad;
      ctx.fill();

      // Window bars
      ctx.fillStyle = palette.windowBar;
      const barW = Math.max(8, winW * 0.06);
      roundRectPath(ctx, winX + winW / 2 - barW / 2, winY + 14, barW, winH - 28, barW / 2);
      ctx.fill();
      const barH = Math.max(8, winH * 0.06);
      roundRectPath(ctx, winX + 14, winY + winH / 2 - barH / 2, winW - 28, barH, barH / 2);
      ctx.fill();

      // Sunlight cast (subtle diagonal shadow)
      ctx.save();
      ctx.globalAlpha = palette.castAlpha;
      ctx.translate(roomX + roomW * 0.56, roomY + roomH * 0.25);
      const mx = Number(root.style.getPropertyValue('--mx') || 0);
      const my = Number(root.style.getPropertyValue('--my') || 0);
      if (!reducedMotion) ctx.rotate((mx * 2 * Math.PI) / 180);
      ctx.fillStyle = palette.sunlight;
      roundRectPath(ctx, -wallW * 0.35, -wallH * 0.1, wallW * 0.75, wallH * 0.8, 26);
      ctx.filter = 'blur(0.6px)';
      ctx.fill();
      ctx.restore();

      // Soft highlight bloom
      ctx.save();
      ctx.globalAlpha = reducedMotion ? 0.55 : 0.65;
      const bloomX = roomX + roomW * (0.80 + mx * 0.02);
      const bloomY = roomY + roomH * (0.20 + my * 0.02);
      const rad = Math.min(roomW, roomH) * 0.42;
      const glow = ctx.createRadialGradient(bloomX, bloomY, 0, bloomX, bloomY, rad);
      glow.addColorStop(0, palette.bloomCenter);
      glow.addColorStop(1, palette.bloomEdge);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(bloomX, bloomY, rad, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      raf = window.requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(() => {
      if (raf) cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(draw);
    });
    ro.observe(root);

    raf = window.requestAnimationFrame(draw);
    return () => {
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reducedMotion, isDark]);

  return (
    <section
      ref={rootRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={clsx(
        'relative overflow-hidden rounded-[32px] border border-white/30 bg-[#DFDFE1] shadow-xl',
        'dark:border-gray-700/40 dark:bg-black',
      )}
      style={
        {
          ['--mx' as any]: 0,
          ['--my' as any]: 0,
        } as React.CSSProperties
      }
    >
      <div className="relative h-[520px] w-full sm:h-[560px] lg:h-[620px]">
        {/* Canvas background */}
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />

        {/* Floating orbs as HTML (clickable + accessible) */}
        <div
          className={clsx(
            'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
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
              <div
                className={clsx(
                  'pointer-events-none absolute inset-0 z-0 rounded-full',
                  colorClassName ?? 'bg-gradient-to-br from-zinc-400 to-zinc-500',
                )}
              />
              <div className="pointer-events-none absolute inset-0 z-10 rounded-full bg-gradient-to-br from-white/55 via-white/0 to-black/25 opacity-90" />
              <div className="pointer-events-none absolute left-2 top-2 z-10 h-7 w-7 rounded-full bg-white/50 blur-[1px] dark:bg-white/10" />
              <div className="pointer-events-none absolute inset-0 z-10 rounded-full shadow-[inset_0_-10px_18px_rgba(0,0,0,0.20)]" />
              <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
                <Icon className="h-6 w-6 text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]" />
              </div>
            </div>
          ))}
        </div>

        {/* Optional actions (HTML overlay) */}
        {actions ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 p-6 sm:p-10">
            <div className="pointer-events-auto inline-flex flex-col gap-3 sm:flex-row sm:items-center">
              {actions}
            </div>
          </div>
        ) : null}

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


