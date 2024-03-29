import envs from "@Envs";
import { Configuration, OpenAIApi } from "openai-edge";

const configuration = new Configuration({
  apiKey: envs.OPEN_AI_KEY,
});

export default new OpenAIApi(configuration);
