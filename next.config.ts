import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:8080'],
    },
  },
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: 'http://gateway-service:8080/images/:path*',
      },
    ]
  },
}

export default nextConfig
