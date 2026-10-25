"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ChapterProps {
  number: string;
  label: string;
  children: React.ReactNode;
}

/** Wraps a section with an outlined chapter numeral that drifts at its own speed as you scroll. */
export default function Chapter({ number, label, children }: ChapterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [160, -160]);
  const x = useTransform(scrollYProgress, [0, 0.5, 1], [60, 0, -60]);

  return (
    <div ref={ref} style={{ position: "relative", isolation: "isolate", overflowX: "clip" }}>
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: "3rem",
          right: "2%",
          zIndex: -1,
          x,
          y,
          fontSize: "clamp(9rem, 24vw, 22rem)",
          fontWeight: 900,
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: "1.5px rgba(34,211,238,0.2)",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {number}
      </motion.div>
      <div className="chapter-label" aria-hidden>
        <span>CH.{number}</span>
        <span>{"//"}</span>
        <span>{label}</span>
      </div>
      {children}
    </div>
  );
}
