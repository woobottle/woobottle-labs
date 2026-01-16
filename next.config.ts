/** @type {import('next').NextConfig} */

// 배포 시 DEPLOYMENT_TAG 환경변수로 버전 경로 설정
// CloudFront /releases/* Behavior가 Origin Path 없이 S3 직접 접근
const deploymentTag = process.env.DEPLOYMENT_TAG || "";
const assetPrefix = deploymentTag ? `/releases/${deploymentTag}` : "";

const nextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  output: "export", // Static export for S3 deployment
  trailingSlash: true,
  assetPrefix: assetPrefix,
  basePath: assetPrefix,
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
