/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GITHUB_ID: process.env.GITHUB_ID,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    // aws envs
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    // chatbot envs
    OPEN_AI_KEY: process.env.OPEN_AI_KEY,
    NOTION_API_KEY: process.env.NOTION_API_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    // other envs
    PORT: process.env.PORT,
    DEV: process.env.DEV,
    PROD: process.env.PROD,
    DEV_URL: process.env.DEV_URL,
    PROD_URL: process.env.PROD_URL,
  },
};

module.exports = nextConfig;
