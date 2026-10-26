import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Preloads the Latin file of Space Grotesk (the logo's face and the site's type), so the logo and the
 * first headline are drawn in it straight away instead of swapping in after the stylesheet asks for it.
 */
function preloadBrandFont(): Plugin {
  return {
    name: "preload-brand-font",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(_html, ctx) {
        const file = Object.keys(ctx.bundle ?? {}).find((f) => /space-grotesk-latin-wght-normal.*\.woff2$/.test(f));
        if (!file) return;
        return [
          {
            tag: "link",
            attrs: { rel: "preload", href: `/${file}`, as: "font", type: "font/woff2", crossorigin: "" },
            injectTo: "head",
          },
        ];
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), preloadBrandFont()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "./src") },
  },
  // design-tool notes and review files live in .impeccable; editing them should never reload the page
  server: { watch: { ignored: ["**/.impeccable/**"] } },
});
