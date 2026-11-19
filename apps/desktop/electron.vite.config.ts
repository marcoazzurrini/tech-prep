import react from "@vitejs/plugin-react";
import { defineConfig } from "electron-vite";
import type { Plugin } from "vite";

/**
 * The page's content policy allows inline scripts and web sockets, which the development
 * server needs for live reload. The built app needs neither, so they are taken out.
 */
const strictPolicy = (): Plugin => ({
  apply: "build",
  name: "tech-prep:strict-policy",
  transformIndexHtml: (html) =>
    html
      .replace("script-src 'self' 'unsafe-inline'", "script-src 'self'")
      .replace("connect-src 'self' ws:", "connect-src 'self'"),
});

export default defineConfig({
  // Bundle the main process's dependencies, so the packaged app needs no node_modules.
  main: { build: { externalizeDeps: false } },
  // A sandboxed page can only load a CommonJS preload.
  preload: {
    build: {
      rollupOptions: {
        output: { entryFileNames: "[name].cjs", format: "cjs" },
      },
    },
  },
  renderer: { plugins: [react(), strictPolicy()] },
});
