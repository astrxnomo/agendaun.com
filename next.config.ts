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
      bodySizeLimit: "5mb",
    },
  },
}

export default nextConfig
