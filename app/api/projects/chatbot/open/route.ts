import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import envs from "@Envs";

const aiConfig = new Configuration({
  apiKey: envs.OPEN_AI_KEY,
});

const openAI = new OpenAIApi(aiConfig);

export async function POST(req: Request, res: Response) {
  const { query } = await req.json();

  const response = await openAI.createChatCompletion({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [{ content: query, role: "user" }],
  });

  const stream = OpenAIStream(response);

  return new Response(stream);
}
