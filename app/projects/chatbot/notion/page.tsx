"use client";
import PageChatbot from "@App/components/templates/PageChatbot";
import { useChat } from "ai/react";
import Input from "@App/components/atoms/Input";
import Button from "@App/components/atoms/Button";
import ExternalLink from "@App/components/atoms/ExternalLink";
import { IconRotate } from "@tabler/icons-react";

export default () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });

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
        <Button onClick={() => null}>
          Generate word embeddings from Notion page and update vector database
          <IconRotate />
        </Button>
      </div>
      <></>
    </PageChatbot>
  );
};
