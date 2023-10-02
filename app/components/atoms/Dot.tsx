import React from "react";

export type DotProps = {
  variant: "green" | "info" | "error";
};

const Dot = ({ variant }: DotProps) => {
  let backgroundColorClass;

  switch (variant) {
    case "green":
      backgroundColorClass = "bg-green-500";
      break;
    case "info":
      backgroundColorClass = "bg-blue-500";
      break;
    case "error":
      backgroundColorClass = "bg-yellow-500";
      break;
    default:
      backgroundColorClass = "bg-gray-500";
  }

  return <span className={`w-4 h-4 rounded-full ${backgroundColorClass}`} />;
};

export default Dot;
