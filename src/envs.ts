export default {
  // auth envs
  GITHUB_ID: process.env.GITHUB_ID as string,
  GITHUB_SECRET: process.env.GITHUB_SECRET as string,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL as string,
  // other envs
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  OPEN_AI_KEY: process.env.OPEN_AI_KEY,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  NOTION_API_KEY: process.env.NOTION_API_KEY,
  PORT: process.env.PORT,
  DEV: process.env.DEV,
  PROD: process.env.PROD,
  DEV_URL: process.env.DEV_URL,
  PROD_URL: process.env.PROD_URL,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
};