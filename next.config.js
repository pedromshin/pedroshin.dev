/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    OPEN_AI_KEY: process.env.OPEN_AI_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NOTION_API_KEY: process.env.NOTION_API_KEY,
    GITHUB_ID: process.env.GITHUB_ID,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    PORT: process.env.PORT,
    DEV: process.env.DEV,
    PROD: process.env.PROD,
    DEV_URL: process.env.DEV_URL,
    PROD_URL: process.env.PROD_URL,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  },
  pageExtensions: [
    "page.tsx",
    "page.ts",
    "page.jsx",
    "page.js",
    "route.tsx",
    "route.ts",
    "route.jsx",
    "route.js",
  ],
};

module.exports = nextConfig;
