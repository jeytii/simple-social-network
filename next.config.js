const { resolve } = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      pages: resolve(__dirname, 'pages/'),
      components: resolve(__dirname, 'components/'),
      hooks: resolve(__dirname, 'hooks/'),
      lib: resolve(__dirname, 'lib/'),
      types: resolve(__dirname, 'types/'),
    };

    return config;
  },
  images: {
    loader: 'cloudinary',
    path: process.env.IMAGE_LOADER_BASE_URL,
  },
};

module.exports = nextConfig;
