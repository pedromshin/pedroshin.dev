import { useState } from "react";
import { useChat } from "ai/react";

const Chatbot = () => {
  const { messages, handleSubmit, input } = useChat({ api: "/api/chat" });

  return (
    <div>
      {messages.map((message) => {
        return (
          <span key={message.id}>
            {message.role} says... {message.content}
          </span>
        );
      })}

      <form onSubmit={handleSubmit}>
        <input />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chatbot;
