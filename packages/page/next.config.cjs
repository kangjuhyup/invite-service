/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  basePath: '/page',
  // output: 'standalone',
  // reactStricMode: false,
  assetPrefix: '/page',
  publicRuntimeConfig: {
    basePath: '/page',
  },
  async rewrites() {
    return [
      {
        source: '/page/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
