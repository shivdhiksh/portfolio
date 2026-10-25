"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { experiences } from "@/data/experience";
import { certifications } from "@/data/certifications";
import { MaskLines, Rv, SecHead } from "@/components/ui/Reveal";

export default function JourneyChapter() {
  const lineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: lineRef, offset: ["start 75%", "end 55%"] });
  const grow = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="chapter" id="journey">
      <div className="ghost-num" aria-hidden>04</div>
      <div className="chapter-inner">
        <SecHead num="04" label="Experience" right="Work & certifications" />
        <MaskLines className="h-sec" lines={["Where I've", <>worked &amp; <em>learned.</em></>]} />

        <div className="journey-grid" style={{ marginTop: "2.4rem" }}>
          <div>
            <Rv>
              <span className="eyebrow">
                <span className="dot" /> Work experience
              </span>
            </Rv>
            <div className="timeline" ref={lineRef}>
              <div className="timeline-line">
                <motion.i style={{ scaleY: grow }} />
              </div>
              {experiences.map((e) => (
                <Rv key={e.id} className="tl-item">
                  <span className="when">{e.period}</span>
                  <h4>{e.title}</h4>
                  <p className="org">
                    {e.organization} · {e.location}
                  </p>
                  <ul className="tl-bullets">
                    {e.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </Rv>
              ))}
            </div>
          </div>

          <div>
            <Rv>
              <span className="eyebrow">
                <span className="dot" /> Certifications
              </span>
            </Rv>
            <div style={{ marginTop: "1rem" }}>
              {certifications.map((c, i) => (
                <Rv className="ach cert" key={c.id} delay={i * 0.05} y={16}>
                  <span className="yr">{c.date}</span>
                  <div>
                    <h5>{c.title}</h5>
                    <p>{c.issuer}</p>
                  </div>
                </Rv>
              ))}
            </div>

            <Rv delay={0.1}>
              <div className="panel" style={{ padding: "1.2rem 1.4rem", marginTop: "1.4rem" }}>
                <p className="lead" style={{ fontSize: "1rem" }}>
                  Want the whole story on one page?
                </p>
                <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap", marginTop: "0.9rem" }}>
                  <a className="btn-line solid" href="/resume" target="_blank" rel="noopener noreferrer">
                    Open résumé <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            </Rv>
          </div>
        </div>
      </div>
    </section>
  );
}
