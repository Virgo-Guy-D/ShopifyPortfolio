import { createApp } from '../server/app';

/**
 * Vercel serverless entrypoint for GET /api/health.
 *
 * Worth keeping in production: it reports whether RESEND_API_KEY actually
 * reached the deployment and which address mail is addressed to, which is the
 * quickest way to tell a missing environment variable apart from a genuine
 * delivery failure.
 */
export default createApp();
