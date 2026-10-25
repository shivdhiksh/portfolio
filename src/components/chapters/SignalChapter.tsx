"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight, GitFork, Star } from "lucide-react";
import { MaskLines, Rv, SecHead } from "@/components/ui/Reveal";

const USERNAME = "shivdhiksh";

interface GitHubUser {
  public_repos: number;
  followers: number;
  following: number;
  public_gists: number;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
}

const LANG_COLORS: Record<string, string> = {
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Java: "#b07219",
  HTML: "#e34c26",
  CSS: "#563d7c",
  C: "#8a8a8a",
  "Jupyter Notebook": "#DA5B0B",
};

export default function SignalChapter() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "offline">("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [u, r] = await Promise.all([
          fetch(`https://api.github.com/users/${USERNAME}`),
          fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=6`),
        ]);
        if (!u.ok || !r.ok) throw new Error("GitHub API unavailable");
        const [userData, repoData] = await Promise.all([u.json(), r.json()]);
        if (cancelled) return;
        setUser(userData);
        setRepos(Array.isArray(repoData) ? repoData : []);
        setState("ready");
      } catch {
        if (!cancelled) setState("offline");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = [
    { l: "Repositories", v: user?.public_repos },
    { l: "Followers", v: user?.followers },
    { l: "Following", v: user?.following },
    { l: "Gists", v: user?.public_gists },
  ];

  return (
    <section className="chapter" id="signal">
      <div className="ghost-num" aria-hidden>05</div>
      <div className="chapter-inner">
        <SecHead num="05" label="GitHub" right="Live data" />
        <MaskLines className="h-sec" lines={["Commits", <>don&apos;t <em>lie.</em></>]} />

        <Rv>
          <div className="stats">
            {stats.map((s) => (
              <div className="stat" key={s.l}>
                <b>{s.v ?? "—"}</b>
                <span>{s.l}</span>
              </div>
            ))}
          </div>
        </Rv>

        <div style={{ marginTop: "2.4rem" }}>
          {state === "loading" && <p className="mono" style={{ color: "var(--muted)" }}>Pulling telemetry…</p>}
          {state === "offline" && (
            <p className="body-copy">
              GitHub didn&apos;t answer just now.{" "}
              <a href={`https://github.com/${USERNAME}`} style={{ color: "var(--cyan)" }} target="_blank" rel="noopener noreferrer">
                Open the profile directly →
              </a>
            </p>
          )}
          {repos.map((r, i) => (
            <Rv key={r.id} delay={i * 0.05} y={14}>
              <a className="repo" href={r.html_url} target="_blank" rel="noopener noreferrer">
                <div>
                  <h4>{r.name}</h4>
                  {r.description && <p>{r.description}</p>}
                </div>
                <div className="meta">
                  {r.language && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <i style={{ width: 8, height: 8, borderRadius: "50%", background: LANG_COLORS[r.language] ?? "#94a3b8" }} />
                      {r.language}
                    </span>
                  )}
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <Star size={12} /> {r.stargazers_count}
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <GitFork size={12} /> {r.forks_count}
                  </span>
                  <ArrowUpRight size={14} />
                </div>
              </a>
            </Rv>
          ))}
        </div>
      </div>
    </section>
  );
}
