import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
    plugins: [
        vue(),
    ],
    server: {
        proxy: {
            "/api": {
                // 这里匹配所有以 '/api' 开头的请求
                target: "https://api.reptile1024.com/", // 你的API服务器地址
                changeOrigin: true,
                // rewrite: (path) => path.replace(/^\/api/, ""), // 重写路径: 去掉路径中的 '/api'
            },
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            process: "process/browser",
            stream: "stream-browserify",
            buffer: "buffer",
            util: "util",
            events: "events",
            crypto: 'crypto-browserify'
        },
    },
    define: {
        "process.env": {},
        // global: {},
        '_vm._self._c': {}
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
            'crypto-browserify'
        ],
        exclude: ["fs"],
    },
});
