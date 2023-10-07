"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Heading from "@App/components/organisms/Heading";
import io from "socket.io-client";
import ChatInput from "@App/components/atoms/ChatInput";

export default () => {
  const [typing, setTyping] = useState<string>();
  const [typingUsername, setTypingUsername] = useState<string>();
  const [username, setUsername] = useState<string>();
  const [messages, setMessages] = useState<
    { message: string; username: string }[]
  >([]);
  const [connections, setConnections] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleChat = async () => {
    if (!typing) return;
    setTyping("");

    socket.emit("new_message", { message: typing, username });
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
      setMessages((prev) => [...prev, data]);
    });

    socket.on("connections_update", (data) => {
      console.log("Received from server:", data);
      setConnections(data.connections);
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
      if (message.username === username) {
        return (
          <div
            key={index}
            className="border border-zinc-600 rounded-lg p-4 text-right w-fit"
          >
            <div className="">
              <b>{message.username}:</b> {message.message}
            </div>
          </div>
        );
      } else {
        return (
          <div
            key={index}
            className="border border-zinc-600 rounded-lg p-4 text-left w-fit ml-auto"
          >
            <div className="">
              <b>{message.username}:</b> {message.message}
            </div>
          </div>
        );
      }
    });
  };

  return (
    <>
      <Heading
        title={"Talk room in websocket"}
        description="Websocket calling API on https://talk.pedroshin.dev for real-time messaging"
        // TODO fix min height calc
        className="min-h-[calc(100% + 75px)]"
      />
      <>
        {username ? (
          <>
            <h1 className="p-12">
              Welcome, {username}! There are {connections - 1} other users
              online.
            </h1>
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
          </>
        ) : (
          <>
            <div className="flex flex-col gap-4 w-full mt-8 p-12">
              <div className="border border-zinc-600 rounded-lg p-">
                <div className="text-center">
                  <div className="text-2xl font-bold">Welcome to Talk</div>
                  <div className="text-lg">
                    Please enter your name to join the chat
                  </div>
                </div>
              </div>
            </div>
            <ChatInput
              onChange={(e) => {
                setTypingUsername(e.target.value);
              }}
              onSubmit={() => {
                setTypingUsername("");
                setUsername(typingUsername);
                socket.emit("new_user", { username });
              }}
              placeholder="Enter your name..."
              value={typingUsername}
            />
          </>
        )}
      </>
    </>
  );
};
