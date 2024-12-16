import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base : '/page/',
  css: {
    modules: {
      generateScopedName: "[name]__[local]___[hash:base64:5]",
    },
  },
});
