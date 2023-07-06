// pages/chat.js
import { useChat } from "ai/react";
import React from "react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div>
      <div>
        {messages.map((m) => (
          <div key={m.id}>
            <span>{m.role}:</span>
            <span>{m.content}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
