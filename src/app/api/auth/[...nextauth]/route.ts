import envs from "@Src/envs";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

const GITHUB_ID = envs.GITHUB_ID;
const GITHUB_SECRET = envs.GITHUB_SECRET;

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
    }),
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
