"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects, type Project } from "@/data/projects";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { MaskLines, Rv, SecHead } from "@/components/ui/Reveal";

const ACCENTS = ["#22d3ee", "#ef233c", "#f5b83d", "#8b5cf6", "#22c55e", "#3b82f6", "#ff7a59"];
const GAP_VW = 4;
const PANEL_VW = 54;
const PANEL_VW_MOBILE = 86;

// Rounded so server and client render identical SVG coordinates.
const r2 = (v: number) => Math.round(v * 100) / 100;

function MissionViz({ index, color }: { index: number; color: string }) {
  const rings = [18, 32, 46, 60, 74];
  const ticks = Array.from({ length: 72 }, (_, i) => (i / 72) * Math.PI * 2);
  return (
    <svg viewBox="-100 -100 200 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <g stroke={color} fill="none" strokeWidth="0.35" opacity="0.65">
        {ticks.map((a, i) => (
          <line
            key={i}
            x1={r2(Math.cos(a) * 76)}
            y1={r2(Math.sin(a) * 76)}
            x2={r2(Math.cos(a) * (i % 6 === 0 ? 86 : 80))}
            y2={r2(Math.sin(a) * (i % 6 === 0 ? 86 : 80))}
          />
        ))}
        <line x1="0" y1="0" x2="74" y2="0" strokeWidth="0.9" opacity="0.9">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="6s" repeatCount="indefinite" />
        </line>
        {rings.map((r) => (
          <circle key={r} r={r} strokeDasharray={r % 2 === 0 ? "2 3" : undefined} />
        ))}
      </g>
      <circle r="5" fill={color} opacity="0.9" />
      <circle r="12" fill="none" stroke={color} strokeWidth="0.6" />
      <text x="-92" y="-84" fill={color} fontSize="6" fontFamily="monospace" letterSpacing="2">
        PROJECT {String(index + 1).padStart(2, "0")}
      </text>
    </svg>
  );
}

function Mission({ p, index, color }: { p: Project; index: number; color: string }) {
  return (
    <article className="mission panel" aria-label={p.title}>
      <div>
        <span className="eyebrow" style={{ color }}>
          {String(index + 1).padStart(2, "0")} · {p.category}
        </span>
        <h3>{p.title}</h3>
        <p className="body-copy">{p.description}</p>
        <ul>
          {p.features.slice(0, 3).map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "1.2rem" }}>
          {p.tech.slice(0, 5).map((t) => (
            <span className="chip" key={t}>
              {t}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.7rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
          {p.github && (
            <a className="btn-line" href={p.github} target="_blank" rel="noopener noreferrer">
              <GithubIcon size={14} /> Code
            </a>
          )}
          {p.live && (
            <a className="btn-line solid" href={p.live} target="_blank" rel="noopener noreferrer">
              {p.liveLabel ?? "Live"} <ArrowUpRight size={14} />
            </a>
          )}
        </div>
      </div>
      <div className="mission-viz" aria-hidden>
        <MissionViz index={index} color={color} />
        <span className="big">{String(index + 1).padStart(2, "0")}</span>
      </div>
    </article>
  );
}

/**
 * Pinned horizontal gallery: the page keeps scrolling vertically while the
 * missions slide past sideways, like a camera tracking along a wall.
 */
export default function MissionsChapter() {
  const ref = useRef<HTMLElement>(null);
  const n = projects.length;
  const [pw, setPw] = useState(PANEL_VW);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fit = () => setPw(window.innerWidth < 900 ? PANEL_VW_MOBILE : PANEL_VW);
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const travel = n * pw + (n - 1) * GAP_VW + 8 - 100;
  const x = useTransform(scrollYProgress, [0.04, 0.96], ["0vw", `-${travel}vw`]);
  const bar = useTransform(scrollYProgress, [0.04, 0.96], [0, 1]);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(n - 1, Math.max(0, Math.round(((v - 0.04) / 0.92) * (n - 1))));
    setCurrent((c) => (c === i ? c : i));
  });

  return (
    <section className="missions" id="projects" ref={ref} style={{ height: `${100 + n * 78}vh` }}>
      <div className="missions-stick">
        <div className="missions-head">
          <SecHead num="03" label="Projects" right={`${n} archived`} />
          <MaskLines className="h-sec" lines={[<>Things I&apos;ve <em>built.</em></>]} />
        </div>
        <motion.div className="missions-track" style={{ x, ["--pw" as string]: `${pw}vw` }}>
          {projects.map((p, i) => (
            <Mission key={p.id} p={p} index={i} color={ACCENTS[i % ACCENTS.length]} />
          ))}
        </motion.div>
        <Rv>
          <div className="missions-meter">
            <span>
              {String(current + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </span>
            <span className="bar">
              <motion.i style={{ scaleX: bar }} />
            </span>
            <span>Keep scrolling</span>
          </div>
        </Rv>
      </div>
    </section>
  );
}
