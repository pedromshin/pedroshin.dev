import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import _ from "lodash-es";
import envs from "@App/envs";

const aiConfig = new Configuration({
  apiKey: envs.OPEN_AI_KEY,
});

const openAI = new OpenAIApi(aiConfig);

export async function POST(req: Request, res: Response) {
  const { messages } = await req.json();

  messages.push({
    role: "system",
    content: "",
  });

  const response = await openAI.createChatCompletion({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: messages,
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
