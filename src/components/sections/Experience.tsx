"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { experiences } from "@/data/experience";
import { Briefcase, Laptop, Zap, BookOpen, Award, Clock } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Briefcase, Laptop, Zap, BookOpen, Award, Clock,
};

const typeColor: Record<string, string> = {
  internship: "var(--accent-blue)",
  freelance: "var(--accent-purple)",
  hackathon: "#f59e0b",
  training: "var(--accent-cyan)",
  certification: "#22c55e",
};

const typeBg: Record<string, string> = {
  internship: "rgba(59,130,246,0.1)",
  freelance: "rgba(139,92,246,0.1)",
  hackathon: "rgba(245,158,11,0.1)",
  training: "rgba(6,182,212,0.1)",
  certification: "rgba(34,197,94,0.1)",
};

export default function Experience() {
  const [ref, inView] = useInView({ threshold: 0.05, triggerOnce: true });

  return (
    <section id="experience" style={{ background: "var(--bg-secondary)", padding: "6rem 0" }}>
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "4rem" }}
        >
          <span className="section-tag">
            <Briefcase size={12} />
            Experience
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
            My <span className="gradient-text">Journey</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: 560, margin: "0 auto", lineHeight: 1.8 }}>
            From first lines of code to building AI-powered products — every experience has shaped who I am as a developer.
          </p>
        </motion.div>

        {/* Timeline */}
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}>
          {/* Vertical line */}
          <div
            style={{
              position: "absolute",
              left: 32,
              top: 0,
              bottom: 0,
              width: 2,
              background: "linear-gradient(to bottom, var(--accent-blue), var(--accent-purple), transparent)",
              opacity: 0.3,
            }}
          />

          {experiences.map((exp, i) => {
            const Icon = iconMap[exp.icon] ?? Briefcase;
            const color = typeColor[exp.type] ?? "var(--accent-blue)";
            const bg = typeBg[exp.type] ?? "rgba(59,130,246,0.1)";

            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  paddingLeft: "1rem",
                  marginBottom: "2rem",
                  position: "relative",
                }}
              >
                {/* Icon node */}
                <div
                  style={{
                    flexShrink: 0,
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: bg,
                    border: `2px solid ${color}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    zIndex: 1,
                    boxShadow: `0 0 20px ${color}20`,
                  }}
                >
                  <Icon size={20} color={color} />
                </div>

                {/* Content */}
                <motion.div
                  whileHover={{ y: -2 }}
                  style={{
                    flex: 1,
                    padding: "1.5rem",
                    borderRadius: 16,
                    background: "var(--glass-bg)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid var(--glass-border)",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = `${color}40`;
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 10px 40px ${color}10`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "var(--glass-border)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
                    <div>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)" }}>{exp.title}</h3>
                      <p style={{ fontSize: "0.85rem", fontWeight: 600, color }}>
                        {exp.organization}
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      <Clock size={12} />
                      {exp.period}
                    </div>
                  </div>

                  {/* Type badge */}
                  <span
                    style={{
                      display: "inline-block",
                      padding: "0.2rem 0.7rem",
                      borderRadius: 9999,
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      background: bg,
                      border: `1px solid ${color}30`,
                      color,
                      marginBottom: "0.75rem",
                    }}
                  >
                    {exp.type}
                  </span>

                  <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.8, marginBottom: "1rem" }}>
                    {exp.description}
                  </p>

                  {/* Skills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                    {exp.skills.map((skill) => (
                      <span
                        key={skill}
                        style={{
                          padding: "0.2rem 0.6rem",
                          borderRadius: 9999,
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          background: "var(--bg-tertiary)",
                          color: "var(--text-muted)",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
