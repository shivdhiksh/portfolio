"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import IntroSphere from "@/components/ui/IntroSphere";

const BOOT_MS = 1900;
const HOLD_MS = 1100;
const CHAR_MS = 30;

const LINES = [
  "Hi, I'm Spidy.",
  "An autonomous assistant developed by Shiva Dhikshith.",
  "I'm here to assist you. Let's get started.",
];
const FULL = LINES.join("\n");

const STATUS = ["NEURAL CORE ONLINE", "WEB MESH SYNCED", "AGENT READY"];

const ringBase = { position: "absolute", inset: 0, width: "100%", height: "100%" } as const;

function Rings() {
  return (
    <div style={{ position: "absolute", inset: 0 }} aria-hidden>
      <svg viewBox="0 0 560 560" style={{ ...ringBase, animation: "spin-slow 60s linear infinite" }}>
        <circle cx="280" cy="280" r="270" fill="none" stroke="rgba(34,211,238,0.85)" strokeWidth="9" strokeDasharray="1.5 15.3" />
      </svg>
      <svg viewBox="0 0 560 560" style={{ ...ringBase, animation: "spin-slow 40s linear infinite reverse" }}>
        <circle cx="280" cy="280" r="244" fill="none" stroke="rgba(34,211,238,0.6)" strokeWidth="3" strokeDasharray="1 7" />
        <circle cx="280" cy="280" r="258" fill="none" stroke="rgba(34,211,238,0.4)" strokeWidth="1" strokeDasharray="2 10" />
      </svg>
      <svg viewBox="0 0 560 560" style={{ ...ringBase, animation: "spin-slow 24s linear infinite" }}>
        <circle cx="280" cy="280" r="214" fill="none" stroke="rgba(34,211,238,0.95)" strokeWidth="2" strokeDasharray="38 56 12 70 24 88" />
      </svg>
      <svg viewBox="0 0 560 560" style={{ ...ringBase, animation: "spin-slow 32s linear infinite reverse" }}>
        <circle cx="280" cy="280" r="196" fill="none" stroke="rgba(239,35,60,0.45)" strokeWidth="1.5" strokeDasharray="60 120 20 150" />
      </svg>
    </div>
  );
}

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [chars, setChars] = useState(0);
  const [statusShown, setStatusShown] = useState(0);
  const [reduce] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  // Tell the assistant it can take over once the intro is gone.
  useEffect(() => {
    if (isLoading) return;
    document.documentElement.dataset.spidyReady = "1";
    window.dispatchEvent(new Event("spidy:ready"));
  }, [isLoading]);

  // Hold the page still while the intro plays.
  useEffect(() => {
    if (!isLoading) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isLoading]);

  // Boot, type the greeting, hold, then reveal the site.
  useEffect(() => {
    const boot = reduce ? 300 : BOOT_MS;
    let typer: ReturnType<typeof setInterval> | undefined;
    let exit: ReturnType<typeof setTimeout> | undefined;

    const startTyping = setTimeout(() => {
      typer = setInterval(() => {
        setChars((c) => {
          if (c >= FULL.length) {
            clearInterval(typer);
            exit = setTimeout(() => setIsLoading(false), reduce ? 400 : HOLD_MS);
            return c;
          }
          return c + 1;
        });
      }, reduce ? 4 : CHAR_MS);
    }, boot);

    const status = [0, 1, 2].map((i) => setTimeout(() => setStatusShown(i + 1), 500 + i * 450));

    return () => {
      clearTimeout(startTyping);
      status.forEach(clearTimeout);
      if (typer) clearInterval(typer);
      if (exit) clearTimeout(exit);
    };
  }, [reduce]);

  const typed = FULL.slice(0, chars).split("\n");
  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    .toUpperCase();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="loading-screen"
          role="dialog"
          aria-label="Spidy welcome"
          exit={{ opacity: 0, scale: 1.12, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          style={{ background: "#02040a", zIndex: 9999, flexDirection: "column", overflow: "hidden" }}
        >
          <div className="intro-grid" aria-hidden />

          <div
            suppressHydrationWarning
            style={{
              position: "absolute",
              top: "1.1rem",
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.22em",
              color: "rgba(34,211,238,0.75)",
            }}
          >
            {today}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "relative", width: "min(560px, 88vw, 58vh)", aspectRatio: "1", display: "grid", placeItems: "center" }}
          >
            <Rings />
            <div>
              <IntroSphere size={400} />
            </div>
          </motion.div>

          <div
            aria-live="polite"
            style={{ marginTop: "-1.5rem", textAlign: "center", minHeight: "6.5rem", padding: "0 1.25rem", maxWidth: 640 }}
          >
            {chars === 0 ? (
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.2em", color: "rgba(34,211,238,0.8)" }}>
                INITIALIZING SPIDY…
              </p>
            ) : (
              typed.map((line, i) => (
                <p
                  key={i}
                  style={
                    i === 0
                      ? {
                          fontSize: "clamp(1.6rem, 5vw, 2.4rem)",
                          fontWeight: 800,
                          background: "linear-gradient(90deg, #22d3ee, #ffffff 60%, #ef233c)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          minHeight: "1.3em",
                        }
                      : {
                          fontFamily: "var(--font-mono)",
                          fontSize: "clamp(0.78rem, 2.2vw, 0.95rem)",
                          color: "rgba(226,240,255,0.85)",
                          lineHeight: 1.7,
                        }
                  }
                >
                  {line}
                  {i === typed.length - 1 && chars < FULL.length && <span className="spidy-caret" />}
                </p>
              ))
            )}
          </div>

          <div
            style={{
              position: "absolute",
              bottom: "1.3rem",
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              gap: "1.5rem",
              flexWrap: "wrap",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.18em",
              color: "rgba(34,211,238,0.7)",
            }}
          >
            {STATUS.slice(0, statusShown).map((s) => (
              <motion.span key={s} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                ● {s}
              </motion.span>
            ))}
          </div>

          <button
            onClick={() => setIsLoading(false)}
            className="spidy-btn"
            style={{ position: "absolute", top: "0.9rem", right: "1rem" }}
          >
            SKIP
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
