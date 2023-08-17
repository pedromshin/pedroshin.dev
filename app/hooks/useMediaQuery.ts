"use client";
import { useEffect, useState } from "react";

export default (query: string): boolean | string => {
  if (typeof window === "undefined") return " ";

  const getMatches = (query: string): boolean => {
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  function handleChange() {
    setMatches(getMatches(query));
  }

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    handleChange();

    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else {
      matchMedia.addEventListener("change", handleChange);
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else {
        matchMedia.removeEventListener("change", handleChange);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return matches;
};
