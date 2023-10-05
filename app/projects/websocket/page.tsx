"use client";
import { useEffect, useState } from "react";
import Heading from "@App/components/organisms/Heading";
import Dot from "@App/components/atoms/Dot";
import io from "socket.io-client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import Button from "@App/components/atoms/Button";

export default () => {
  const [data, setData] = useState<
    { price: string | undefined; timestamp: string }[]
  >([]);
  const [streaming, setStreaming] = useState(true);
  const [width, setWidth] = useState(0);

  const socket = io(
    // "https://finance.pedroshin.dev"
    // "http://0.0.0.0:8000"
    "http://finance-pedroshin-dev.sa-east-1.elasticbeanstalk.com/"
  );

  useEffect(() => {
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
          price: data.price ? `${Number(data.price)?.toFixed(2)}` : undefined,
        },
      ]);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth - 80);
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Heading
      title={"Bitcoin real-time websocket"}
      description="Websocket calling API on https://finance.pedroshin.dev with real-time Bitcoin price in USD"
    >
      <div className="flex items-center gap-4">
        <Button
          onClick={() => {
            setStreaming((prev) => !prev);
            streaming
              ? socket.emit("control_streaming", "pause")
              : socket.emit("control_streaming", "stream");
          }}
        >
          {streaming ? "Pause" : "Stream"}
        </Button>
        <Dot variant={streaming ? "green" : "error"} />
      </div>
      <div className="w-full mt-8 px-2 md:px-[12px] [&>div]:overflow-visible [&>div>svg]:overflow-visible">
        <LineChart
          width={width}
          height={300}
          data={data.map((dataPoint) => ({
            x: dataPoint.timestamp,
            y: dataPoint.price,
          }))}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis type="number" domain={["dataMin - 5", "dataMax + 5"]} />
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
