"use client";
import { useEffect, useState } from "react";
import { SECTIONS, getSceneProgress } from "@/lib/sections";

/** Index into SECTIONS of the section currently crossing the middle of the viewport. */
export function useActiveSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const next = Math.min(SECTIONS.length - 1, Math.floor(getSceneProgress()));
      setIndex((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return index;
}
