import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "process": "process/browser",
      "stream": "stream-browserify",
      "buffer": "buffer",
      "util": "util",
      "events": "events",
    },
  },
  define: {
    "process.env": {},
    "global": {},
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      external: ["fs"],
    },
  },
  optimizeDeps: {
    include: [
      "buffer",
      "process",
      "events",
      "assert",
      "stream-browserify",
      "@project-serum/anchor",
      "@solana/web3.js",
    ],
    exclude: ["fs"],
  },
});
