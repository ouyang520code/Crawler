import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    // Vite路径别名配置
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: [
      "@solana/web3.js",
      "@solana/wallet-adapter-base",
      "@solana/wallet-adapter-vue",
      "@solana/wallet-adapter-wallets",
    ],
  },
});
