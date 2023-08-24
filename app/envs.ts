export default {
  // auth envs
  GITHUB_ID: process.env.GITHUB_ID as string,
  GITHUB_SECRET: process.env.GITHUB_SECRET as string,
  GOOGLE_ID: process.env.GOOGLE_ID as string,
  GOOGLE_SECRET: process.env.GOOGLE_SECRET as string,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL as string,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  // aws envs
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID as string,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY as string,
  // chatbot envs
  OPEN_AI_KEY: process.env.OPEN_AI_KEY as string,
  // other envs
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  NOTION_API_KEY: process.env.NOTION_API_KEY,
  PORT: process.env.PORT,
  DEV: process.env.DEV,
  PROD: process.env.PROD,
  DEV_URL: process.env.DEV_URL,
  PROD_URL: process.env.PROD_URL,
};
