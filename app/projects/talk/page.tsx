"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Heading from "@App/components/organisms/Heading";
import io from "socket.io-client";
import ChatInput from "@App/components/atoms/ChatInput";

export default () => {
  const [typing, setTyping] = useState<string>();
  const [messages, setMessages] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleChat = async () => {
    if (!typing) return;
    setTyping("");

    socket.emit("new_message", { message: typing });
  };

  const socket = useMemo(
    () =>
      io(
        "https://talk.pedroshin.dev"
        // "http://0.0.0.0:5000"
        // "http://0.0.0.0:8000"
        // "http://talk-pedroshin-dev.sa-east-1.elasticbeanstalk.com/"
      ),
    []
  );

  useEffect(() => {
    // Listen for messages from the server
    socket.on("response_to_frontend", (data) => {
      console.log("Received from server:", data);
      setMessages((prev) => [...prev, data.message]);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the messages container when new messages are added
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const renderMessages = () => {
    return messages?.map((message, index) => {
      return (
        <div key={index} className="border border-zinc-600 rounded-lg p-4">
          <div className="">{message}</div>
        </div>
      );
    });
  };

  return (
    <Heading
      title={"Talk room in websocket"}
      description="Websocket calling API on https://talk.pedroshin.dev for real-time messaging"
      // TODO fix min height calc
      className="min-h-[calc(100% + 75px)]"
    >
      <div
        ref={messagesEndRef}
        className="flex flex-col gap-4 w-full mt-8 pb-[85px] px-[12px]"
      >
        {renderMessages()}
      </div>
      <ChatInput
        onChange={(e) => {
          setTyping(e.target.value);
        }}
        onSubmit={handleChat}
        placeholder="Type a message..."
        value={typing}
      />
    </Heading>
  );
};
