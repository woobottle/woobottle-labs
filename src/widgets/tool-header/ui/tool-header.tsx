"use client";

import React from "react";

interface ToolHeaderProps {
  /** Small uppercase label above the title, e.g. "QR CODE". */
  eyebrow: string;
  /** Tool name shown as the main heading. */
  title: string;
  /** One-line description under the title. */
  description?: string;
  /**
   * Optional background image URL. When provided it replaces the generated
   * gradient — drop a per-tool image here later without touching anything else.
   */
  image?: string;
}

/**
 * Deterministic hue (0–359) derived from a string. Same title always yields
 * the same colour, so each tool gets a stable, unique accent and there is no
 * SSR/client hydration mismatch.
 */
const hueFromString = (s: string): number => {
  let hash = 0;
  for (let i = 0; i < s.length; i += 1) {
    hash = (Math.imul(hash, 31) + s.charCodeAt(i)) | 0;
  }
  return ((hash % 360) + 360) % 360;
};

/**
 * Cinematic header band for tool detail pages. Renders a compact banner with
 * the tool's eyebrow / title / description over a per-tool gradient (or an
 * optional image), matching the home hero's visual language. The work area
 * renders below it as usual.
 */
export const ToolHeader: React.FC<ToolHeaderProps> = ({
  eyebrow,
  title,
  description,
  image,
}) => {
  const hue = hueFromString(title);
  const hue2 = (hue + 40) % 360;

  // Dark, glossy, tinted gradient — cinematic but readable.
  const gradient = `radial-gradient(130% 140% at 18% 12%, hsl(${hue} 60% 24% / 0.95), transparent 58%), linear-gradient(135deg, hsl(${hue} 42% 15%) 0%, hsl(${hue2} 48% 7%) 100%)`;

  return (
    <header className="relative mb-8 overflow-hidden rounded-2xl border border-white/10 sm:mb-10 sm:rounded-3xl">
      {/* Background: per-tool gradient, or an image when provided */}
      {image ? (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: gradient }}
        />
      )}

      {/* Bottom darkening for text legibility */}
      <div className="cinematic-header-scrim pointer-events-none absolute inset-0" />

      {/* Content */}
      <div className="relative z-10 flex min-h-[150px] flex-col justify-end p-5 sm:min-h-[190px] sm:p-8">
        <div
          className="animate-blur-fade-up text-xs uppercase tracking-[0.2em] text-white/70"
          style={{ animationDelay: "0ms" }}
        >
          {eyebrow}
        </div>
        <h1
          className="animate-blur-fade-up mt-2 text-3xl font-normal text-white sm:text-4xl md:text-5xl"
          style={{ animationDelay: "100ms", letterSpacing: "-0.03em" }}
        >
          {title}
        </h1>
        {description && (
          <p
            className="animate-blur-fade-up mt-3 max-w-2xl text-sm text-gray-300 sm:text-base"
            style={{ animationDelay: "200ms" }}
          >
            {description}
          </p>
        )}
      </div>
    </header>
  );
};
