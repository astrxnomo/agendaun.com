import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    globalNotFound: true,
    turbopackFileSystemCacheForDev: true,
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
}

export default nextConfig
