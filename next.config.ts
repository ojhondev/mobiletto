import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // cacheComponents desligado: o painel é todo autenticado/dinâmico e o site é
  // estático com revalidação sob demanda (revalidatePath a cada edição no painel).
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  experimental: {
    serverActions: {
      // currículo de até 4MB e fotos já comprimidas no navegador (limite da Vercel: 4,5MB)
      bodySizeLimit: "4.5mb",
    },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
