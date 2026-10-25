"use client";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Download, Mail, Sparkles } from "lucide-react";

const roles = [
  "AI Developer",
  "Full Stack Developer",
  "ML Enthusiast",
  "Problem Solver",
  "Software Engineer",
];

function useTypewriter(words: string[], speed = 100, pause = 2000) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex % words.length];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setText(current.slice(0, text.length + 1));
          if (text === current) {
            setTimeout(() => setIsDeleting(true), pause);
          }
        } else {
          setText(current.slice(0, text.length - 1));
          if (text === "") {
            setIsDeleting(false);
            setWordIndex((i) => i + 1);
          }
        }
      },
      isDeleting ? speed / 2 : speed
    );
    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, speed, pause]);

  return text;
}

export default function Hero() {
  const typedText = useTypewriter(roles);
  const scrollToProjects = () => document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
  const scrollToContact = () => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });

  // Scroll-linked parallax: copy drifts down and fades, the giant title rises and swells.
  const { scrollY } = useScroll();
  const contentY = useTransform(scrollY, [0, 600], [0, 140]);
  const contentOpacity = useTransform(scrollY, [0, 500], [1, 0.1]);
  const titleY = useTransform(scrollY, [0, 900], [0, -220]);
  const titleScale = useTransform(scrollY, [0, 900], [1, 1.4]);
  const titleOpacity = useTransform(scrollY, [0, 700], [1, 0]);

  return (
    <section
      id="home"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Giant title behind the copy, like a chapter plate */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, letterSpacing: "0.5em" }}
        animate={{ opacity: 1, letterSpacing: "0.12em" }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "4%",
          textAlign: "center",
          fontSize: "clamp(5rem, 25vw, 24rem)",
          fontWeight: 900,
          lineHeight: 0.9,
          color: "transparent",
          WebkitTextStroke: "1.5px rgba(34,211,238,0.35)",
          userSelect: "none",
          pointerEvents: "none",
          y: titleY,
          scale: titleScale,
          opacity: titleOpacity,
        }}
      >
        SPIDY
      </motion.div>

      <div className="container-custom relative z-10 py-32">
        <motion.div className="max-w-4xl mx-auto text-center" style={{ y: contentY, opacity: contentOpacity }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}
          >
            <span className="section-tag">
              <Sparkles size={12} />
              Available for opportunities
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              fontSize: "clamp(2.5rem, 7vw, 5rem)",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
              marginBottom: "1rem",
            }}
          >
            Hi, I&apos;m{" "}
            <span className="gradient-text">Shiva Dhikshith</span>
            <br />
            <span style={{ color: "var(--text-primary)" }}>Koppu</span>
          </motion.h1>

          {/* Typewriter role */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              height: "2.5rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <span
              style={{
                fontSize: "clamp(1.1rem, 3vw, 1.6rem)",
                fontWeight: 600,
                color: "var(--accent-cyan)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {">"} {typedText}
              <span
                style={{
                  display: "inline-block",
                  width: "2px",
                  height: "1.2em",
                  background: "var(--accent-cyan)",
                  marginLeft: "2px",
                  verticalAlign: "text-bottom",
                  animation: "pulse 1s infinite",
                }}
              />
            </span>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
              color: "var(--text-secondary)",
              maxWidth: 560,
              margin: "0 auto 2.5rem",
              lineHeight: 1.8,
            }}
          >
            Passionate about building intelligent systems, scalable applications, and solving real-world problems with AI & modern web technologies.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
          >
            <motion.button
              className="btn-primary"
              onClick={scrollToProjects}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{ gap: "0.5rem" }}
            >
              View Projects
            </motion.button>

            <motion.a
              href="/resume"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glass"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <Download size={16} />
              Download Resume
            </motion.a>

            <motion.button
              onClick={scrollToContact}
              className="btn-glass"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <Mail size={16} />
              Contact Me
            </motion.button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "3rem",
              marginTop: "4rem",
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "10+", label: "Projects Built" },
              { value: "5+", label: "Hackathons" },
              { value: "3+", label: "Years Coding" },
              { value: "∞", label: "Learning" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 900,
                    background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", letterSpacing: "0.05em" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>SCROLL</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ArrowDown size={16} color="var(--text-muted)" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
