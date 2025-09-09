import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { copyFileSync } from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
  },
  base: "/",
  plugins: [
    react(),
    {
      name: 'copy-redirects',
      writeBundle() {
        try {
          copyFileSync('public/_redirects', 'dist/_redirects');
          console.log('✅ Copied _redirects to dist');
        } catch (error) {
          console.log('⚠️ _redirects file not found, skipping...');
        }
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
