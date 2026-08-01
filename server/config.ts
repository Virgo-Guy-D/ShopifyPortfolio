import 'dotenv/config';

/**
 * Reads an environment variable, treating blank as absent.
 *
 * `.env` templates conventionally ship keys with empty values (`CONTACT_TO=`),
 * and dotenv turns those into `""`. A plain `??` accepts that happily, so the
 * fallbacks below would be skipped in favour of nothing — mail addressed to an
 * empty recipient, a port of `Number('') === 0`, a rate limit of zero. Blank has
 * to mean "not set".
 */
function env(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function envNumber(name: string, fallback: number): number {
  const raw = env(name);
  if (raw === undefined) return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    console.warn(`[config] ${name}="${raw}" is not a number — using ${fallback}.`);
    return fallback;
  }
  return parsed;
}

export const isProduction = process.env.NODE_ENV === 'production';

/** Where contact form submissions are delivered. */
export const CONTACT_TO = env('CONTACT_TO') ?? 'brilliantshopifydev@gmail.com';

/**
 * The `From:` address. Resend only accepts a domain you have verified with them;
 * `onboarding@resend.dev` is their shared sender, which works without any DNS
 * setup but only delivers to the address that owns the API key. Fine for a form
 * whose sole recipient is that same address — swap in your own domain before
 * sending anywhere else.
 */
export const CONTACT_FROM = env('CONTACT_FROM') ?? 'Portfolio <onboarding@resend.dev>';

/**
 * Absent key means the server can accept submissions but cannot deliver them.
 * Rather than pretend otherwise, /api/contact reports itself unconfigured and
 * the browser falls back to a mailto: link — a message is never silently lost.
 */
export const RESEND_API_KEY = env('RESEND_API_KEY') ?? '';

export const PORT = envNumber('PORT', 3001);

/**
 * Bind to all interfaces in production (hosts route external traffic in) but
 * loopback-only in development, so a dev machine isn't serving the local network.
 */
export const HOST = env('HOST') ?? (isProduction ? '0.0.0.0' : '127.0.0.1');

/**
 * Messages allowed per IP per hour.
 *
 * Kept generous in development: locally every request — your browser, curl, the
 * Vite proxy — arrives from 127.0.0.1 and shares a single bucket, so a
 * production-tight limit locks you out of your own form while iterating.
 */
export const RATE_LIMIT_MAX = envNumber('CONTACT_RATE_LIMIT', isProduction ? 5 : 100);
