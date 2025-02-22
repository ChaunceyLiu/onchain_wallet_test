import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        experimentalMinChunkSize: 2048, // 2025推荐值
      },
    },
  },
});
