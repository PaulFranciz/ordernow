/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['res.cloudinary.com', 'placehold.co'],
  },
  
  // Add ESLint config
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

  // Add TypeScript config
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },

  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'hogis-ordernow.netlify.app'],
    },
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
      {
        source: '/auth/:path*',
        destination: '/auth/:path*',
      },
    ]
  },
};

// Add error handling for the config
try {
  module.exports = nextConfig
} catch (error) {
  console.error('Error in next.config.js:', error)
  process.exit(1)
}
