import { PageContainer } from "@/components/PageContainer";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth].route";
import { envs } from "@/envs";

export const Private = () => {
  return <PageContainer>Private</PageContainer>;
};

export default Private;

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session && session?.user?.email === envs.ADMIN_EMAIL) {
    return {
      props: {
        session,
      },
    };
  }

  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
}
