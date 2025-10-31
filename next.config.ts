import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    globalNotFound: true,
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
}

export default nextConfig
