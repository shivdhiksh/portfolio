"use client";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Rv, MaskLines } from "@/components/ui/Reveal";
import { goToChapter } from "@/lib/nav";
import { useEntered } from "@/hooks/useEntered";

const ROLES = ["AI Developer", "Full Stack Engineer", "ML Enthusiast", "Problem Solver"];

function useTypewriter(words: string[]) {
  const [text, setText] = useState("");
  const [word, setWord] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[word % words.length];
    const id = setTimeout(
      () => {
        if (!deleting) {
          setText(current.slice(0, text.length + 1));
          if (text.length + 1 === current.length) setTimeout(() => setDeleting(true), 1600);
        } else {
          setText(current.slice(0, text.length - 1));
          if (text.length - 1 === 0) {
            setDeleting(false);
            setWord((w) => w + 1);
          }
        }
      },
      deleting ? 40 : 90
    );
    return () => clearTimeout(id);
  }, [text, deleting, word, words]);

  return text;
}

const CHIPS = [
  { id: "about", num: "01", title: "About", text: "The engineer behind the agent." },
  { id: "skills", num: "02", title: "Skills", text: "Web, mobile, desktop and AI." },
  { id: "projects", num: "03", title: "Projects", text: "What I've built and shipped." },
  { id: "contact", num: "04", title: "Contact", text: "Let's talk about your next idea." },
];

export default function HeroChapter() {
  const role = useTypewriter(ROLES);
  const entered = useEntered();
  const { scrollY } = useScroll();
  const copyY = useTransform(scrollY, [0, 700], [0, 160]);
  const copyOpacity = useTransform(scrollY, [0, 520], [1, 0]);

  return (
    <section className="hero" id="home">
      <motion.div style={{ y: copyY, opacity: copyOpacity, position: "relative", zIndex: 3 }}>
        <Rv className="eyebrow" y={10} when={entered}>
          <span className="dot" /> Portfolio · Introduction
        </Rv>
        <MaskLines
          as="h1"
          className="h-hero"
          delay={0.2}
          when={entered}
          lines={["Shiva Dhikshith", <><em>Koppu.</em></>]}
        />
        <Rv delay={0.7} className="hero-sub" when={entered}>
          <p className="lead">
            AI developer and full-stack engineer. I build intelligent systems and the software around them, from
            machine-learning models to products that ship.
          </p>
          <p className="mono" style={{ marginTop: "1.2rem", color: "var(--cyan)", fontSize: "0.95rem", minHeight: "1.6em" }}>
            {">"} {role}
            <span className="spidy-caret" />
          </p>
          <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", marginTop: "1.8rem" }}>
            <button className="btn-line solid" onClick={() => goToChapter("projects")}>
              View projects
            </button>
            <a className="btn-line" href="/resume" target="_blank" rel="noopener noreferrer">
              Résumé
            </a>
            <button className="btn-line" onClick={() => goToChapter("contact")}>
              Contact
            </button>
          </div>
        </Rv>
      </motion.div>

      <div className="hero-spacer" />

      <div className="hero-foot">
        <Rv className="hero-cue" y={0} delay={1.1} when={entered}>
          <span>Scroll to enter</span>
          <span className="track">
            <i />
          </span>
        </Rv>
        <div className="chips">
          {CHIPS.map((c, i) => (
            <Rv key={c.id} delay={1 + i * 0.08} y={20} when={entered}>
              <button className="chip-card" onClick={() => goToChapter(c.id)} style={{ width: "100%" }}>
                <span className="num">{c.num}</span>
                <span>
                  <b>{c.title}</b>
                  <p>{c.text}</p>
                </span>
              </button>
            </Rv>
          ))}
        </div>
      </div>

      <div className="hero-side" aria-hidden>
        AI · Full Stack · ML
      </div>
    </section>
  );
}
