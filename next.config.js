/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed: output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
