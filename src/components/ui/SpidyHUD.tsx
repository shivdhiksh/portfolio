"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { SECTIONS } from "@/lib/sections";
import { useActiveSection } from "@/hooks/useActiveSection";

const pad = (n: number, w = 2) => String(Math.max(0, Math.round(n))).padStart(w, "0");

/**
 * Holographic HUD that rides over every part of the page: corner brackets,
 * live telemetry, a chapter strip and a cursor reticle.
 * It is purely decorative (pointer-events: none) and driven by scroll motion values.
 */
export default function SpidyHUD() {
  const index = useActiveSection();
  const section = SECTIONS[index];
  const [ready, setReady] = useState(
    () => typeof document !== "undefined" && document.documentElement.dataset.spidyReady === "1"
  );
  // Touch devices get no cursor reticle. This component only renders on the client.
  const [fine] = useState(() => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches);

  useEffect(() => {
    const onReady = () => setReady(true);
    window.addEventListener("spidy:ready", onReady);
    return () => window.removeEventListener("spidy:ready", onReady);
  }, []);

  const { scrollY, scrollYProgress } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { stiffness: 120, damping: 28 });

  // Readouts are plain motion values so nothing re-renders per frame.
  const alt = useTransform(scrollY, (y) => pad(y / 6, 4));
  const vel = useTransform(velocity, (v) => `${v >= 0 ? "+" : "-"}${pad(Math.abs(v) / 12, 3)}`);
  const pct = useTransform(scrollYProgress, (p) => pad(p * 100, 3));
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Cursor reticle
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const rx = useSpring(mx, { stiffness: 260, damping: 26 });
  const ry = useSpring(my, { stiffness: 260, damping: 26 });
  const coords = useTransform([mx, my], ([x, y]: number[]) =>
    typeof window === "undefined" ? "" : `X ${(x / window.innerWidth).toFixed(2)}  Y ${(y / window.innerHeight).toFixed(2)}`
  );
  useEffect(() => {
    if (!fine) return;
    const move = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [fine, mx, my]);

  return (
    <motion.div
      aria-hidden
      className="hud"
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? 1 : 0 }}
      transition={{ duration: 1 }}
    >
      <i className="hud-corner tl" />
      <i className="hud-corner tr" />
      <i className="hud-corner bl" />
      <i className="hud-corner br" />

      <div className="hud-link">
        <span className="hud-dot" /> ASSISTANT LINK · ONLINE
      </div>

      <div className="hud-telemetry">
        <div>
          CH.{pad(index)} · {section.title.toUpperCase()}
        </div>
        <div>
          ALT <motion.b>{alt}</motion.b> M
        </div>
        <div>
          VEL <motion.b>{vel}</motion.b>
        </div>
        <div>
          SYNC <motion.b>{pct}</motion.b>%
        </div>
      </div>

      <div className="hud-strip">
        {SECTIONS.map((s, i) => (
          <span key={s.id} className={i === index ? "on" : i < index ? "done" : ""} />
        ))}
        <motion.i style={{ scaleX: fill }} />
      </div>

      {fine && (
        <>
          <motion.div className="hud-reticle" style={{ x: rx, y: ry }}>
            <span className="ring" />
            <span className="h" />
            <span className="v" />
            <motion.em>{coords}</motion.em>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
