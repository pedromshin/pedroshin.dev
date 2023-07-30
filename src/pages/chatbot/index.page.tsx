// pages/chat.js
import { PageContainer } from "@/components/PageContainer";
import { useChat } from "ai/react";
import React from "react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });

  const containerStyle = {
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f9f9f9", // Light gray background color
  };

  const messageStyle = {
    marginBottom: "10px",
    padding: "10px",
    borderRadius: "5px",
  };

  const roleStyle = {
    fontWeight: "bold",
    marginRight: "5px",
    color: "#007bff", // Blue color for role text
  };

  const formStyle = {
    marginTop: "20px",
  };

  const inputStyle = {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "100%",
    outline: "none",
  };

  return (
    <PageContainer>
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
            style={inputStyle}
          />
        </form>
      </div>
    </PageContainer>
  );
}
