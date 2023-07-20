/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    OPEN_AI_KEY: process.env.OPEN_AI_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  pageExtensions: ["page.tsx", "page.ts", "page.jsx", "page.js"],
  async rewrites() {
    return [
      {
        source: "/titanic",
        destination: "http://127.0.0.1:5000/titanic",
      },
    ];
  },
};

module.exports = nextConfig;
