import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    server: {
      proxy: {
        "/api": {
          // target: "https://pern-europe-ua.onrender.com/api",
          target: "http://localhost:5000/api",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  },
});

// export default defineConfig(({ mode }) => {
//   // Charger les variables d'environnement
//   const env = loadEnv(mode, process.cwd(), "");
//   console.log("🚀 ~ defineConfig ~ env:", env, mode);

//   return {
//     plugins: [react()],
//     server: {
//       proxy: {
//         "/api": {
//           target: env.VITE_APP_API_URL,
//           changeOrigin: true,
//           rewrite: (path) => path.replace(/^\/api/, ""),
//         },
//       },
//     },
//     // Définir des variables globales si nécessaire
//     define: {
//       __APP_ENV__: JSON.stringify(mode),
//     },
//   };
// });
