import express from 'express';
import path from 'node:path';
import { contactRouter } from './contact';
import { CONTACT_TO, RESEND_API_KEY, isProduction } from './config';

/**
 * Builds the Express app.
 *
 * Deliberately separate from the process that listens, so the same routes serve
 * two deployments: a long-lived Node server (`npm start`, which also serves the
 * built site) and a Vercel serverless function, which never calls `listen` and
 * has the static files served by the CDN in front of it.
 *
 * @param staticDir Directory of built assets to serve. Omitted on serverless,
 *   where the platform serves them and this process only answers /api.
 */
export function createApp({ staticDir }: { staticDir?: string } = {}) {
  const app = express();

  /**
   * Hosting platforms terminate TLS in front of the app, so the client's real
   * address arrives in X-Forwarded-For. Trust exactly one hop — trusting the
   * whole chain would let a caller spoof the header and walk around the rate
   * limiter. In development nothing sits in front, so trust nothing.
   */
  app.set('trust proxy', isProduction ? 1 : false);
  app.disable('x-powered-by');

  // Messages are capped well below this server-side; the limit is here to stop a
  // multi-megabyte body being parsed at all.
  app.use(express.json({ limit: '64kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, emailConfigured: Boolean(RESEND_API_KEY), deliversTo: CONTACT_TO });
  });

  app.use('/api', contactRouter);

  // Anything still unmatched under /api is a missing route, not a page — answer
  // in JSON so the browser's fetch gets something it can parse.
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Not found.' });
  });

  if (staticDir) {
    app.use(express.static(staticDir));
    // The site is a single page, so anything left is still the shell.
    app.use((_req, res) => {
      res.sendFile(path.join(staticDir, 'index.html'));
    });
  }

  // Malformed JSON throws inside express.json(); without this Express would
  // answer with an HTML error page that the browser's `await response.json()`
  // chokes on. Registered last so it sits behind every route above.
  app.use((err: Error & { status?: number }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (err?.status === 400 && 'body' in err) {
      res.status(400).json({ error: 'Malformed request.' });
      return;
    }
    console.error('[server] Unhandled error:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  });

  return app;
}
