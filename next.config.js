/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {},
    optimizeCss: true,
    scrollRestoration: true,
    optimizePackageImports: ['lucide-react', 'date-fns'],
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
  // Set the root directory for file tracing
  outputFileTracingRoot: __dirname,
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  // Disable the powered by header
  poweredByHeader: false,
  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (process.env.NODE_ENV === 'development') {
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
        hostname: 'rabaul-admin.kesug.com',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    dangerouslyAllowSVG: false,
    qualities: [75, 80, 85, 90, 95, 100], // Added all required quality values
  },
  // Configure page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Enable compression in production
  compress: process.env.NODE_ENV === 'production',
  // Enable static HTML export
  trailingSlash: true,
  // Headers configuration
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      },
      // Specific cache headers for images
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          }
        ]
      }
    ];
  },
  // Environment variables
  env: {
    NEXT_PUBLIC_WORDPRESS_URL: process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://rabaul-admin.kesug.com',
  },
  // External packages
  serverExternalPackages: ['sharp', 'onnxruntime-node'],
};

module.exports = nextConfig;