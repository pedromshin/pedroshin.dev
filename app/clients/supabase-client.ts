import envs from "@App/envs";
import { createClient } from "@supabase/supabase-js";

export default createClient(
  envs.NEXT_PUBLIC_SUPABASE_URL,
  envs.SUPABASE_SERVICE_ROLE_KEY
);
