/** @type {import('next').NextConfig} */

// CloudFront Origin Path가 버전 라우팅(/releases/deploy-xxx)을 처리하므로
// assetPrefix와 basePath는 설정하지 않음 (경로 중복 방지)

const nextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  output: "export", // Static export for S3 deployment
  trailingSlash: true,
  images: {
    domains: [],
    unoptimized: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
