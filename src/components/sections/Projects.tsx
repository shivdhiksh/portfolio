"use client";
import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { projects, Project } from "@/data/projects";
import { ExternalLink, X, Star, Search, Filter } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";

const categories = ["All", "AI / ML", "NLP", "Computer Vision", "Full Stack"];

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 5000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(10px)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 40 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 640,
          width: "100%",
          background: "var(--bg-secondary)",
          border: "1px solid var(--glass-border)",
          borderRadius: 24,
          padding: "2rem",
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1px solid var(--glass-border)",
            background: "var(--glass-bg)",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <X size={16} />
        </button>

        {/* Badge */}
        {project.featured && (
          <div style={{ display: "flex", marginBottom: "1rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                padding: "0.3rem 0.8rem",
                borderRadius: 9999,
                fontSize: "0.7rem",
                fontWeight: 700,
                background: "rgba(251,191,36,0.1)",
                border: "1px solid rgba(251,191,36,0.3)",
                color: "#f59e0b",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              <Star size={10} fill="currentColor" /> Featured
            </span>
          </div>
        )}

        <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
          {project.title}
        </h3>
        <p style={{ color: "var(--accent-blue)", fontSize: "0.8rem", fontWeight: 600, marginBottom: "1rem" }}>
          {project.category}
        </p>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
          {project.longDescription}
        </p>

        {/* Features */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.75rem" }}>
            Key Features
          </h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {project.features.map((f) => (
              <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--accent-blue)", marginTop: 2 }}>▸</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Tech stack */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.75rem" }}>
            Tech Stack
          </h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {project.tech.map((t) => (
              <span
                key={t}
                style={{
                  padding: "0.25rem 0.75rem",
                  borderRadius: 9999,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  background: "rgba(59,130,246,0.1)",
                  border: "1px solid rgba(59,130,246,0.2)",
                  color: "var(--accent-blue)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: "0.85rem" }}>
            <GithubIcon size={15} /> View Code
          </a>
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn-glass" style={{ fontSize: "0.85rem" }}>
              <ExternalLink size={15} /> Live Demo
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [ref, inView] = useInView({ threshold: 0.05, triggerOnce: true });

  const filtered = projects.filter((p) => {
    const matchCat = activeFilter === "All" || p.category === activeFilter;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.tech.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <section id="projects" style={{ background: "var(--section-scrim)", padding: "6rem 0" }}>
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <span className="section-tag">
            <Filter size={12} />
            Portfolio
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
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: 560, margin: "0 auto 2rem", lineHeight: 1.8 }}>
            A showcase of AI-powered applications, full-stack products, and creative problem solving.
          </p>

          {/* Search */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 1.2rem",
                borderRadius: 9999,
                background: "var(--glass-bg)",
                backdropFilter: "blur(20px)",
                border: "1px solid var(--glass-border)",
                maxWidth: 320,
                width: "100%",
              }}
            >
              <Search size={15} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search projects or tech..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "var(--text-primary)",
                  fontSize: "0.85rem",
                  width: "100%",
                }}
              />
            </div>
          </div>

          {/* Filter buttons */}
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: "0.4rem 1rem",
                  borderRadius: 9999,
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  border: "1px solid",
                  borderColor: activeFilter === cat ? "rgba(59,130,246,0.5)" : "var(--glass-border)",
                  background: activeFilter === cat ? "rgba(59,130,246,0.1)" : "transparent",
                  color: activeFilter === cat ? "var(--accent-blue)" : "var(--text-muted)",
                  transition: "all 0.2s",
                }}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Projects grid */}
        <motion.div
          layout
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <AnimatePresence>
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                <TiltCard>
                  <motion.div
                    whileHover={{ y: -4 }}
                    onClick={() => setSelectedProject(project)}
                    style={{
                      padding: "1.5rem",
                      borderRadius: 20,
                      background: "var(--glass-bg)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid var(--glass-border)",
                      cursor: "pointer",
                      height: "100%",
                      position: "relative",
                      overflow: "hidden",
                      transition: "border-color 0.3s, box-shadow 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(59,130,246,0.4)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 60px rgba(59,130,246,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = "var(--glass-border)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                    }}
                  >
                    {/* Shimmer on hover */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: "-100%",
                        width: "60%",
                        height: "100%",
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)",
                        transform: "skewX(-15deg)",
                      }}
                    />

                    {/* Featured badge */}
                    {project.featured && (
                      <div style={{ marginBottom: "0.75rem" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            padding: "0.25rem 0.6rem",
                            borderRadius: 9999,
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            background: "rgba(251,191,36,0.1)",
                            border: "1px solid rgba(251,191,36,0.3)",
                            color: "#f59e0b",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          <Star size={8} fill="currentColor" /> Featured
                        </span>
                      </div>
                    )}

                    {/* Project icon placeholder */}
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 14,
                        background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                        marginBottom: "1rem",
                      }}
                    >
                      {project.category === "AI / ML" ? "🤖" : project.category === "NLP" ? "💬" : project.category === "Computer Vision" ? "👁️" : "🚀"}
                    </div>

                    {/* Category */}
                    <p style={{ color: "var(--accent-cyan)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                      {project.category}
                    </p>

                    {/* Title */}
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.75rem", lineHeight: 1.3 }}>
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                      {project.description}
                    </p>

                    {/* Tech stack */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "1.25rem" }}>
                      {project.tech.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          style={{
                            padding: "0.2rem 0.6rem",
                            borderRadius: 9999,
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            background: "rgba(59,130,246,0.08)",
                            border: "1px solid rgba(59,130,246,0.15)",
                            color: "var(--accent-blue)",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                      {project.tech.length > 4 && (
                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", padding: "0.2rem 0" }}>
                          +{project.tech.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: "0.5rem" }} onClick={(e) => e.stopPropagation()}>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          padding: "0.4rem 0.9rem",
                          borderRadius: 9999,
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          background: "var(--glass-bg)",
                          border: "1px solid var(--glass-border)",
                          color: "var(--text-secondary)",
                          transition: "all 0.2s",
                          textDecoration: "none",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.2)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--glass-border)"; }}
                      >
                        <GithubIcon size={12} /> Code
                      </a>
                      <button
                        onClick={() => setSelectedProject(project)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          padding: "0.4rem 0.9rem",
                          borderRadius: 9999,
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
                          border: "none",
                          color: "white",
                          transition: "all 0.2s",
                        }}
                      >
                        Case Study →
                      </button>
                    </div>
                  </motion.div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
            No projects found matching your search.
          </motion.div>
        )}
      </div>

      {/* Project modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
