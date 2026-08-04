"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 300);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="loading-screen"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] }}
          style={{ background: "var(--bg-primary)", zIndex: 9999 }}
        >
          <div className="flex flex-col items-center gap-8">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
              className="relative"
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 20,
                  background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 40px rgba(59,130,246,0.5)",
                  fontSize: 28,
                  fontWeight: 900,
                  color: "white",
                  letterSpacing: "-1px",
                  fontFamily: "var(--font-inter)",
                }}
              >
                SDK
              </div>
              {/* Spinning ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute",
                  inset: -4,
                  borderRadius: 24,
                  border: "2px solid transparent",
                  borderTopColor: "var(--accent-cyan)",
                  borderRightColor: "var(--accent-purple)",
                }}
              />
            </motion.div>

            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-center"
            >
              <p
                style={{
                  color: "var(--text-primary)",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                }}
              >
                SHIVA DHIKSHITH KOPPU
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: 4, letterSpacing: "0.05em" }}>
                Loading portfolio...
              </p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 240 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              style={{
                height: 3,
                background: "var(--bg-tertiary)",
                borderRadius: 9999,
                overflow: "hidden",
              }}
            >
              <motion.div
                style={{
                  height: "100%",
                  width: `${Math.min(progress, 100)}%`,
                  background: "linear-gradient(90deg, var(--accent-blue), var(--accent-purple), var(--accent-cyan))",
                  borderRadius: 9999,
                  transition: "width 0.1s ease",
                }}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}
            >
              {Math.round(Math.min(progress, 100))}%
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
