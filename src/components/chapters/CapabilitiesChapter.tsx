"use client";
import { skillCategories } from "@/data/skills";
import { MaskLines, Rv, SecHead } from "@/components/ui/Reveal";

const ALL_SKILLS = skillCategories.flatMap((c) => c.skills);

export default function CapabilitiesChapter() {
  return (
    <section className="chapter" id="skills">
      <div className="ghost-num" aria-hidden>02</div>
      <div className="chapter-inner">
        <SecHead num="02" label="Skills" right="By area" />
        <MaskLines className="h-sec" lines={["Web, mobile, desktop,", <>and <em>AI.</em></>]} />

        <div style={{ marginTop: "3.2rem" }}>
          {skillCategories.map((cat, ci) => (
            <div className="cap-row" key={cat.category}>
              <Rv>
                <span className="idx">{String(ci + 1).padStart(2, "0")}</span>
                <h3>{cat.category}</h3>
              </Rv>
              <div className="skill-chips">
                {cat.skills.map((s, i) => (
                  <Rv key={s} delay={i * 0.05} y={12}>
                    <span className="skill-chip">{s}</span>
                  </Rv>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Rv>
          <div className="marquee" aria-label="All skills">
            <div className="marquee-track">
              {[...ALL_SKILLS, ...ALL_SKILLS].map((t, i) => (
                <span key={i}>{t}</span>
              ))}
            </div>
          </div>
        </Rv>
      </div>
    </section>
  );
}
