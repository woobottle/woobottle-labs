/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  output: 'export',
  images: {
    domains: [],
  },

};

module.exports = nextConfig;