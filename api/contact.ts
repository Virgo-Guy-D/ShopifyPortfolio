import { createApp } from '../server/app.js';

/**
 * Vercel serverless entrypoint for POST /api/contact.
 *
 * An Express app is itself a `(req, res)` handler, so it can be the default
 * export directly. Vercel passes the original request URL through, which is what
 * the router matches on — the same `app.use('/api', contactRouter)` mounting
 * therefore works here and on a plain Node server.
 *
 * One file per route rather than a single catch-all plus a rewrite: the mapping
 * is then Vercel's own file convention, with no path rewriting to get wrong.
 */
export default createApp();
