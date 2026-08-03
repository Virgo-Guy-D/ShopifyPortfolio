import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createApp } from './app.js';
import { HOST, PORT, RESEND_API_KEY } from './config.js';

/**
 * Standalone server: one Node process serving both the API and the built site.
 * Used by `npm run dev` locally and by `npm start` on any host that runs Node.
 * Vercel does not use this file — see api/ for the serverless entrypoints.
 */
const distDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');

// In development `dist/` is stale or absent and Vite serves the app instead;
// requests reach this process only through Vite's /api proxy.
const app = createApp({ staticDir: existsSync(distDir) ? distDir : undefined });

app.listen(PORT, HOST, () => {
  console.log(`  ▸ API      http://${HOST}:${PORT}/api/health`);
  if (!RESEND_API_KEY) {
    console.warn('  ▸ WARNING  RESEND_API_KEY is not set — the contact form will fall back to mailto:');
  }
});
