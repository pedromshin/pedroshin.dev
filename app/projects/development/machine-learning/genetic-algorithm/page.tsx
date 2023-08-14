"use client";
import { useState, useRef, useEffect } from "react";
import Heading from "@App/components/organisms/Heading";

export default () => {
  const [height, setHeight] = useState<string>();

  useEffect(() => {
    !height && setHeight(window.innerHeight - 100 + "px");
  }, []);

  return (
    <>
      <Heading title="Genetic Algorithm">
        <></>
        <iframe
          height={height}
          src="https://python.pedroshin.dev/retro/notebooks/?path=notebooks/genetic-algorithm/genetic-algorithm.ipynb"
          width="100%"
          className="max-w-[960px] mx-auto"
        ></iframe>
      </Heading>
    </>
  );
};
