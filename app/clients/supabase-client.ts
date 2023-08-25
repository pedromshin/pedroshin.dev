import envs from "@App/envs";
import { createClient } from "@supabase/supabase-js";

export default createClient(
  "https://ogbalfqgztvgpcchgcjz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nYmFsZnFnenR2Z3BjY2hnY2p6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4OTg4ODA4NSwiZXhwIjoyMDA1NDY0MDg1fQ.zLSaam2mH1X2s4I5lCDIegrAbNDWrJIEPfUoAItXAMY"
);

// export default createClient(
//   envs.NEXT_PUBLIC_SUPABASE_URL,
//   envs.SUPABASE_SERVICE_ROLE_KEY
// );
