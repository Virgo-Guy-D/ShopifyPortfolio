import express from 'express';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { contactRouter } from './contact';
import { CONTACT_TO, HOST, PORT, RESEND_API_KEY } from './config';

const isProduction = process.env.NODE_ENV === 'production';
const distDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');

const app = express();

/**
 * Hosting platforms terminate TLS in front of the app, so the client's real
 * address arrives in X-Forwarded-For. Trust exactly one hop — trusting the whole
 * chain would let a caller spoof the header and walk around the rate limiter.
 * In development nothing sits in front, so trust nothing.
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

// Anything still unmatched under /api is a missing route, not a page — answer in
// JSON so the browser's fetch gets something it can parse.
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

/**
 * In production this process serves the built site as well as the API, so the
 * whole portfolio is one deployable with no CORS between halves. In development
 * `dist/` is stale or absent and Vite serves the app instead — requests reach
 * this server only through Vite's /api proxy.
 */
if (existsSync(distDir)) {
  app.use(express.static(distDir));
  // Client-side routing: any non-API path that reached here is a react-router
  // route, so hand back the shell and let the app resolve it.
  app.use((_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

// Malformed JSON throws inside express.json(); without this Express would answer
// with an HTML error page that the browser's `await response.json()` chokes on.
app.use((err: Error & { status?: number }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err?.status === 400 && 'body' in err) {
    res.status(400).json({ error: 'Malformed request.' });
    return;
  }
  console.error('[server] Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong.' });
});

app.listen(PORT, HOST, () => {
  console.log(`  ▸ API      http://${HOST}:${PORT}/api/health`);
  if (!RESEND_API_KEY) {
    console.warn('  ▸ WARNING  RESEND_API_KEY is not set — the contact form will fall back to mailto:');
  }
});
