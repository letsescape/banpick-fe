/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: 'build',
  env: {
    APP_API_URL: process.env.APP_API_URL,
    PUSHER_APP_KEY: process.env.PUSHER_APP_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tailwindui.com',
      },
    ],
  },
};

module.exports = nextConfig;
