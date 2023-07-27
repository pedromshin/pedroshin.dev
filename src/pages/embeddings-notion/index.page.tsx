import endent from "endent";
import {
  IconArrowRight,
  IconExternalLink,
  IconSearch,
} from "@tabler/icons-react";
import { useRef, useState } from "react";
import { Chunk } from "../../../scripts/embeddings-notion/embed";
import { Answer } from "./Answer/Answer";
import { set } from "lodash";
import { supabaseAdmin } from "./utils/embeddings";

const apiKey = process.env.OPEN_AI_KEY;

const NotionEmbeddingPage = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState<string>("");
  const [chunks, setChunks] = useState<({ similarity: number } & Chunk)[]>();
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [updates, setUpdates] = useState<string[]>();

  const handleAnswer = async () => {
    if (!query) {
      alert("Please enter a query.");
      return;
    }

    setAnswer("");
    setChunks([]);

    setLoading(true);

    const searchResponse = await fetch("/api/notion/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, apiKey }),
    });

    if (!searchResponse.ok) {
      setLoading(false);
      throw new Error(searchResponse.statusText);
    }

    const results: any[] = await searchResponse.json();

    setChunks(results);

    const prompt = endent`
    Use the following passages to provide an answer to the query: "${query}"

    ${results?.map((d: any) => d.content).join("\n\n")}
    `;

    const answerResponse = await fetch("/api/notion/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, apiKey }),
    });

    if (!answerResponse.ok) {
      setLoading(false);
      throw new Error(answerResponse.statusText);
    }

    const data = answerResponse.body;

    if (!data) {
      return;
    }

    setLoading(false);

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setAnswer((prev) => prev + chunkValue);
    }

    inputRef.current?.focus();
  };

  console.log(updates);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto border-red-300">
        <div className="mx-auto flex h-full w-full max-w-[750px] flex-col items-center px-3 pt-4 sm:pt-8">
          <div className="relative w-full mt-4">
            <IconSearch className="absolute top-3 w-10 left-1 h-6 rounded-full opacity-50 sm:left-3 sm:top-4 sm:h-8" />
            <input
              ref={inputRef}
              className="h-12 w-full rounded-full border border-zinc-600 pr-12 pl-11 focus:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-800 sm:h-16 sm:py-2 sm:pr-16 sm:pl-16 sm:text-lg"
              type="text"
              placeholder="Notion embeddings test"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button>
              <IconArrowRight
                onClick={handleAnswer}
                className="absolute right-2 top-2.5 h-7 w-7 rounded-full bg-blue-500 p-1 hover:cursor-pointer hover:bg-blue-600 sm:right-3 sm:top-3 sm:h-10 sm:w-10 text-white"
              />
            </button>
          </div>
          <div className="flex gap-24 relative w-full mt-4">
            <div className="max-h-200 overflow-y-auto">
              <button
                className="mt-4 border border-zinc-600 rounded-lg p-4 max-w-[300px]"
                onClick={async () => {
                  setUpdates(undefined);
                  const deleteResult = await supabaseAdmin
                    .from("notion_embeddings")
                    .delete()
                    .neq("content", 0);

                  console.log("delete table", deleteResult);

                  try {
                    const scrapeResults = await fetch("/api/notion/scrape", {
                      method: "GET",
                    }).then((res) => res.json());

                    for (let i = 0; i < scrapeResults.length; i++) {
                      const section = scrapeResults[i];
                      for (let j = 0; j < section.chunks.length; j++) {
                        const chunk = section.chunks[j];
                        const embedResults = await fetch("/api/notion/embed", {
                          headers: {
                            "Content-Type": "application/json",
                          },
                          method: "POST",
                          body: JSON.stringify({ text: chunk }),
                        });

                        setUpdates((prev) => [
                          ...(prev ?? [""]),
                          `Successfully saved embedding of section ${j + 1}/${
                            section.chunks.length
                          } of chunk ${i + 1}/${scrapeResults.length}`,
                        ]);
                      }
                    }
                  } catch (error) {
                    console.error("Error occurred:", error);
                  }
                }}
              >
                <div className="font-bold text-2sm mb-2">
                  Atualizar banco de dados estado atual da página do notion
                </div>
              </button>
            </div>
            {updates && (
              <div className="mt-4 border border-zinc-600 rounded-lg p-4 max-w-[300px] max-h-[200px] overflow-y-auto">
                <div className="font-bold text-2sm mb-2">Updates</div>
                {updates.map((update, index) => (
                  <div key={index}>{update}</div>
                ))}
              </div>
            )}
          </div>
          {updates && (
            <button onClick={() => setUpdates(undefined)}>Limpar</button>
          )}
          <div className="mt-6 mb-16 text-left w-full">
            <div className="font-bold text-2xl mb-2">Answer</div>
            <Answer text={answer} />
            <div className="font-bold text-2xl">Textos do notion</div>
            {chunks?.map((chunk, index) => (
              <div key={index}>
                <div className="mt-4 border border-zinc-600 rounded-lg p-4">
                  <div className="mt-2">{chunk.content}</div>
                  <div className="mt-2">Similaridade: {chunk.similarity}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotionEmbeddingPage;
