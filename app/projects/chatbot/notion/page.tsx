"use client";
import PageChatbot from "@App/components/templates/PageChatbot";
import { useChat } from "ai/react";
import Input from "@App/components/atoms/Input";
import Button from "@App/components/atoms/Button";
import ExternalLink from "@App/components/atoms/ExternalLink";
import { IconRotate } from "@tabler/icons-react";
import SupabaseClient from "@App/clients/supabase-client";

export default () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });

  const handleGenerate = async () => {
    try {
      await SupabaseClient.from("notion_embeddings").delete().neq("content", 0);
    } catch {}

    try {
      const scrape = await fetch("/api/projects/chatbot/notion/scrape", {
        method: "GET",
      }).then((res) => res.json());
    } catch {}
  };

  return (
    <PageChatbot
      input={input}
      title="Customized Chatbot"
      description=""
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-4">
        <Input placeholder="Insert system prompt:" />
        <ExternalLink
          label="Edit content on Notion page!"
          href="https://solar-fox-a61.notion.site/Flash-dataset-chatbot-90ae074d502a41be99096e6585838941"
        />
        <Button onClick={handleGenerate}>
          Generate word embeddings from Notion page and update vector database
          <IconRotate />
        </Button>
      </div>
      <></>
    </PageChatbot>
  );
};
