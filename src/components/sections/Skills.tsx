"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { skillCategories } from "@/data/skills";
import { Code2, Globe, Database, Brain, Wrench } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Code2, Globe, Database, Brain, Wrench,
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  const active = skillCategories[activeCategory];

  return (
    <section id="skills" style={{ background: "var(--bg-primary)", padding: "6rem 0" }}>
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <span className="section-tag">
            <Code2 size={12} />
            Technical Skills
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
            My <span className="gradient-text">Tech Stack</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: 560, margin: "0 auto", lineHeight: 1.8 }}>
            A curated collection of technologies I work with daily, from AI/ML frameworks to modern web development tools.
          </p>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "3rem",
          }}
        >
          {skillCategories.map((cat, i) => {
            const Icon = iconMap[cat.icon] ?? Code2;
            return (
              <motion.button
                key={cat.category}
                onClick={() => setActiveCategory(i)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.6rem 1.2rem",
                  borderRadius: 9999,
                  border: "1px solid",
                  borderColor: activeCategory === i ? "rgba(59,130,246,0.5)" : "var(--glass-border)",
                  background: activeCategory === i ? "rgba(59,130,246,0.1)" : "var(--glass-bg)",
                  backdropFilter: "blur(20px)",
                  color: activeCategory === i ? "var(--accent-blue)" : "var(--text-secondary)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                }}
              >
                <Icon size={14} />
                {cat.category}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Skills grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1rem",
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            {active.skills.map((skill, i) => (
              <motion.div
                key={skill.name}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.02, y: -2 }}
                style={{
                  padding: "1.25rem 1.5rem",
                  borderRadius: 16,
                  background: "var(--glass-bg)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid var(--glass-border)",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(59,130,246,0.3)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(59,130,246,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--glass-border)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.95rem" }}>{skill.name}</span>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "var(--accent-blue)",
                      background: "rgba(59,130,246,0.1)",
                      padding: "0.2rem 0.6rem",
                      borderRadius: 9999,
                    }}
                  >
                    {skill.level}%
                  </span>
                </div>
                <div className="progress-bar">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1.2, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Tech cloud */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.7 }}
          style={{ marginTop: "4rem", textAlign: "center" }}
        >
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "1.5rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Also familiar with
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
            {["PyTorch", "Keras", "Scikit-learn", "Pandas", "NumPy", "FastAPI", "GraphQL", "AWS", "Vercel", "Firebase", "Redux", "Tailwind CSS", "Three.js", "D3.js"].map((tech) => (
              <motion.span
                key={tech}
                whileHover={{ scale: 1.1, y: -2 }}
                style={{
                  padding: "0.3rem 0.8rem",
                  borderRadius: 9999,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  background: "var(--glass-bg)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--text-secondary)",
                  transition: "all 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLSpanElement).style.color = "var(--accent-blue)";
                  (e.currentTarget as HTMLSpanElement).style.borderColor = "rgba(59,130,246,0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLSpanElement).style.color = "var(--text-secondary)";
                  (e.currentTarget as HTMLSpanElement).style.borderColor = "var(--glass-border)";
                }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
