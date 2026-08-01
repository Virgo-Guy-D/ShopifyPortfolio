import { Router } from 'express';
import { Resend } from 'resend';
import { CONTACT_FROM, CONTACT_TO, RATE_LIMIT_MAX, RESEND_API_KEY } from './config';
import { rateLimit } from './rateLimit';

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const LIMITS = { name: 100, email: 254, message: 5_000 } as const;

// Deliberately loose: the only claim worth making here is "looks like an
// address". Anything stricter rejects valid addresses, and delivery is the
// real test anyway.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Submission = { name: string; email: string; message: string };

function validate(body: unknown): { ok: true; data: Submission } | { ok: false; error: string } {
  if (typeof body !== 'object' || body === null) {
    return { ok: false, error: 'Expected a JSON object.' };
  }

  const { name, email, message } = body as Record<string, unknown>;

  for (const [field, value] of Object.entries({ name, email, message })) {
    if (typeof value !== 'string' || !value.trim()) {
      return { ok: false, error: `Please fill in your ${field}.` };
    }
    if (value.length > LIMITS[field as keyof typeof LIMITS]) {
      return { ok: false, error: `That ${field} is too long.` };
    }
  }

  if (!EMAIL.test((email as string).trim())) {
    return { ok: false, error: 'That email address does not look right.' };
  }

  return {
    ok: true,
    data: {
      name: (name as string).trim(),
      email: (email as string).trim(),
      message: (message as string).trim(),
    },
  };
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => `&${{ '&': 'amp', '<': 'lt', '>': 'gt', '"': 'quot', "'": '#39' }[c]};`);

export const contactRouter = Router();

contactRouter.post(
  '/contact',
  rateLimit({ windowMs: 60 * 60 * 1000, max: RATE_LIMIT_MAX }),
  async (req, res) => {
    // Bots fill every field they find; the browser keeps this one hidden. Accept
    // and discard silently — telling a bot it failed just invites a retry.
    if (typeof req.body?.company_website === 'string' && req.body.company_website) {
      // Charged: a caught bot should spend its quota, not get free retries.
      req.consumeRateLimit?.();
      res.status(200).json({ ok: true });
      return;
    }

    const result = validate(req.body);
    if (!result.ok) {
      res.status(400).json({ error: result.error });
      return;
    }
    const { name, email, message } = result.data;

    // No API key: say so explicitly so the browser can fall back to mailto:
    // rather than reporting a delivery that never happened.
    if (!resend) {
      res.status(503).json({
        code: 'not_configured',
        error: 'Email delivery is not configured on this server.',
      });
      return;
    }

    // Charged here and nowhere else on the happy path: the quota exists to limit
    // mail actually sent, so a rejected or undeliverable submission above this
    // line costs the visitor nothing.
    req.consumeRateLimit?.();

    try {
      const { error } = await resend.emails.send({
        from: CONTACT_FROM,
        to: CONTACT_TO,
        // Hitting reply in the inbox answers the visitor directly.
        replyTo: email,
        subject: `Portfolio enquiry from ${name.replace(/\s+/g, ' ')}`,
        text: `${message}\n\n— ${name} (${email})`,
        html:
          `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>` +
          `<hr><p>— ${escapeHtml(name)} (<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>)</p>`,
      });

      // Resend reports delivery failures in the body, not the HTTP status.
      if (error) {
        console.error('[contact] Resend rejected the message:', error);
        res.status(502).json({ error: 'The message could not be sent.' });
        return;
      }

      res.status(200).json({ ok: true });
    } catch (err) {
      console.error('[contact] Unexpected failure sending message:', err);
      res.status(502).json({ error: 'The message could not be sent.' });
    }
  },
);
