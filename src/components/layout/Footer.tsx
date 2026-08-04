"use client";
import { Mail, Heart, ArrowUp } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { motion } from "framer-motion";

const socials = [
  { icon: GithubIcon, href: "https://github.com/shivdhiksh", label: "GitHub" },
  { icon: LinkedinIcon, href: "https://linkedin.com/in/shivdhiksh", label: "LinkedIn" },
  { icon: Mail, href: "mailto:koppu.shivadhikshith@gmail.com", label: "Email" },
];

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--glass-border)", position: "relative", overflow: "hidden" }}>
      {/* Animated gradient line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "linear-gradient(90deg, var(--accent-blue), var(--accent-purple), var(--accent-cyan), var(--accent-blue))",
          backgroundSize: "200% 100%",
          animation: "gradient-x 4s ease infinite",
        }}
      />

      <div className="container-custom py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + tagline */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 900,
                  color: "white",
                }}
              >
                SDK
              </div>
              <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>Shiva Dhikshith Koppu</span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
              AI Developer · Full Stack · ML Enthusiast
            </p>
          </div>

          {/* Social links */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            {socials.map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--glass-bg)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--text-secondary)",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-blue)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                <s.icon size={15} />
              </motion.a>
            ))}
          </div>

          {/* Back to top */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              borderRadius: 9999,
              background: "rgba(59,130,246,0.1)",
              border: "1px solid rgba(59,130,246,0.3)",
              color: "var(--accent-blue)",
              fontSize: "0.8rem",
              fontWeight: 600,
              transition: "all 0.2s",
            }}
            aria-label="Back to top"
          >
            <ArrowUp size={14} />
            Back to Top
          </motion.button>
        </div>

        {/* Bottom */}
        <div
          style={{
            marginTop: "2rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--glass-border)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            © 2024 Shiva Dhikshith Koppu. Made with{" "}
            <Heart size={12} style={{ color: "#ef4444", fill: "#ef4444" }} />
            {" "}using Next.js & Framer Motion
          </p>
        </div>
      </div>
    </footer>
  );
}
