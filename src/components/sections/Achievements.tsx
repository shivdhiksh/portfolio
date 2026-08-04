"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { achievements } from "@/data/achievements";
import { Trophy, Code2, Award, GitBranch, Star } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";

const iconMap: Record<string, React.ElementType> = {
  Trophy, Code2, Award, GitBranch, Star, Github: GithubIcon,
};

export default function Achievements() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="achievements" style={{ background: "var(--bg-primary)", padding: "6rem 0" }}>
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <span className="section-tag">
            <Trophy size={12} />
            Achievements
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
            Recognition & <span className="gradient-text">Awards</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: 560, margin: "0 auto", lineHeight: 1.8 }}>
            Milestones that mark the journey — from hackathon victories to open-source contributions.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {achievements.map((ach, i) => {
            const Icon = iconMap[ach.icon] ?? Trophy;

            // Extract actual colors
            const colorMap: Record<string, [string, string]> = {
              "from-yellow-400 to-orange-500": ["#facc15", "#f97316"],
              "from-blue-400 to-cyan-500": ["#60a5fa", "#06b6d4"],
              "from-purple-400 to-pink-500": ["#c084fc", "#ec4899"],
              "from-green-400 to-emerald-500": ["#4ade80", "#10b981"],
              "from-red-400 to-rose-500": ["#f87171", "#f43f5e"],
              "from-slate-400 to-gray-500": ["#94a3b8", "#6b7280"],
            };
            const [c1, c2] = colorMap[ach.color] ?? ["#3b82f6", "#8b5cf6"];

            return (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                whileHover={{ y: -4, scale: 1.02 }}
                style={{
                  padding: "1.5rem",
                  borderRadius: 20,
                  background: "var(--glass-bg)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid var(--glass-border)",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${c1}40`;
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 60px ${c1}15`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--glass-border)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                {/* Background glow */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${c1}15, transparent 70%)`,
                    pointerEvents: "none",
                  }}
                />

                {/* Icon */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: `linear-gradient(135deg, ${c1}, ${c2})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                    boxShadow: `0 0 20px ${c1}30`,
                  }}
                >
                  <Icon size={22} color="white" />
                </div>

                {/* Year badge */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.3, flex: 1 }}>
                    {ach.title}
                  </h3>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: c1,
                      background: `${c1}15`,
                      padding: "0.2rem 0.6rem",
                      borderRadius: 9999,
                      whiteSpace: "nowrap",
                      marginLeft: "0.5rem",
                    }}
                  >
                    {ach.year}
                  </span>
                </div>

                <p style={{ color: "var(--text-secondary)", fontSize: "0.83rem", lineHeight: 1.7 }}>
                  {ach.description}
                </p>

                {/* Category tag */}
                <div style={{ marginTop: "1rem" }}>
                  <span
                    style={{
                      padding: "0.2rem 0.7rem",
                      borderRadius: 9999,
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      background: `${c1}10`,
                      border: `1px solid ${c1}25`,
                      color: c1,
                    }}
                  >
                    {ach.category}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
