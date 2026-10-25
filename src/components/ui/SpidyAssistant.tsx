"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { ChevronDown, ChevronUp, Zap } from "lucide-react";
import { SECTIONS } from "@/lib/sections";
import { goToChapter } from "@/lib/nav";
import { useActiveSection } from "@/hooks/useActiveSection";

type Status = "IDLE" | "SCANNING" | "NAVIGATING";

const NAV_MS = 1400;
// A section top must be inside this fraction of the viewport for auto-pilot to pull to it.
const SNAP_ZONE = 0.35;
// Touch momentum can keep scrolling a while after the last touch event.
const INPUT_WINDOW_MS = 2500;
const BUBBLE_MS = 8000;
// On phones the bubble covers a lot of the screen, so it tucks itself away sooner.
const BUBBLE_MS_PHONE = 4500;
const ORB = 48;
const MARGIN = 16;

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
          <stop offset="0%" stopColor="#5fa9b6" />
          <stop offset="40%" stopColor="#0b5f73" />
          <stop offset="100%" stopColor="#5e101b" />
        </radialGradient>
      </defs>
      <g stroke="#0e6578" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {legs.map((d, i) => (
          <path key={i} d={d} className="spidy-leg" style={{ animationDelay: `${i * -0.18}s` }} />
        ))}
      </g>
      <ellipse cx="32" cy="38" rx="8" ry="10" fill="#010308" stroke="#6e1220" strokeWidth="1.4" />
      <circle cx="32" cy="26" r="6" fill="url(#spidy-core)" />
      <circle cx="30" cy="25" r="1.3" fill="#02040a" />
      <circle cx="34" cy="25" r="1.3" fill="#02040a" />
    </svg>
  );
}

/**
 * Spidy rides along with the page: he swings between the two sides of the screen
 * as chapters change, hangs from a thread that sways with scroll speed, announces
 * each chapter in a bubble, and (auto-pilot) pulls the page onto the next chapter.
 */
export default function SpidyAssistant() {
  const index = useActiveSection();
  const section = SECTIONS[index];

  // The screen is the holographic panel. "auto" pops it up on each chapter and hides it again,
  // "on" keeps it open, "off" keeps it dark until the icon is tapped again (remembered between visits).
  const [screen, setScreen] = useState<"auto" | "on" | "off">(() => {
    if (typeof window === "undefined") return "auto";
    try {
      return localStorage.getItem("spidy-screen") === "off" ? "off" : "auto";
    } catch {
      return "auto";
    }
  });
  const [bubble, setBubble] = useState(false);
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
  const [wide, setWide] = useState(() => typeof window !== "undefined" && window.innerWidth >= 1000);

  // Stay hidden until the welcome intro hands over, then greet.
  const [ready, setReady] = useState(
    () => typeof document !== "undefined" && document.documentElement.dataset.spidyReady === "1"
  );
  useEffect(() => {
    const onReady = () => setReady(true);
    const onResize = () => setWide(window.innerWidth >= 1000);
    window.addEventListener("spidy:ready", onReady);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("spidy:ready", onReady);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Pick a line per chapter; repeat visits rotate through the alternatives. A new chapter pops the bubble open.
  const [shown, setShown] = useState(index);
  const [visits, setVisits] = useState<Record<number, number>>({ [index]: 0 });
  if (shown !== index) {
    setShown(index);
    setVisits((v) => ({ ...v, [index]: (v[index] ?? -1) + 1 }));
    setBubble(true);
  }
  const line = section.lines[(visits[index] ?? 0) % section.lines.length];

  const [firstOpen, setFirstOpen] = useState(false);
  if (ready && !firstOpen) {
    setFirstOpen(true);
    setBubble(true);
  }

  useEffect(() => {
    if (!bubble || screen !== "auto") return;
    const t = setTimeout(() => setBubble(false), window.innerWidth < 560 ? BUBBLE_MS_PHONE : BUBBLE_MS);
    return () => clearTimeout(t);
  }, [bubble, screen, index]);

  const open = screen === "on" || (screen === "auto" && bubble);
  const screenOff = screen === "off";

  const toggleScreen = () => {
    const next = screenOff ? "on" : "off";
    setScreen(next);
    setBubble(next === "on");
    try {
      localStorage.setItem("spidy-screen", next);
    } catch {
      /* storage unavailable, the choice just won't persist */
    }
  };

  const [typed, setTyped] = useState({ line: "", n: 0 });
  useEffect(() => {
    if (!ready) return;
    const id = setInterval(() => {
      setTyped((t) => (t.line !== line ? { line, n: 1 } : t.n >= line.length ? t : { line, n: t.n + 1 }));
    }, 18);
    return () => clearInterval(id);
  }, [line, ready]);
  const shownText = typed.line === line ? line.slice(0, typed.n) : "";

  // Swing to the other side of the screen as chapters change.
  const side: "left" | "right" = wide && index % 2 === 1 ? "left" : "right";
  const sx = useMotionValue(0);
  const sy = useMotionValue(0);
  const sxVel = useVelocity(sx);
  const swingTilt = useTransform(sxVel, [-2500, 2500], [-16, 16]);
  const threadSway = useTransform(sxVel, [-2500, 2500], [-9, 9]);
  useEffect(() => {
    const target = side === "left" ? -(window.innerWidth - ORB - MARGIN * 2) : 0;
    const a = animate(sx, target, { type: "spring", stiffness: 42, damping: 12 });
    const b = animate(sy, [0, -150, 0], { duration: 1.2, ease: "easeInOut" });
    return () => {
      a.stop();
      b.stop();
    };
  }, [side, sx, sy]);

  // Motion values: the core tilts and its glow reacts to scroll speed without re-rendering.
  const { scrollY, scrollYProgress } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { stiffness: 120, damping: 30 });
  const scrollTilt = useTransform(velocity, [-3000, 3000], [-22, 22]);
  const tilt = useTransform([scrollTilt, swingTilt], ([a, b]: number[]) => a + b);
  const glow = useTransform(velocity, (v) => `drop-shadow(0 0 ${2 + Math.min(Math.abs(v) / 120, 8)}px rgba(34,211,238,0.22))`);
  // Spidy trails the scroll like he's hanging on a thread: sags when you scroll, swings back when you stop.
  const lag = useSpring(useTransform(velocity, [-3000, 3000], [-46, 46]), { stiffness: 90, damping: 9 });
  const orbY = useTransform([sy, lag], ([a, b]: number[]) => a + b);
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
    if (!document.getElementById(id)) return;
    navUntil.current = Date.now() + NAV_MS;
    setStatus("NAVIGATING");
    goToChapter(id);
    window.setTimeout(() => setStatus((s) => (s === "NAVIGATING" ? "IDLE" : s)), NAV_MS);
  }, []);

  // Auto-pilot: once scrolling settles near a chapter boundary, Spidy pulls the page onto it.
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
        // Heading toward a chapter: pull forward. Heading back up: land on the one just passed.
        const inZone = dir > 0 ? top > 8 && top < vh * SNAP_ZONE : top < -8 && top > -vh * SNAP_ZONE;
        if (inZone && (!best || Math.abs(top) < Math.abs(best.top))) best = { id: s.id, top };
      }
      if (best) goTo(best.id);
    };

    const onScroll = () => {
      const y = window.scrollY;
      if (y !== lastY) dir = y > lastY ? 1 : -1;
      lastY = y;
      if (Date.now() >= navUntil.current) setStatus("SCANNING");
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
      {/* The tether Spidy hangs from; it sways as he swings */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        style={{
          position: "fixed",
          right: "calc(40px - 0.75px)",
          top: 0,
          bottom: 72,
          width: 1.5,
          x: sx,
          y: sy,
          transformOrigin: "top",
          rotate: threadSway,
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
          right: MARGIN,
          bottom: MARGIN,
          width: ORB,
          height: ORB,
          zIndex: 1100,
          x: sx,
          y: orbY,
          pointerEvents: ready ? "auto" : "none",
        }}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.96 }}
              transition={{ duration: 0.28 }}
              className="holo"
              style={{
                position: "absolute",
                bottom: ORB + 26,
                [side]: 0,
                width: "min(290px, calc(100vw - 2rem))",
                padding: "0.65rem 0.8rem",
                borderColor: "rgba(34,211,238,0.3)",
                boxShadow: "0 14px 44px rgba(0,0,0,0.75)",
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
                <span style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--cyan)", fontWeight: 700 }}>
                  SPIDY // AUTONOMOUS AGENT
                </span>
                <span style={{ marginLeft: "auto", fontSize: 10, color: statusColor, letterSpacing: "0.1em" }}>{status}</span>
              </div>

              <p aria-live="polite" style={{ fontSize: 12, lineHeight: 1.5, color: "var(--bone)", minHeight: "3.4em" }}>
                {shownText}
                <span className="spidy-caret" />
              </p>

              <div className="spidy-facts" style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
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
                  color: "var(--bone-dim)",
                }}
              >
                <span>
                  CH.{String(index).padStart(2, "0")}/{String(SECTIONS.length - 1).padStart(2, "0")} · {section.title.toUpperCase()}
                </span>
                <motion.span>{percent}</motion.span>
              </div>

              <div style={{ display: "flex", gap: 6 }}>
                <button className="spidy-btn" onClick={() => goTo(prev.id)} disabled={index === 0} aria-label={`Go to ${prev.label}`}>
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
                    color: autopilot ? "#02040a" : "var(--bone-dim)",
                    background: autopilot ? "var(--cyan)" : undefined,
                  }}
                >
                  <Zap size={13} />
                  AUTO-PILOT {autopilot ? "ON" : "OFF"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {open && <span className="holo-beam" aria-hidden style={{ bottom: ORB - 4 }} />}
        <motion.button
          onClick={toggleScreen}
          aria-label={screenOff ? "Turn Spidy's screen on" : "Turn Spidy's screen off"}
          aria-pressed={!screenOff}
          title={screenOff ? "Tap to turn Spidy's screen on" : "Tap to turn Spidy's screen off"}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          style={{
            position: "relative",
            width: ORB,
            height: ORB,
            borderRadius: "50%",
            border: screenOff ? "1px solid rgba(160,180,200,0.25)" : "1px solid rgba(34,211,238,0.2)",
            background: "radial-gradient(circle at 50% 40%, rgba(34,211,238,0.03), rgba(0,2,6,0.99) 75%)",
            opacity: screenOff ? 0.6 : 1,
            padding: 4,
          }}
        >
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: -5,
              borderRadius: "50%",
              border: "1px dashed rgba(239,35,60,0.38)",
              animation: "spin-slow 9s linear infinite",
            }}
          />
          <motion.div style={{ width: "100%", height: "100%", rotate: tilt, filter: screenOff ? "grayscale(1)" : glow }}>
            <SpidyCore />
          </motion.div>
        </motion.button>
      </motion.div>
    </>
  );
}
