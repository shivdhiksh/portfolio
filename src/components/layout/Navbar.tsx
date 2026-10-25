"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SECTIONS } from "@/lib/sections";
import { goToChapter } from "@/lib/nav";
import { useActiveSection } from "@/hooks/useActiveSection";

export default function Navbar() {
  const active = useActiveSection();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    goToChapter(id);
  };

  return (
    <>
      <motion.header
        className={`nav ${scrolled ? "scrolled" : ""}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      >
        <button className="nav-brand" onClick={() => go("home")} aria-label="Back to the gate">
          <span className="mark">SDK</span>
          <span className="hidden sm:inline">Shiva Dhikshith</span>
        </button>

        <nav className="nav-links" aria-label="Chapters">
          {SECTIONS.slice(1).map((s, i) => (
            <button key={s.id} className={active === i + 1 ? "on" : ""} onClick={() => go(s.id)}>
              {s.label}
            </button>
          ))}
          <a href="/resume" target="_blank" rel="noopener noreferrer">
            Résumé
          </a>
        </nav>

        <button className="nav-burger" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="glass"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            style={{ position: "fixed", top: 64, left: 12, right: 12, zIndex: 49, padding: "0.6rem", borderRadius: 6 }}
          >
            {SECTIONS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => go(s.id)}
                className="mono"
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "0.85rem 1rem",
                  fontSize: "0.74rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: active === i ? "var(--cyan)" : "var(--bone)",
                }}
              >
                {String(i).padStart(2, "0")} — {s.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
