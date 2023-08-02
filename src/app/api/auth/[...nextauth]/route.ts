import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

const GITHUB_ID = process.env.GITHUB_ID as string;
const GITHUB_SECRET = process.env.GITHUB_SECRET as string;

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
