import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dummyimage.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos'
      },
      {
        protocol: 'https',
        hostname: 'placekitten.com'
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: 'http://api-service:8000/images/:path*',
      },
    ];
  },
}

export default nextConfig
