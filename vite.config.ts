import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative base: the build works at any path, including GitHub Pages' /himalayan-trecking-company/.
  base: "./",
  plugins: [react()],
});
