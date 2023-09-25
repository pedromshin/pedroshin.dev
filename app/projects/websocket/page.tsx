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
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const socket = io("https://finance.pedroshin.dev");

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

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth - 80);
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Heading title={"Websocket"} description="">
      <div className="w-full mt-8 px-2 md:px-[12px]">
        <LineChart
          width={width}
          height={300}
          data={data.map((dataPoint) => ({
            x: dataPoint.timestamp,
            y: dataPoint.price,
          }))}
          margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis domain={["dataMin - 5", "dataMax + 5"]} />
          {/* <Tooltip /> */}
          <Legend />
          <Line
            dataKey="y"
            name="Real-time Bitcoin price (USD)"
            type="monotone"
            stroke="#8884d8"
            isAnimationActive={false}
            dot={false}
          />
        </LineChart>
      </div>
    </Heading>
  );
};
