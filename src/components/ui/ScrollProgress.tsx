"use client";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { motion } from "framer-motion";

export default function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: `linear-gradient(90deg, var(--accent-blue), var(--accent-purple), var(--accent-cyan))`,
        transformOrigin: "0%",
        scaleX: progress / 100,
        zIndex: 9999,
        boxShadow: "0 0 10px rgba(59,130,246,0.5)",
      }}
      initial={{ scaleX: 0 }}
    />
  );
}
