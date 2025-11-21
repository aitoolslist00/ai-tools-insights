// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// https://astro.build.config
export default defineConfig({
  site: 'https://www.aitoolsinsights.com',
  output: 'server',
  integrations: [react()],
  
  vite: {
    ssr: {
      noExternal: ['bcryptjs']
    }
  },

  adapter: vercel({
    webAnalytics: {
      enabled: false
    }
  })
});
