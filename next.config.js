/** @type {import('next').NextConfig} */
const nextConfig = {

  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    unoptimized: true, 
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/djx3im1eb/image/upload/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  
  async rewrites() {
    return [
      {
        source: '/auth/callback',
        destination: '/api/auth/callback', // Ensure this points to the actual API route
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/api/auth/callback',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Replace with your actual frontend domain
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Authorization, Content-Type',
          },
        ],
      },
    ];
  },

  serverRuntimeConfig: {
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    },
  },
};

module.exports = nextConfig;
