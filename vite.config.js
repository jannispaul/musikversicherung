// // vite.config.js
// export default {
//   // config options

// };

// vite.config.js
import { defineConfig } from "vite";
import { ViteMinifyPlugin } from "vite-plugin-minify";

export default defineConfig({
  // build: { target: "esnext" },
  plugins: [
    // input https://www.npmjs.com/package/html-minifier-terser options
    // ViteMinifyPlugin(),
  ],
  build: {
    rollupOptions: {
      input: {
        anfrage: "js/anfrage.js",
        reviews: "js/reviews.js",
        index: "js/index.js",
        fileUpload: "js/file-upload.js",
        createJSONLD: "js/createJSONLD.js",
        "multi-step-form": "js/multi-step-form.js",
      },
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
});
