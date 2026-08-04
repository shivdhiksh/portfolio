"use client";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle theme"
      style={{
        position: "relative",
        width: 52,
        height: 28,
        borderRadius: 14,
        background: theme === "dark"
          ? "rgba(59,130,246,0.2)"
          : "rgba(251,191,36,0.2)",
        border: `1px solid ${theme === "dark" ? "rgba(59,130,246,0.4)" : "rgba(251,191,36,0.4)"}`,
        display: "flex",
        alignItems: "center",
        padding: "0 4px",
        transition: "background 0.3s, border-color 0.3s",
        overflow: "hidden",
      }}
    >
      <motion.div
        animate={{ x: theme === "dark" ? 0 : 24 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: theme === "dark"
            ? "linear-gradient(135deg, #3b82f6, #8b5cf6)"
            : "linear-gradient(135deg, #f59e0b, #ef4444)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: theme === "dark"
            ? "0 0 10px rgba(59,130,246,0.5)"
            : "0 0 10px rgba(251,191,36,0.5)",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {theme === "dark" ? (
              <Moon size={10} color="white" />
            ) : (
              <Sun size={10} color="white" />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
}
