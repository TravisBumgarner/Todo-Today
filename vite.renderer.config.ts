import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vitejs.dev/config
export default defineConfig({
  plugins: [react({})],
  resolve: {
    alias: {
      components: path.resolve(__dirname, "src/renderer/components/"),
      modals: path.resolve(__dirname, "src/renderer/modals/"),
      types: path.resolve(__dirname, "src/renderer/types.ts"),
      theme: path.resolve(__dirname, "src/renderer/theme.tsx"),
      colors: path.resolve(__dirname, "src/renderer/colors.tsx"),
      utilities: path.resolve(__dirname, "src/renderer/utilities.tsx"),
      database: path.resolve(__dirname, "src/renderer/database/index.ts"),
      shared: path.resolve(__dirname, "src/shared/"),
    },
  },
  root: "./src/renderer",
  build: {
    outDir: "../../.vite/renderer/main_window",
  },
  server: {
    port: 5173,
  },
});
