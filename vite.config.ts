import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(async () => {
  const plugins = [react(), tailwindcss()];
  try {
    // @ts-ignore
    const m = await import('./.vite-source-tags.js');
    plugins.push(m.sourceTags());
  } catch {}
  return {
    plugins,
    server: {
      // Vite's default (`localhost`) resolves to ::1 on some Windows setups and
      // then isn't reachable over IPv4. Pin it to match the API's binding.
      host: '127.0.0.1',
      proxy: {
        // Hand /api to the Express server so the browser sees one origin and
        // never deals with CORS. Spelled 127.0.0.1 rather than localhost: that
        // can resolve to ::1, which the API server is not listening on.
        '/api': { target: 'http://127.0.0.1:3001', changeOrigin: true },
      },
    },
  };
})
