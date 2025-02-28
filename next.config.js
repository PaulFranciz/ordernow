/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
  }
}

module.exports = nextConfig 