import envs from "@App/envs";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const GITHUB_ID = envs.GITHUB_ID;
const GITHUB_SECRET = envs.GITHUB_SECRET;

const authOptions = {
  providers: [
    GithubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: envs.GOOGLE_ID,
      clientSecret: envs.GOOGLE_SECRET,
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
