/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: {}, optimizeCss: true, scrollRestoration: true, optimizePackageImports: ['lucide-react', 'date-fns'] },
  reactStrictMode: false,
  compiler: { removeConsole: process.env.NODE_ENV === 'production' },
  output: 'standalone',
  outputFileTracingRoot: __dirname,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cms.rabaulhotel.com.pg' },
      { protocol: 'https', hostname: 'rabaul-admin.kesug.com' },
    ],
    // Configure image formats and sizes
    formats: ['image/webp'], // Serve WebP by default when possible
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Define allowed image qualities
    qualities: [75, 85, 100]
  },
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  env: {
    NEXT_PUBLIC_WORDPRESS_URL: process.env.NEXT_PUBLIC_WORDPRESS_URL,
    NEXT_PUBLIC_WORDPRESS_API_URL: process.env.NEXT_PUBLIC_WORDPRESS_API_URL,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL
  },
};

module.exports = nextConfig;
