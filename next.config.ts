import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  crossOrigin: 'anonymous',
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
