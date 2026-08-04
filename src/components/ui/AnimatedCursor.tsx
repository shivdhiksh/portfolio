"use client";
import { useRef } from "react";
import { useMousePosition } from "@/hooks/useMousePosition";
import { motion } from "framer-motion";

export default function AnimatedCursor() {
  const mousePosition = useMousePosition();
  const dotRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="cursor-ring"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 18, mass: 0.5 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1.5px solid rgba(59,130,246,0.6)",
          pointerEvents: "none",
          zIndex: 99999,
          mixBlendMode: "difference",
        }}
      />
      {/* Inner dot */}
      <motion.div
        ref={dotRef}
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))",
          pointerEvents: "none",
          zIndex: 99999,
          boxShadow: "0 0 10px rgba(59,130,246,0.8)",
        }}
      />
    </>
  );
}
