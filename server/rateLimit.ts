import type { RequestHandler } from 'express';

type Window = { count: number; resetAt: number };

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      /**
       * Charges this request against the caller's quota. Routes call it only
       * once they have decided the request was worth counting.
       */
      consumeRateLimit?: () => void;
    }
  }
}

/**
 * Fixed-window limiter keyed by IP, held in memory.
 *
 * Deliberately *checks* the quota but does not spend it — the route decides what
 * counts, via `req.consumeRateLimit()`. Charging on arrival would mean a visitor
 * who mistypes their email a few times gets locked out for an hour without a
 * single message ever having been sent.
 *
 * In-memory is the right trade for a portfolio: no Redis to run, no cost, and a
 * restart clearing the counters is harmless.
 *
 * Be clear about what that buys on Vercel, though. Serverless instances do not
 * share memory, so the quota is per warm instance rather than per IP globally:
 * a burst that lands on one instance is blunted, but an attacker spread across
 * several gets the allowance several times over. That is acceptable here — the
 * cap exists to stop casual form-spam running up the Resend quota, and the
 * honeypot and validation still apply to every request regardless. Making it
 * exact means a shared store (Vercel KV / Upstash), which is a deliberate
 * upgrade, not something to assume.
 */
export function rateLimit({ windowMs, max }: { windowMs: number; max: number }): RequestHandler {
  const hits = new Map<string, Window>();

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip ?? 'unknown';
    let window = hits.get(key);

    if (!window || now > window.resetAt) {
      window = { count: 0, resetAt: now + windowMs };
      hits.set(key, window);
      // Expired entries would otherwise accumulate for every IP ever seen.
      if (hits.size > 5_000) {
        for (const [k, w] of hits) if (now > w.resetAt) hits.delete(k);
      }
    }

    if (window.count >= max) {
      const retryAfter = Math.ceil((window.resetAt - now) / 1000);
      res.setHeader('Retry-After', String(retryAfter));
      res.status(429).json({
        error: 'Too many messages sent from this address. Please try again later.',
      });
      return;
    }

    const charged = window;
    req.consumeRateLimit = () => {
      charged.count += 1;
    };
    next();
  };
}
