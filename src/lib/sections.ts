import { certifications } from "@/data/certifications";
import { experiences } from "@/data/experience";
import { projects } from "@/data/projects";
import { skillCategories } from "@/data/skills";

export interface SectionMeta {
  id: string;
  /** Nav label. */
  label: string;
  /** Chapter title shown in headers and by Spidy. */
  title: string;
  /** Two accent colors the world blends towards while this chapter is in view. */
  colors: [string, string];
  /** Things Spidy says on arrival. Rotates on repeat visits. */
  lines: string[];
  /** Short facts Spidy shows as chips; derived from the site data where possible. */
  facts: string[];
}

const skillCount = skillCategories.reduce((n, c) => n + c.skills.length, 0);

// Order must match the DOM order of the chapters in app/page.tsx.
export const SECTIONS: SectionMeta[] = [
  {
    id: "home",
    label: "Home",
    title: "The Gate",
    colors: ["#22d3ee", "#ef233c"],
    lines: [
      "Hi, I'm Spidy, Shiva's assistant. Scroll and I'll travel with you and point out what matters.",
      "Back at the top. Want a quick tour? Just scroll.",
    ],
    facts: ["AI Developer", "Full Stack", "ML Enthusiast"],
  },
  {
    id: "about",
    label: "About",
    title: "About",
    colors: ["#3b82f6", "#22d3ee"],
    lines: [
      "This is Shiva: who he is, what drives him, and how he works.",
      "Re-reading the dossier. Still impressive.",
    ],
    facts: ["AI & ML", "Full stack", "B.Tech CSE (DS)"],
  },
  {
    id: "skills",
    label: "Skills",
    title: "Skills",
    colors: ["#ef233c", "#3b82f6"],
    lines: [
      "Here are Shiva's skills, grouped by area. They come straight from his résumé and projects.",
      "Capabilities re-indexed. Nothing missing.",
    ],
    facts: [`${skillCategories.length} areas`, `${skillCount} skills`],
  },
  {
    id: "projects",
    label: "Projects",
    title: "Projects",
    colors: ["#e11d48", "#f59e0b"],
    lines: [
      "Projects slide past as you scroll. Fun fact: I'm one of them.",
      "Projects again. Pick one and check the code.",
    ],
    facts: [`${projects.length} projects`],
  },
  {
    id: "journey",
    label: "Experience",
    title: "Experience",
    colors: ["#22d3ee", "#8b5cf6"],
    lines: [
      "Shiva's internships and certifications, with what he actually did in each.",
      "Experience and certifications again. Two internships so far, with more to come.",
    ],
    facts: [`${experiences.length} internships`, `${certifications.length} certifications`],
  },
  {
    id: "signal",
    label: "GitHub",
    title: "GitHub",
    colors: ["#22c55e", "#22d3ee"],
    lines: [
      "Live stats from Shiva's GitHub. Commits don't lie.",
      "GitHub stats refreshed.",
    ],
    facts: ["Live from GitHub"],
  },
  {
    id: "contact",
    label: "Contact",
    title: "Contact",
    colors: ["#ef233c", "#22d3ee"],
    lines: [
      "Want to work together? Send a message and it opens in your email app, ready to send to Shiva.",
      "Still here. No need to be shy.",
    ],
    facts: ["Message form", "Email", "Social links"],
  },
];

export function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function lerpColor(a: string, b: string, t: number): [number, number, number] {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return [ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t];
}

/**
 * Fractional index of the chapter crossing the viewport's vertical midpoint,
 * e.g. 2.4 means 40% of the way from SECTIONS[2] to SECTIONS[3]. Past the last
 * chapter's start it keeps climbing towards SECTIONS.length so the world can
 * continue to the end of the page.
 */
export function getSceneProgress(): number {
  const mid = window.innerHeight * 0.5;
  const tops = SECTIONS.map((s) => document.getElementById(s.id)?.getBoundingClientRect().top);
  let idx = 0;
  for (let i = 0; i < tops.length; i++) {
    const t = tops[i];
    if (t !== undefined && t <= mid) idx = i;
  }
  const cur = tops[idx];
  if (cur === undefined) return idx;
  const next = tops[idx + 1];
  if (next === undefined) {
    // Last chapter: progress runs to the bottom of the document.
    const end = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
    const span = Math.max(1, end + (mid - cur));
    return idx + Math.min(1, Math.max(0, (mid - cur) / span));
  }
  if (next === cur) return idx;
  return idx + Math.min(1, Math.max(0, (mid - cur) / (next - cur)));
}
