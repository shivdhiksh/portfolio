"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Download, Eye, ExternalLink, FileText } from "lucide-react";

export default function Resume() {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section id="resume" style={{ background: "var(--section-scrim)", padding: "6rem 0" }}>
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <span className="section-tag">
            <FileText size={12} />
            Resume
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
            My <span className="gradient-text">Resume</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto", lineHeight: 1.8 }}>
            A comprehensive overview of my skills, experience, and achievements. Available for download or preview.
          </p>
        </motion.div>

        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {/* Resume card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              padding: "2.5rem",
              borderRadius: 24,
              background: "var(--glass-bg)",
              backdropFilter: "blur(30px)",
              border: "1px solid var(--glass-border)",
              boxShadow: "0 20px 80px rgba(0,0,0,0.2)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background accent */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 300,
                height: 300,
                background: "radial-gradient(circle, rgba(59,130,246,0.08), transparent 70%)",
                pointerEvents: "none",
              }}
            />

            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
              {/* Icon */}
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 18,
                  background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 30px rgba(59,130,246,0.4)",
                }}
              >
                <FileText size={28} color="white" />
              </div>
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)" }}>
                  Shiva Dhikshith Koppu
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                  AI Developer · Full Stack Developer · ML Enthusiast
                </p>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
                  {["Python", "React", "ML/AI", "Node.js"].map((skill) => (
                    <span
                      key={skill}
                      style={{
                        padding: "0.15rem 0.6rem",
                        borderRadius: 9999,
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        background: "rgba(59,130,246,0.1)",
                        border: "1px solid rgba(59,130,246,0.2)",
                        color: "var(--accent-blue)",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Info grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              {[
                { label: "Projects", value: "10+ Built" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    padding: "1rem",
                    borderRadius: 12,
                    background: "rgba(59,130,246,0.04)",
                    border: "1px solid rgba(59,130,246,0.1)",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginTop: 4 }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <motion.a
                href="/resume"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Download size={16} />
                Download PDF
              </motion.a>

              <motion.a
                href="/resume"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glass"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Eye size={16} />
                Preview
              </motion.a>

              <motion.a
                href="/resume"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glass"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <ExternalLink size={16} />
                Open
              </motion.a>
            </div>

            {/* Note */}
            <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "1.5rem" }}>
              💡 Tip: If the PDF doesn&apos;t open automatically, please check your browser&apos;s pop-up settings.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
