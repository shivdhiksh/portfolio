"use client";
import { ArrowUp, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { goToChapter } from "@/lib/nav";

const SOCIALS = [
  { icon: GithubIcon, href: "https://github.com/shivdhiksh", label: "GitHub" },
  { icon: LinkedinIcon, href: "https://linkedin.com/in/shivdhiksh", label: "LinkedIn" },
  { icon: Mail, href: "mailto:koppu.shivadhikshith@gmail.com", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="site-foot">
      <div className="site-foot-inner">
        <span suppressHydrationWarning>© {new Date().getFullYear()} Shiva Dhikshith Koppu</span>
        <span style={{ display: "flex", gap: "1rem" }}>
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer" style={{ color: "var(--bone-dim)" }}>
              <s.icon size={16} />
            </a>
          ))}
        </span>
        <button onClick={() => goToChapter("home")} style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
          Back to the gate <ArrowUp size={14} />
        </button>
      </div>
    </footer>
  );
}
