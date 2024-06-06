import { defineConfig, squooshImageService } from "astro/config";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  image: {
    service: squooshImageService()
  },
  site: 'https://ebacala.com',
  integrations: [sitemap()]
});