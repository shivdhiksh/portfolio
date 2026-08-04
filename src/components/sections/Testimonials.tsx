"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Alex Chen",
    role: "CTO, AI Startup",
    avatar: "AC",
    color: "#3b82f6",
    text: "Shiva's ability to bridge complex ML concepts with clean, production-ready code is exceptional. He shipped our AI recommendation engine ahead of schedule.",
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Product Manager, Tech Corp",
    avatar: "PS",
    color: "#8b5cf6",
    text: "Working with Shiva was a pleasure. He not only solved the technical challenges but also brought creative ideas that significantly improved our product.",
  },
  {
    id: 3,
    name: "Marcus Johnson",
    role: "Lead Developer",
    avatar: "MJ",
    color: "#06b6d4",
    text: "Rare to find someone who excels at both frontend polish and deep ML work. Shiva delivers quality that speaks for itself.",
  },
];

export default function Testimonials() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="testimonials" style={{ background: "var(--bg-secondary)", padding: "6rem 0" }}>
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <span className="section-tag">
            <Quote size={12} />
            Testimonials
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
            What People <span className="gradient-text">Say</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto", lineHeight: 1.8 }}>
            Feedback from collaborators, clients, and teammates.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -4 }}
              style={{
                padding: "1.75rem",
                borderRadius: 20,
                background: "var(--glass-bg)",
                backdropFilter: "blur(20px)",
                border: "1px solid var(--glass-border)",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = `${t.color}40`;
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 60px ${t.color}10`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--glass-border)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              {/* Quote icon */}
              <div style={{ position: "absolute", top: "1rem", right: "1.25rem", opacity: 0.1 }}>
                <Quote size={48} color={t.color} />
              </div>

              <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "0.9rem", marginBottom: "1.5rem", fontStyle: "italic" }}>
                &quot;{t.text}&quot;
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${t.color}, ${t.color}80)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    color: "white",
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.9rem" }}>{t.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
