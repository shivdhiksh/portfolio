"use client";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Brain, Code2, Lightbulb, Trophy, User } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cards = [
  {
    icon: Brain,
    title: "AI & Machine Learning",
    desc: "Passionate about building intelligent systems that learn, adapt, and solve complex real-world challenges.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Code2,
    title: "Full Stack Development",
    desc: "Crafting end-to-end web applications with modern frameworks, clean architecture, and great UX.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Lightbulb,
    title: "Problem Solving",
    desc: "Competitive programmer with a knack for breaking down complex problems into elegant solutions.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Trophy,
    title: "Hackathon Enthusiast",
    desc: "Thriving under pressure — building innovative products in 24 hours and learning something new every time.",
    color: "from-green-500 to-emerald-500",
  },
];

export default function About() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="about" style={{ background: "var(--section-scrim)", padding: "6rem 0" }}>
      <div className="container-custom">
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Heading */}
          <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: "4rem" }}>
            <span className="section-tag">
              <User size={12} />
              About Me
            </span>
            <h2
              style={{
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: 900,
                letterSpacing: "-0.02em",
                color: "var(--text-primary)",
                marginBottom: "1rem",
              }}
            >
              Who am I?
            </h2>
            <p style={{ color: "var(--text-secondary)", maxWidth: 640, margin: "0 auto", lineHeight: 1.8, fontSize: "1rem" }}>
              A developer who bridges the gap between cutting-edge AI research and production-grade software engineering.
            </p>
          </motion.div>

          {/* Main content */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }} className="grid-about">
            {/* Left: Text */}
            <motion.div variants={fadeUp} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Profile photo */}
              <div style={{ position: "relative", width: 120, height: 120 }}>
                {/* Outer glow ring */}
                <div
                  style={{
                    position: "absolute",
                    inset: -4,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple), var(--accent-cyan))",
                    opacity: 0.7,
                    animation: "spin-slow 6s linear infinite",
                  }}
                />
                {/* Photo */}
                <div
                  style={{
                    position: "relative",
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "3px solid var(--bg-secondary)",
                    boxShadow: "0 0 30px rgba(59,130,246,0.3)",
                    zIndex: 1,
                  }}
                >
                  <Image
                    src="/profile.jpg"
                    alt="Shiva Dhikshith Koppu"
                    fill
                    style={{ objectFit: "cover", objectPosition: "top" }}
                    priority
                  />
                </div>
                {/* Online badge */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 6,
                    right: 6,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#22c55e",
                    border: "2px solid var(--bg-secondary)",
                    boxShadow: "0 0 8px rgba(34,197,94,0.6)",
                    zIndex: 2,
                  }}
                />
              </div>

              <div>
                <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                  Shiva Dhikshith Koppu
                </h3>
                <p style={{ color: "var(--accent-blue)", fontWeight: 600, fontSize: "0.9rem", letterSpacing: "0.05em" }}>
                  AI Developer · Full Stack · ML Enthusiast
                </p>
              </div>

              <p style={{ color: "var(--text-secondary)", lineHeight: 1.9, fontSize: "0.95rem" }}>
                I&apos;m a passionate developer specializing in Artificial Intelligence and Full Stack Development.
                My journey started with a deep curiosity about how machines learn, which quickly evolved into
                building production-grade AI applications and scalable web platforms.
              </p>

              <p style={{ color: "var(--text-secondary)", lineHeight: 1.9, fontSize: "0.95rem" }}>
                I thrive in environments that challenge me — hackathons, competitive programming, and shipping products
                that make a real impact. I believe technology should be both powerful and accessible, and I build with
                that philosophy in mind.
              </p>

              {/* Quick facts */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                {[
                  { label: "Location", value: "India" },
                  { label: "Focus", value: "Software Engineer" },
                  { label: "Status", value: "Open to Work" },
                ].map((fact) => (
                  <div
                    key={fact.label}
                    style={{
                      padding: "0.75rem 1rem",
                      borderRadius: 10,
                      background: "var(--glass-bg)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid var(--glass-border)",
                    }}
                  >
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{fact.label}</div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)", marginTop: 2 }}>{fact.value}</div>
                  </div>
                ))}
              </div>

              {/* Download CV button */}
              <motion.a
                href="/resume"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ alignSelf: "flex-start" }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Download Resume
              </motion.a>
            </motion.div>

            {/* Right: Passion cards */}
            <motion.div
              variants={stagger}
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
            >
              {cards.map((card) => (
                <motion.div
                  key={card.title}
                  variants={fadeUp}
                  whileHover={{ y: -4, scale: 1.02 }}
                  style={{
                    padding: "1.5rem",
                    borderRadius: 16,
                    background: "var(--glass-bg)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid var(--glass-border)",
                    transition: "all 0.3s ease",
                    cursor: "default",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: `linear-gradient(135deg, ${card.color.includes("blue") ? "var(--accent-blue), var(--accent-cyan)" : card.color.includes("purple") ? "var(--accent-purple), #ec4899" : card.color.includes("yellow") ? "#f59e0b, #ef4444" : "#22c55e, #10b981"})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <card.icon size={20} color="white" />
                  </div>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                    {card.title}
                  </h4>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.7 }}>
                    {card.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .grid-about {
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 768px) {
          .grid-about {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
