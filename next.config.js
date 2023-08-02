/** @type {import('next').NextConfig} */
const nextConfig = {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  GITHUB_ID: process.env.GITHUB_ID,
  GITHUB_SECRET: process.env.GITHUB_SECRET,
};

module.exports = nextConfig;
