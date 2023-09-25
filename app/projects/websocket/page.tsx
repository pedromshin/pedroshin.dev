"use client";
import { useEffect } from "react";
import Heading from "@App/components/organisms/Heading";
import io from "socket.io-client";

export default () => {
  useEffect(() => {
    const socket = io(
      "http://flask-env.eba-rbgeum2r.sa-east-1.elasticbeanstalk.com/"
    );

    // Send a message to the server
    socket.emit("message_from_frontend", "Hello from React!");

    // Listen for messages from the server
    socket.on("response_to_frontend", (data) => {
      console.log("Received from server:", data);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Heading title={"Websocket"} description="">
      <div className="flex flex-col gap-4 w-full mt-8 pb-[85px] px-[12px]">
        <>hello</>
      </div>
    </Heading>
  );
};
