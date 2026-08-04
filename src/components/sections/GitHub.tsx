"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Star, GitFork, Users, Code2, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";

interface GitHubUser {
  public_repos: number;
  followers: number;
  following: number;
  public_gists: number;
  name: string;
  bio: string;
  avatar_url: string;
  html_url: string;
  location: string;
  blog: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
  topics: string[];
  updated_at: string;
}

const GITHUB_USERNAME = "shivdhiksh";

const languageColors: Record<string, string> = {
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#2b7489",
  Java: "#b07219",
  HTML: "#e34c26",
  CSS: "#563d7c",
  C: "#555555",
  "Jupyter Notebook": "#DA5B0B",
  default: "#94a3b8",
};

export default function GitHub() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`),
        ]);
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        }
        if (reposRes.ok) {
          const reposData = await reposRes.json();
          setRepos(Array.isArray(reposData) ? reposData : []);
        }
      } catch {
        // Silently fail - show placeholder
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section id="github" style={{ background: "var(--bg-secondary)", padding: "6rem 0" }}>
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <span className="section-tag">
            <GithubIcon size={12} />
            GitHub
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
            Open Source <span className="gradient-text">Activity</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: 560, margin: "0 auto", lineHeight: 1.8 }}>
            Real-time data from my GitHub profile — repositories, contributions, and open-source work.
          </p>
        </motion.div>

        {loading ? (
          <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "3rem" }}>
            <div style={{ display: "inline-block", width: 32, height: 32, borderRadius: "50%", border: "2px solid var(--accent-blue)", borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
            <p style={{ marginTop: "1rem" }}>Fetching GitHub data...</p>
          </div>
        ) : (
          <>
            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "1rem",
                maxWidth: 700,
                margin: "0 auto 3rem",
              }}
            >
              {[
                { label: "Repositories", value: user?.public_repos ?? "—", icon: Code2, color: "var(--accent-blue)" },
                { label: "Followers", value: user?.followers ?? "—", icon: Users, color: "var(--accent-purple)" },
                { label: "Following", value: user?.following ?? "—", icon: GithubIcon, color: "var(--accent-cyan)" },
                { label: "Gists", value: user?.public_gists ?? "—", icon: GitFork, color: "#f59e0b" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -3, scale: 1.03 }}
                  style={{
                    padding: "1.5rem 1rem",
                    borderRadius: 16,
                    background: "var(--glass-bg)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid var(--glass-border)",
                    textAlign: "center",
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${stat.color}40`)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--glass-border)")}
                >
                  <stat.icon size={20} color={stat.color} style={{ margin: "0 auto 0.5rem" }} />
                  <div style={{ fontSize: "1.8rem", fontWeight: 900, color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Repos grid */}
            {repos.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "1rem",
                }}
              >
                {repos.map((repo, i) => (
                  <motion.a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.07, duration: 0.5 }}
                    whileHover={{ y: -3 }}
                    style={{
                      padding: "1.25rem",
                      borderRadius: 16,
                      background: "var(--glass-bg)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid var(--glass-border)",
                      textDecoration: "none",
                      display: "block",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(59,130,246,0.4)";
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 10px 40px rgba(59,130,246,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--glass-border)";
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <GithubIcon size={16} color="var(--text-secondary)" />
                        <span style={{ fontWeight: 700, color: "var(--accent-blue)", fontSize: "0.9rem" }}>
                          {repo.name}
                        </span>
                      </div>
                      <ExternalLink size={13} color="var(--text-muted)" />
                    </div>

                    <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", lineHeight: 1.6, marginBottom: "1rem", minHeight: "2.4rem" }}>
                      {repo.description ?? "No description provided."}
                    </p>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: "1rem" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          <Star size={12} /> {repo.stargazers_count}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          <GitFork size={12} /> {repo.forks_count}
                        </span>
                      </div>
                      {repo.language && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                          <div
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: languageColors[repo.language] ?? languageColors.default,
                            }}
                          />
                          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{repo.language}</span>
                        </div>
                      )}
                    </div>
                  </motion.a>
                ))}
              </div>
            )}

            {/* View all link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
              style={{ textAlign: "center", marginTop: "2rem" }}
            >
              <motion.a
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glass"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{ display: "inline-flex" }}
              >
                <GithubIcon size={16} />
                View All Repositories
              </motion.a>
            </motion.div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}
