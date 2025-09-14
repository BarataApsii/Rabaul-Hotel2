/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    // Disable the Next.js development toolbar
    reactDevOverlay: false,
  },
  // Disable development indicators
  devIndicators: {
    position: 'bottom-right',
  },
  // Disable React Strict Mode in development
  reactStrictMode: false,
  // Disable the Next.js development toolbar
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Disable source maps in development
  productionBrowserSourceMaps: false,
  // Disable the Next.js development toolbar
  poweredByHeader: false,
  // Disable the Next.js development toolbar
  webpack: (config, { dev }) => {
    if (dev) {
      // Remove the ReactDevOverlay plugin
      const reactDevOverlayIndex = config.plugins.findIndex(
        (plugin) => plugin.constructor.name === 'ReactDevOverlay'
      );
      if (reactDevOverlayIndex !== -1) {
        config.plugins.splice(reactDevOverlayIndex, 1);
      }
    }
    return config;
  },
};

module.exports = nextConfig;
