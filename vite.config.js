// // vite.config.js
// export default {
//   // config options

// };

// vite.config.js
import { defineConfig } from "vite";
import { ViteMinifyPlugin } from "vite-plugin-minify";

export default defineConfig({
  server: {
    host: "localhost",
    cors: "*",
    hmr: {
      host: "localhost",
      protocol: "ws",
    },
  },
  // build: { target: "esnext" },
  plugins: [
    // input https://www.npmjs.com/package/html-minifier-terser options
    // ViteMinifyPlugin(),
  ],
  build: {
    outDir: "./build",
    rollupOptions: {
      input: {
        anfrage: "js/anfrage.js",
        calculator: "js/calculator.js",
        reviews: "js/reviews.js",
        index: "js/index.js",
        fileUpload: "js/file-upload.js",
        params: "js/params.js",
        createJSONLD: "js/createJSONLD.js",
        "multi-step-form": "js/multi-step-form.js",
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
});
