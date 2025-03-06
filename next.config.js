/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['res.cloudinary.com', 'placehold.co', 'hogis-ordernow.netlify.app'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'hogis-ordernow.netlify.app'],
    },
  },
  output: 'standalone',
  // Ensure clean builds
  cleanDistDir: true,
  // Disable caching during builds
  generateBuildId: async () => {
    return `build-${Date.now()}`
  }
};

module.exports = nextConfig;