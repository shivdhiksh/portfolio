"use client";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import IntroSphere from "@/components/ui/IntroSphere";

const BOOT_MS = 1900;
const CHAR_MS = 30;
// How long the hologram takes to spread away once the visitor taps to enter.
const SPREAD_MS = 1100;

const LINES = [
  "Hello, I'm SPIDY.",
  "An AI assistant developed by SHIVA DHIKSHITH.",
  "Designed to assist you.",
  "Let's get started.",
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
  const [entering, setEntering] = useState(false);
  const [chars, setChars] = useState(0);
  const [statusShown, setStatusShown] = useState(0);
  const [reduce] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const done = chars >= FULL.length;

  // The intro waits for the visitor. Any tap, click or Enter/Space/Esc lets the hologram spread away and hands over to the site.
  const enter = useCallback(() => {
    if (entering) return;
    setEntering(true);
    const spread = reduce ? 200 : SPREAD_MS;
    // The site (and Spidy's greeting) starts as the hologram thins out, not after it's gone.
    window.setTimeout(() => {
      document.documentElement.dataset.spidyReady = "1";
      window.dispatchEvent(new Event("spidy:ready"));
    }, spread * 0.45);
    window.setTimeout(() => setIsLoading(false), spread);
  }, [entering, reduce]);

  useEffect(() => {
    if (!isLoading) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        enter();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isLoading, enter]);

  // Hold the page still while the intro is up.
  useEffect(() => {
    if (!isLoading) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isLoading]);

  // Boot, then type the greeting. Nothing happens after that until the visitor taps.
  useEffect(() => {
    const boot = reduce ? 300 : BOOT_MS;
    let typer: ReturnType<typeof setInterval> | undefined;

    const startTyping = setTimeout(() => {
      typer = setInterval(() => {
        setChars((c) => {
          if (c >= FULL.length) {
            clearInterval(typer);
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
    };
  }, [reduce]);

  const typed = FULL.slice(0, chars).split("\n");
  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    .toUpperCase();
  const spreadS = (reduce ? 200 : SPREAD_MS) / 1000;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="loading-screen"
          role="button"
          tabIndex={0}
          aria-label="Spidy welcome. Tap anywhere to enter the site."
          onClick={enter}
          initial={{ backgroundColor: "rgba(2,4,10,1)" }}
          animate={{ backgroundColor: entering ? "rgba(2,4,10,0)" : "rgba(2,4,10,1)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: entering ? spreadS * 0.9 : 0.3, ease: "easeIn" }}
          style={{ zIndex: 9999, flexDirection: "column", overflow: "hidden", cursor: "pointer", padding: "1.5rem 0 4.5rem" }}
        >
          <motion.div
            aria-hidden
            animate={{ opacity: entering ? 0 : 1, scale: entering ? 1.6 : 1 }}
            transition={{ duration: spreadS, ease: [0.5, 0, 0.9, 0.4] }}
            style={{ position: "absolute", inset: 0 }}
          >
            <div className="intro-grid" />
          </motion.div>

          <motion.div
            suppressHydrationWarning
            animate={{ opacity: entering ? 0 : 1 }}
            transition={{ duration: spreadS * 0.5 }}
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
          </motion.div>

          {/* The hologram: sphere and rings assemble on arrival, then fly outward and fade when the visitor taps */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={entering ? { opacity: 0, scale: 3 } : { opacity: 1, scale: 1 }}
            transition={entering ? { duration: spreadS, ease: [0.5, 0, 0.9, 0.4] } : { duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "relative", width: "min(700px, 88vw, calc(100svh - 18rem))", aspectRatio: "1", display: "grid", placeItems: "center" }}
          >
            <Rings />
            <div style={{ width: "100%", height: "100%" }}>
              <IntroSphere size={400} burst={entering} />
            </div>
          </motion.div>

          <motion.div
            aria-live="polite"
            animate={{ opacity: entering ? 0 : 1, y: entering ? 24 : 0 }}
            transition={{ duration: spreadS * 0.6 }}
            style={{ marginTop: "1.1rem", textAlign: "center", minHeight: "7.5rem", padding: "0 1.25rem", maxWidth: 640 }}
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
                  {i === typed.length - 1 && !done && <span className="spidy-caret" />}
                </p>
              ))
            )}
          </motion.div>

          <motion.p
            animate={{ opacity: entering ? 0 : done ? [0.45, 1, 0.45] : 0.35 }}
            transition={entering ? { duration: 0.3 } : done ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" } : { duration: 0.4 }}
            style={{
              position: "absolute",
              bottom: "2.5rem",
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.3em",
              color: "var(--cyan)",
              pointerEvents: "none",
            }}
          >
            TAP ANYWHERE TO ENTER
          </motion.p>

          <motion.div
            className="intro-status"
            animate={{ opacity: entering ? 0 : 1 }}
            transition={{ duration: spreadS * 0.5 }}
            style={{
              position: "absolute",
              bottom: "0.8rem",
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
