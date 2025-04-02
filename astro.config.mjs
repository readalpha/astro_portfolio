import { defineConfig } from 'astro/config';
import preact from "@astrojs/preact";
import sassGlobImports from 'vite-plugin-sass-glob-import';
import relativeLinks from 'astro-relative-links';
import path from "path";


// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  integrations: [preact()],
  sourcemap: "inline",
  plugins: [
    sassGlobImports()
  ],
  integrations: [
    relativeLinks(),
  ],
  compressHTML: false,
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "src/assets/org/sass/variables/_common.scss" as *;
            @use "src/assets/org/sass/functions/_common.scss" as *;
            @use "src/assets/org/sass/mixins/_responsive.scss" as *;
          `
        }
      }
    },
    resolve: {
      alias: {
        "@images": path.resolve("./src/assets/images"),
      },
    },
    build: {
      rollupOptions: {
        // input: {
        //   app: "./src/assets/org/js/entry/app.js",
        // },
        output: {
          entryFileNames: "assets/js/entry/app.[hash].js",
          assetFileNames: "assets/css/style.[hash].css",
        },
      },
      minify: true,
    },
  },
});