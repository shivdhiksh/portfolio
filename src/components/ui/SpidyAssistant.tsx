"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { ChevronDown, ChevronUp, Zap } from "lucide-react";
import { SECTIONS } from "@/lib/sections";
import { useActiveSection } from "@/hooks/useActiveSection";

type Status = "IDLE" | "SCANNING" | "NAVIGATING";

const NAV_MS = 1400;
// A section top must be inside this fraction of the viewport for auto-pilot to pull to it.
const SNAP_ZONE = 0.35;
// Touch momentum can keep scrolling a while after the last touch event.
const INPUT_WINDOW_MS = 2500;

function SpidyCore() {
  const legs = [
    "M26 28 L10 14 L4 20",
    "M25 32 L6 30 L2 38",
    "M26 36 L8 46 L6 56",
    "M28 40 L16 58 L12 62",
    "M38 28 L54 14 L60 20",
    "M39 32 L58 30 L62 38",
    "M38 36 L56 46 L58 56",
    "M36 40 L48 58 L52 62",
  ];
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden>
      <defs>
        <radialGradient id="spidy-core" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#ef233c" />
        </radialGradient>
      </defs>
      <g stroke="#22d3ee" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {legs.map((d, i) => (
          <path key={i} d={d} className="spidy-leg" style={{ animationDelay: `${i * -0.18}s` }} />
        ))}
      </g>
      <ellipse cx="32" cy="38" rx="8" ry="10" fill="#050914" stroke="#ef233c" strokeWidth="1.4" />
      <path d="M32 30 L32 46 M27 36 L37 36 M28 31 L36 43 M36 31 L28 43" stroke="#ef233c" strokeWidth="0.8" opacity="0.7" />
      <circle cx="32" cy="26" r="6" fill="url(#spidy-core)" />
      <circle cx="30" cy="25" r="1.3" fill="#02040a" />
      <circle cx="34" cy="25" r="1.3" fill="#02040a" />
    </svg>
  );
}

export default function SpidyAssistant() {
  const index = useActiveSection();
  const section = SECTIONS[index];

  // Start minimized on phones so the panel doesn't cover content.
  const [collapsed, setCollapsed] = useState(() => typeof window !== "undefined" && window.innerWidth < 640);
  const [autopilot, setAutopilot] = useState(() => {
    if (typeof window === "undefined") return true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    try {
      return localStorage.getItem("spidy-autopilot") !== "off";
    } catch {
      return true;
    }
  });
  const [status, setStatus] = useState<Status>("IDLE");
  const [zip, setZip] = useState(0);

  // Pick a line per section; repeat visits rotate through the alternatives.
  const [shown, setShown] = useState(index);
  const [visits, setVisits] = useState<Record<number, number>>({ [index]: 0 });
  if (shown !== index) {
    setShown(index);
    setVisits((v) => ({ ...v, [index]: (v[index] ?? -1) + 1 }));
  }
  const line = section.lines[(visits[index] ?? 0) % section.lines.length];

  // Stay hidden until the welcome intro hands over, then greet.
  const [ready, setReady] = useState(
    () => typeof document !== "undefined" && document.documentElement.dataset.spidyReady === "1"
  );
  useEffect(() => {
    const onReady = () => setReady(true);
    window.addEventListener("spidy:ready", onReady);
    return () => window.removeEventListener("spidy:ready", onReady);
  }, []);

  const [typed, setTyped] = useState({ line: "", n: 0 });
  useEffect(() => {
    if (!ready) return;
    const id = setInterval(() => {
      setTyped((t) => (t.line !== line ? { line, n: 1 } : t.n >= line.length ? t : { line, n: t.n + 1 }));
    }, 18);
    return () => clearInterval(id);
  }, [line, ready]);
  const shownText = typed.line === line ? line.slice(0, typed.n) : "";

  // Motion values: the core tilts and its glow reacts to scroll speed without re-rendering.
  const { scrollY, scrollYProgress } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { stiffness: 120, damping: 30 });
  const tilt = useTransform(velocity, [-3000, 3000], [-22, 22]);
  const glow = useTransform(velocity, (v) => `drop-shadow(0 0 ${8 + Math.min(Math.abs(v) / 60, 22)}px rgba(34,211,238,0.75))`);
  // Spidy trails the scroll like he's hanging on a thread: sags when you scroll, swings back when you stop.
  const lag = useSpring(useTransform(velocity, [-3000, 3000], [-46, 46]), { stiffness: 90, damping: 9 });
  const sway = useTransform(velocity, [-3000, 3000], [-5, 5]);
  const percent = useTransform(scrollYProgress, (p) => `${Math.round(p * 100)}%`);

  const autopilotRef = useRef(autopilot);
  const navUntil = useRef(0);
  const lastInput = useRef(0);

  const toggleAutopilot = () => {
    const next = !autopilot;
    autopilotRef.current = next;
    setAutopilot(next);
    try {
      localStorage.setItem("spidy-autopilot", next ? "on" : "off");
    } catch {
      /* storage unavailable, setting just won't persist */
    }
  };

  const goTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    navUntil.current = Date.now() + NAV_MS;
    setStatus("NAVIGATING");
    setZip((z) => z + 1);
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: reduce ? "auto" : "smooth" });
    window.setTimeout(() => setStatus((s) => (s === "NAVIGATING" ? "IDLE" : s)), NAV_MS);
  }, []);

  // Auto-pilot: once scrolling settles near a section boundary, Spidy pulls the page onto it.
  useEffect(() => {
    let lastY = window.scrollY;
    let dir = 1;
    let timer = 0;

    const settle = () => {
      if (Date.now() < navUntil.current) return;
      setStatus((s) => (s === "SCANNING" ? "IDLE" : s));
      // Only react to scrolling the visitor started; programmatic scrolls must never chain into more snaps.
      if (!autopilotRef.current || Date.now() - lastInput.current > INPUT_WINDOW_MS) return;

      const vh = window.innerHeight;
      let best: { id: string; top: number } | null = null;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        // Heading toward a section: pull forward. Heading back up: land on the one just passed.
        const inZone = dir > 0 ? top > 8 && top < vh * SNAP_ZONE : top < -8 && top > -vh * SNAP_ZONE;
        if (inZone && (!best || Math.abs(top) < Math.abs(best.top))) best = { id: s.id, top };
      }
      if (best) goTo(best.id);
    };

    const onScroll = () => {
      const y = window.scrollY;
      if (y !== lastY) dir = y > lastY ? 1 : -1;
      lastY = y;
      if (Date.now() >= navUntil.current) setStatus((s) => (s === "SCANNING" ? s : "SCANNING"));
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, 140);
    };
    // Any manual input takes the wheel back from auto-pilot and marks the next scroll as user-driven.
    const onInput = () => {
      navUntil.current = 0;
      lastInput.current = Date.now();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    const inputEvents = ["wheel", "touchstart", "touchmove", "pointerdown", "keydown"] as const;
    inputEvents.forEach((e) => window.addEventListener(e, onInput, { passive: true }));
    return () => {
      window.removeEventListener("scroll", onScroll);
      inputEvents.forEach((e) => window.removeEventListener(e, onInput));
      window.clearTimeout(timer);
    };
  }, [goTo]);

  const prev = SECTIONS[Math.max(0, index - 1)];
  const next = SECTIONS[Math.min(SECTIONS.length - 1, index + 1)];
  const statusColor = status === "NAVIGATING" ? "#ef233c" : status === "SCANNING" ? "#22d3ee" : "#22c55e";

  return (
    <>
      {/* Web strand fired whenever Spidy navigates */}
      <AnimatePresence>
        {zip > 0 && (
          <motion.div
            key={zip}
            aria-hidden
            initial={{ scaleY: 0, opacity: 0.9 }}
            animate={{ scaleY: 1, opacity: 0 }}
            transition={{ scaleY: { duration: 0.45, ease: "easeOut" }, opacity: { duration: 0.9, delay: 0.2 } }}
            style={{
              position: "fixed",
              right: "2.45rem",
              bottom: "5rem",
              width: 2,
              height: "calc(100vh - 5rem)",
              transformOrigin: "bottom",
              background: "linear-gradient(to top, #22d3ee, rgba(255,255,255,0.9))",
              boxShadow: "0 0 12px #22d3ee",
              pointerEvents: "none",
              zIndex: 1090,
            }}
          />
        )}
      </AnimatePresence>

      {/* The thread Spidy hangs from; it sways with scroll speed */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        style={{
          position: "fixed",
          right: "2.45rem",
          top: 0,
          bottom: "5.4rem",
          width: 1.5,
          transformOrigin: "top",
          rotate: sway,
          background: "linear-gradient(to bottom, transparent, rgba(34,211,238,0.55))",
          pointerEvents: "none",
          zIndex: 1080,
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: ready ? 1 : 0, scale: ready ? 1 : 0.6 }}
        transition={{ type: "spring", stiffness: 160, damping: 14 }}
        style={{
          position: "fixed",
          right: "1rem",
          bottom: "1rem",
          zIndex: 1100,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "0.6rem",
          y: lag,
          pointerEvents: ready ? "auto" : "none",
        }}
      >
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="glass spidy-panel"
              style={{
                width: "min(330px, calc(100vw - 2rem))",
                borderRadius: 14,
                padding: "0.85rem 0.95rem",
                borderColor: "rgba(34,211,238,0.35)",
                boxShadow: "0 0 30px rgba(34,211,238,0.12), var(--glass-shadow)",
                fontFamily: "var(--font-mono)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: statusColor,
                    boxShadow: `0 0 8px ${statusColor}`,
                  }}
                />
                <span style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--accent-cyan)", fontWeight: 700 }}>
                  SPIDY // AUTONOMOUS AGENT
                </span>
                <span style={{ marginLeft: "auto", fontSize: 10, color: statusColor, letterSpacing: "0.1em" }}>{status}</span>
              </div>

              <p
                aria-live="polite"
                style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--text-primary)", minHeight: "3.9em" }}
              >
                {shownText}
                <span className="spidy-caret" />
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
                {section.facts.map((fact) => (
                  <span key={fact} className="spidy-chip">
                    {fact}
                  </span>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                  margin: "0.65rem 0 0.5rem",
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  color: "var(--text-secondary)",
                }}
              >
                <span>
                  SECTOR {String(index + 1).padStart(2, "0")}/{SECTIONS.length} · {section.label.toUpperCase()}
                </span>
                <motion.span>{percent}</motion.span>
              </div>

              <div style={{ display: "flex", gap: 6 }}>
                <button
                  className="spidy-btn"
                  onClick={() => goTo(prev.id)}
                  disabled={index === 0}
                  aria-label={`Go to ${prev.label}`}
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  className="spidy-btn"
                  onClick={() => goTo(next.id)}
                  disabled={index === SECTIONS.length - 1}
                  aria-label={`Go to ${next.label}`}
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  className="spidy-btn"
                  onClick={toggleAutopilot}
                  aria-pressed={autopilot}
                  style={{
                    flex: 1,
                    gap: 6,
                    color: autopilot ? "#02040a" : "var(--text-secondary)",
                    background: autopilot ? "var(--accent-cyan)" : undefined,
                  }}
                >
                  <Zap size={13} />
                  AUTO-PILOT {autopilot ? "ON" : "OFF"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Open Spidy assistant" : "Minimize Spidy assistant"}
          aria-expanded={!collapsed}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          style={{
            position: "relative",
            width: 64,
            height: 64,
            borderRadius: "50%",
            border: "1px solid rgba(34,211,238,0.5)",
            background: "radial-gradient(circle at 50% 40%, rgba(34,211,238,0.18), rgba(2,4,10,0.9) 70%)",
            padding: 6,
          }}
        >
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: -5,
              borderRadius: "50%",
              border: "1px dashed rgba(239,35,60,0.7)",
              animation: "spin-slow 9s linear infinite",
            }}
          />
          <motion.div style={{ width: "100%", height: "100%", rotate: tilt, filter: glow }}>
            <SpidyCore />
          </motion.div>
        </motion.button>
      </motion.div>
    </>
  );
}
