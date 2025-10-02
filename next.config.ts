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
        destination: `${process.env.GATEWAY_URL}/images/:path*`,
      },
    ]
  },
}

export default nextConfig
