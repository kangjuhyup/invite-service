/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  basePath: `/${process.env.NEXT_PUBLIC_BASE_PATH}`,
  // output: 'standalone',
  // reactStricMode: false,
  assetPrefix: `/${process.env.NEXT_PUBLIC_BASE_PATH}`,
  publicRuntimeConfig: {
    basePath: `/${process.env.NEXT_PUBLIC_BASE_PATH}`,
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/page/api/:path*',
          destination: '/api/:path*',
        },
      ],
    };
  },
};

module.exports = nextConfig;
