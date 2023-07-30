import { useSession } from "next-auth/react";
import { PageMain } from "./PageMain";
import { PageLogin } from "./PageLogin";

const Home = () => {
  const { data: session } = useSession();

  return session ? <PageMain /> : <PageLogin />;
};

export default Home;
