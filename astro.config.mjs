// @ts-check
import { defineConfig, envField } from "astro/config";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [react(), sitemap()],
  server: { port: 3000 },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
      // https://github.com/facebook/react/issues/31827
      alias: {
        "react-dom/server": "react-dom/server.edge",
      },
    },
  },
  adapter: cloudflare(),
  env: {
    schema: {
      SUPABASE_URL: envField.string({
        access: "secret",
        context: "server",
      }),
      SUPABASE_KEY: envField.string({
        access: "secret",
        context: "server",
      }),
      OPENROUTER_API_KEY: envField.string({
        access: "secret",
        context: "server",
      }),
    },
  },
});
