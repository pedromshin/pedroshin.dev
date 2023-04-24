/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  },
  async rewrites() {
    return [
      {
        source: "/model1",
        destination: "http://127.0.0.1:5000/model1",
      },
    ];
  },
};

module.exports = nextConfig;
