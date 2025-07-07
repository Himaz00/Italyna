import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/Italyna/", // Set this to your repo name
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Removed Lovable Tagger integration by Ayham Zedan
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
