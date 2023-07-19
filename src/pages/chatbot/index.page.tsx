// pages/chat.js
import { useChat } from "ai/react";
import React from "react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  const containerStyle = {
    width: "400px",
    margin: "0 auto",
    padding: "20px",
  };

  const messageStyle = {
    marginBottom: "10px",
    padding: "5px",
    borderRadius: "5px",
  };

  const roleStyle = {
    fontWeight: "bold",
    marginRight: "5px",
  };

  const formStyle = {
    marginTop: "20px",
  };

  return (
    <div style={containerStyle}>
      <div>
        {messages?.map((m) => (
          <div key={m?.id} style={messageStyle}>
            <span style={roleStyle}>{m?.role}:</span>
            <span>{m?.content}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            width: "100%",
            outline: "none",
          }}
        />
      </form>
    </div>
  );
}
