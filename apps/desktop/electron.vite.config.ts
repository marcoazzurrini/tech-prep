import react from "@vitejs/plugin-react";
import { defineConfig } from "electron-vite";

export default defineConfig({
  // Bundle the main process's dependencies, so the packaged app needs no node_modules.
  main: { build: { externalizeDeps: false } },
  preload: {},
  renderer: { plugins: [react()] },
});
