"use client";
import { SECTIONS } from "@/lib/sections";
import { goToChapter } from "@/lib/nav";
import { useActiveSection } from "@/hooks/useActiveSection";

/** Right-edge chapter rail, like the reference's progress ticks. */
export default function ProgressRail() {
  const active = useActiveSection();
  return (
    <nav className="rail" aria-label="Chapter progress">
      {SECTIONS.map((s, i) => (
        <button key={s.id} className={active === i ? "on" : ""} onClick={() => goToChapter(s.id)} aria-label={s.label}>
          <span>{s.label}</span>
          <i />
        </button>
      ))}
    </nav>
  );
}
