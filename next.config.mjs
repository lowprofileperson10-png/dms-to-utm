/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ["unpdf"],
  experimental: {
    // Isola o compilador Webpack para evitar que o processo principal
    // acumule todos os módulos até atingir o limite de memória da Vercel.
    webpackBuildWorker: true,
    webpackMemoryOptimizations: true,
  },
}

export default nextConfig
