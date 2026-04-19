import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://stonebranches.life',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
