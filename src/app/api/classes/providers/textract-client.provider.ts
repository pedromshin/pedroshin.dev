import envs from "@Src/envs";
import { TextractClient } from "@aws-sdk/client-textract";

export default new TextractClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: envs.AWS_ACCESS_KEY_ID,
    secretAccessKey: envs.AWS_SECRET_ACCESS_KEY,
  },
});
