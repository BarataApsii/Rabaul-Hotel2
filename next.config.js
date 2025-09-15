/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {}
  },
  // Disable development indicators
  devIndicators: {
    position: 'bottom-right'
  },
  // Disable React Strict Mode in development
  reactStrictMode: false,
  // Disable console in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  // Configure output directory for the build
  output: 'standalone',
  // Set the root directory for file tracing (resolves lockfile warning)
  outputFileTracingRoot: __dirname,
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  // Disable the powered by header
  poweredByHeader: false,
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Add any custom webpack configuration here
    if (process.env.NODE_ENV === 'development') {
      // Remove the ReactDevOverlay plugin in development
      const reactDevOverlayIndex = config.plugins.findIndex(
        (plugin) => plugin.constructor.name === 'ReactDevOverlay'
      );
      if (reactDevOverlayIndex !== -1) {
        config.plugins.splice(reactDevOverlayIndex, 1);
      }
    }
    return config;
  },
  // Images configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/avif', 'image/webp']
  },
  // Configure page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js']
};

module.exports = nextConfig;
