import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: 'http://gateway-service/images/:path*',
      },
    ]
  },
}

export default nextConfig
