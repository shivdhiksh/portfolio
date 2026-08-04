"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { BookOpen, Clock, ArrowRight, Tag } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Building Production-Ready ML Pipelines with FastAPI",
    excerpt: "A deep dive into architecting scalable machine learning APIs that can handle real-world traffic while maintaining model accuracy and performance.",
    category: "Machine Learning",
    readTime: "8 min read",
    date: "Coming Soon",
    color: "#3b82f6",
    emoji: "🤖",
  },
  {
    id: 2,
    title: "The Art of Prompt Engineering for LLM Applications",
    excerpt: "Practical techniques for crafting effective prompts that consistently produce high-quality outputs from large language models.",
    category: "AI / NLP",
    readTime: "6 min read",
    date: "Coming Soon",
    color: "#8b5cf6",
    emoji: "💡",
  },
  {
    id: 3,
    title: "Next.js 14 App Router: A Deep Dive",
    excerpt: "Exploring the new paradigms in Next.js 14 App Router — server components, streaming, and the future of React-based web development.",
    category: "Web Development",
    readTime: "10 min read",
    date: "Coming Soon",
    color: "#06b6d4",
    emoji: "⚛️",
  },
];

export default function Blog() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="blog" style={{ background: "var(--bg-primary)", padding: "6rem 0" }}>
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <span className="section-tag">
            <BookOpen size={12} />
            Blog
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
            Thoughts & <span className="gradient-text">Articles</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: 560, margin: "0 auto", lineHeight: 1.8 }}>
            Deep dives into AI, machine learning, and modern web development. Coming soon!
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {blogPosts.map((post, i) => (
            <motion.div
              key={post.id}
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
                cursor: "pointer",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = `${post.color}40`;
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 60px ${post.color}10`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--glass-border)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              {/* Emoji header */}
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{post.emoji}</div>

              {/* Meta */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: post.color,
                    background: `${post.color}15`,
                    padding: "0.2rem 0.6rem",
                    borderRadius: 9999,
                    border: `1px solid ${post.color}25`,
                  }}
                >
                  <Tag size={9} /> {post.category}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  <Clock size={11} /> {post.readTime}
                </span>
              </div>

              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.75rem", lineHeight: 1.4 }}>
                {post.title}
              </h3>

              <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                {post.excerpt}
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontStyle: "italic" }}>{post.date}</span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.8rem", fontWeight: 600, color: post.color }}>
                  Read More <ArrowRight size={13} />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
