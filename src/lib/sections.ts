import { achievements } from "@/data/achievements";
import { projects } from "@/data/projects";
import { skillCategories } from "@/data/skills";

export interface SectionMeta {
  id: string;
  label: string;
  /** Two accent colors the backdrop blends towards while this section is in view. */
  colors: [string, string];
  /** Things Spidy says on arrival. Rotates on repeat visits. */
  lines: string[];
  /** Short facts Spidy shows as chips; derived from the site data where possible. */
  facts: string[];
}

// Order must match the DOM order of the sections in app/page.tsx.
const BASE_SECTIONS: Omit<SectionMeta, "facts">[] = [
  {
    id: "home",
    label: "Home",
    colors: ["#22d3ee", "#ef233c"],
    lines: [
      "Systems online. I'm Spidy, Shiva's autonomous agent. Scroll and I'll guide you through the site.",
      "Back at the entry point. Scan complete, no threats detected.",
    ],
  },
  {
    id: "about",
    label: "About",
    colors: ["#3b82f6", "#22d3ee"],
    lines: [
      "Profile loaded. AI engineer, full stack builder, hackathon addict.",
      "Re-reading the dossier. Still impressive.",
    ],
  },
  {
    id: "skills",
    label: "Skills",
    colors: ["#ef233c", "#3b82f6"],
    lines: [
      "Skill matrix online. Python, ML, React, Next.js and more, all calibrated.",
      "Capabilities re-indexed. Nothing missing.",
    ],
  },
  {
    id: "projects",
    label: "Projects",
    colors: ["#e11d48", "#f59e0b"],
    lines: [
      "Deploying project archive. Every build below shipped for real.",
      "Project archive reloaded. Pick one and dig in.",
    ],
  },
  {
    id: "resume",
    label: "Resume",
    colors: ["#22d3ee", "#3b82f6"],
    lines: [
      "Resume module ready. Want the full file? Grab the download.",
      "Credentials verified.",
    ],
  },
  {
    id: "achievements",
    label: "Achievements",
    colors: ["#f59e0b", "#ef233c"],
    lines: [
      "Trophy room unlocked. Hackathons, certifications, wins.",
      "Achievements tallied again. Still a lot.",
    ],
  },
  {
    id: "github",
    label: "GitHub",
    colors: ["#22c55e", "#22d3ee"],
    lines: [
      "Pulling live repo telemetry. Commits don't lie.",
      "Repo feed refreshed.",
    ],
  },
  {
    id: "contact",
    label: "Contact",
    colors: ["#ef233c", "#22d3ee"],
    lines: [
      "Comms channel open. Send a message and Shiva gets it directly.",
      "Channel still open. No need to be shy.",
    ],
  },
  {
    id: "testimonials",
    label: "Testimonials",
    colors: ["#8b5cf6", "#ef233c"],
    lines: [
      "Incoming transmissions from people who've worked with Shiva.",
      "Reviewing the field reports.",
    ],
  },
  {
    id: "blog",
    label: "Blog",
    colors: ["#3b82f6", "#e11d48"],
    lines: [
      "Final sector: writing and notes. End of scan.",
      "Last stop reached. Want to go back to the top?",
    ],
  },
];

const skillCount = skillCategories.reduce((n, c) => n + c.skills.length, 0);

const FACTS: Record<string, string[]> = {
  home: ["AI Developer", "Full Stack", "ML Enthusiast"],
  about: ["AI & ML", "Full stack", "Hackathons"],
  skills: [`${skillCategories.length} categories`, `${skillCount} skills`],
  projects: [`${projects.length} projects`, `${projects.filter((p) => p.featured).length} featured`],
  resume: ["Full résumé at /resume"],
  achievements: [`${achievements.length} milestones`],
  github: ["Live repo stats"],
  contact: ["Message form", "Social links"],
  testimonials: ["Feedback from collaborators"],
  blog: ["Writing & notes"],
};

export const SECTIONS: SectionMeta[] = BASE_SECTIONS.map((s) => ({ ...s, facts: FACTS[s.id] ?? [] }));

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
 * Fractional index of the section crossing the viewport's vertical midpoint,
 * e.g. 2.4 means 40% of the way from SECTIONS[2] to SECTIONS[3].
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
  const next = tops[idx + 1];
  if (cur === undefined || next === undefined || next === cur) return idx;
  return idx + Math.min(1, Math.max(0, (mid - cur) / (next - cur)));
}
