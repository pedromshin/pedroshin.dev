"use client";
import { useEffect, useState } from "react";
import Heading from "@App/components/organisms/Heading";
import io from "socket.io-client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default () => {
  const [data, setData] = useState<{ price: string; timestamp: string }[]>([]);

  useEffect(() => {
    const socket = io(
      "http://flask-env.eba-rbgeum2r.sa-east-1.elasticbeanstalk.com/"
    );

    // Send a message to the server
    socket.emit("message_from_frontend", "Hello from React!");

    // Listen for messages from the server
    socket.on("response_to_frontend", (data) => {
      console.log("Received from server:", data);
      setData((prev) => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(["pt-br"], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          price: `${Number(data.price)?.toFixed(2)}`,
        },
      ]);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  // console.log(data);

  return (
    <Heading title={"Websocket"} description="">
      <div className="flex flex-col gap-4 w-full mt-8 pb-[85px] px-[12px]">
        <LineChart
          width={800}
          height={400}
          data={data.map((dataPoint) => ({
            x: dataPoint.timestamp,
            y: dataPoint.price,
          }))}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis domain={["dataMin - 5", "dataMax + 5"]} />
          <Tooltip />
          <Legend />
          <Line
            dataKey="y"
            name="Real-time Bitcoin price (USD)"
            type="monotone"
            stroke="#8884d8"
            isAnimationActive={false}
          />
        </LineChart>
      </div>
    </Heading>
  );
};
