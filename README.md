# React + TypeScript + Vite

## Running it

```sh
npm install
npm run dev
```

That starts two processes together: Vite on <http://localhost:5173> serving the
React app, and the Express API on <http://localhost:3001>. Vite proxies `/api` to
the API, so the browser only ever talks to one origin and there is no CORS to
configure. To run them separately, use `npm run dev:web` and `npm run dev:api`.

| Script            | What it does                                          |
| ----------------- | ----------------------------------------------------- |
| `npm run dev`     | Vite + API together, both with hot reload             |
| `npm run dev:web` | Vite only                                             |
| `npm run dev:api` | API only, restarting on change                        |
| `npm run build`   | Typechecks app and server, builds the site to `dist/` |
| `npm start`       | Runs the API, which also serves `dist/` if it exists  |

## Contact form

The form in the Contact section posts to `POST /api/contact` on the bundled
Express server ([server/](server/)), which sends the message on to
`arthurparadizi77825@gmail.com` via [Resend](https://resend.com).

The API key lives on the server and is never bundled into the browser build.

To activate it:

1. Sign up at <https://resend.com> **using `arthurparadizi77825@gmail.com`** — see
   the note below on why the address matters.
2. Create an API key under **API Keys**. Sending access is all it needs.
3. `cp .env.example .env` and paste the key into `RESEND_API_KEY`.
4. Restart the API — `.env` is only read at startup, and `tsx watch` does not
   watch it. `GET /api/health` should then report `"emailConfigured": true`.
5. When deploying, set `RESEND_API_KEY` in the host's environment variables too —
   `.env` is gitignored, so it will not travel with the repo.

Out of the box the `From:` address is `onboarding@resend.dev`, Resend's shared
sender. It needs no DNS setup, but Resend will
[only deliver it to the address that owns the account](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain)
— anything else returns a 403. That restriction costs nothing here, because the
only recipient is `CONTACT_TO`; register the account with that same address and
the form works with no domain at all.

You need a verified domain once you want to mail anyone else — an
acknowledgement back to the visitor, most obviously — or once you want the
deliverability of a sender you control. Verify it with Resend and set
`CONTACT_FROM`; no code changes.

Until a key is set, the server reports itself unconfigured and the form falls back
to opening the visitor's mail client with the message pre-filled, so submissions
are never silently dropped.

The endpoint validates every field, drops anything that fills the hidden honeypot
field, and rate-limits per IP — 5 messages an hour in production, 100 in
development, overridable with `CONTACT_RATE_LIMIT`. Only messages actually handed
to Resend count against that quota, so a visitor who mistypes their email is never
locked out over a submission that was never sent. `GET /api/health` reports whether
email is configured and where it delivers.

## Deploying

`npm run build` produces `dist/`, and `npm start` runs a single Node process that
serves both `dist/` and the API — so the whole site deploys as one app to anywhere
that runs Node (Railway, Render, Fly.io, a VPS). Set `RESEND_API_KEY` in the host's
environment, and `PORT` if the host does not inject one.

---

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
