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
  },
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  env: { NEXT_PUBLIC_WORDPRESS_URL: process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://cms.rabaulhotel.com.pg/wp-cms' },
};

module.exports = nextConfig;
