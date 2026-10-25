"use client";
import { useEffect, useState } from "react";

/** True once the visitor has tapped through the Spidy intro. */
export function useEntered() {
  const [entered, setEntered] = useState(
    () => typeof document !== "undefined" && document.documentElement.dataset.spidyReady === "1"
  );

  useEffect(() => {
    const onReady = () => setEntered(true);
    window.addEventListener("spidy:ready", onReady);
    return () => window.removeEventListener("spidy:ready", onReady);
  }, []);

  return entered;
}
