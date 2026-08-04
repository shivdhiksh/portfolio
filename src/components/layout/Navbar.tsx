"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#resume", label: "Resume" },
  { href: "#achievements", label: "Achievements" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );
    navLinks.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: scrolled ? "0.75rem 0" : "1.25rem 0",
          background: scrolled
            ? "var(--glass-bg)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid var(--glass-border)" : "none",
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.1)" : "none",
          transition: "all 0.3s ease",
        }}
      >
        <div className="container-custom flex items-center justify-between">
          {/* Logo */}
          <motion.button
            onClick={() => scrollTo("#home")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "none",
              border: "none",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 900,
                color: "white",
                letterSpacing: "-0.5px",
                boxShadow: "0 0 20px rgba(59,130,246,0.3)",
              }}
            >
              SDK
            </div>
            <span
              style={{
                color: "var(--text-primary)",
                fontWeight: 700,
                fontSize: "0.9rem",
                letterSpacing: "0.02em",
              }}
              className="hidden sm:block"
            >
              Shiva Dhikshith
            </span>
          </motion.button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                style={{
                  padding: "0.4rem 0.9rem",
                  borderRadius: 8,
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color:
                    activeSection === link.href.replace("#", "")
                      ? "var(--accent-blue)"
                      : "var(--text-secondary)",
                  background:
                    activeSection === link.href.replace("#", "")
                      ? "rgba(59,130,246,0.1)"
                      : "transparent",
                  border: "none",
                  transition: "all 0.2s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== link.href.replace("#", "")) {
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== link.href.replace("#", "")) {
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => scrollTo("#contact")}
              className="hidden sm:flex btn-primary"
              style={{ padding: "0.5rem 1.2rem", fontSize: "0.8rem" }}
            >
              Hire Me
            </motion.button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--glass-bg)",
                backdropFilter: "blur(20px)",
                border: "1px solid var(--glass-border)",
                color: "var(--text-primary)",
              }}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileOpen ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              top: 70,
              left: "1rem",
              right: "1rem",
              zIndex: 999,
              background: "var(--glass-bg)",
              backdropFilter: "blur(30px)",
              border: "1px solid var(--glass-border)",
              borderRadius: 16,
              padding: "1rem",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => scrollTo(link.href)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "0.75rem 1rem",
                  borderRadius: 10,
                  border: "none",
                  background:
                    activeSection === link.href.replace("#", "")
                      ? "rgba(59,130,246,0.1)"
                      : "transparent",
                  color:
                    activeSection === link.href.replace("#", "")
                      ? "var(--accent-blue)"
                      : "var(--text-primary)",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  transition: "all 0.2s",
                }}
              >
                {link.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
