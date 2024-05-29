/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: 'build',
  env: {
    APP_API_URL: process.env.APP_API_URL,
    PUSHER_APP_KEY: process.env.PUSHER_APP_KEY,
    REVERB_APP_KEY: process.env.REVERB_APP_KEY,
    REVERB_HOST: process.env.REVERB_HOST,
    REVERB_PORT: process.env.REVERB_PORT,
    REVERB_SCHEME: process.env.REVERB_SCHEME,
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
