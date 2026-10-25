"use client";
import Image from "next/image";
import { MaskLines, Rv, SecHead } from "@/components/ui/Reveal";
import { projects } from "@/data/projects";

const PILLARS = [
  { n: "I", title: "AI & Machine Learning", text: "A local AI desktop assistant on Llama 3.2, NLP sentiment analysis, and hands-on data annotation work." },
  { n: "II", title: "Full Stack Development", text: "Web with React, Node and Django, plus an Android app in Kotlin and Windows apps in Python." },
  { n: "III", title: "Problem Solving", text: "Data structures and algorithms as a daily tool, plus a habit of cleaning data before trusting it." },
  { n: "IV", title: "Teamwork", text: "Built ValMentor AI at a hackathon in a two-person team, and collaborated remotely on a web internship." },
];

const STATS = [
  { v: "2", l: "Internships" },
  { v: "4", l: "Certifications" },
  { v: String(projects.length), l: "Projects" },
  { v: "2027", l: "Graduating" },
];

export default function IdentityChapter() {
  return (
    <section className="chapter" id="about">
      <div className="ghost-num" aria-hidden>01</div>
      <div className="chapter-inner">
        <SecHead num="01" label="About" right="Dossier" />

        <div className="id-grid">
          <div>
            <MaskLines
              className="h-sec"
              lines={["Engineer by craft.", <>Explorer by <em>default.</em></>]}
            />
            <Rv delay={0.2} className="text-card" style={{ marginTop: "2rem", maxWidth: "40rem" }}>
              <p className="lead">
                I&apos;m a Computer Science (Data Science) student specializing in Artificial Intelligence, Machine Learning, and
                Full-Stack Development.
              </p>
              <p className="body-copy" style={{ marginTop: "1.2rem" }}>
                I&apos;ve built intelligent applications using Python, Django, NLP, and modern web technologies, with hands-on
                experience delivering collaborative projects in hackathons and internships. I&apos;m enthusiastic about
                creating scalable AI-powered solutions.
              </p>
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginTop: "1.6rem" }}>
                <span className="chip">Hyderabad, India</span>
                <span className="chip">B.Tech CSE (Data Science) · KPRIT</span>
                <span className="chip" style={{ color: "#6ee7a0", borderColor: "rgba(110,231,160,.35)" }}>
                  Status · Open to work
                </span>
              </div>
            </Rv>
          </div>

          <Rv delay={0.15} y={40}>
            <div className="portrait">
              <Image
                src="/profile.jpg"
                alt="Shiva Dhikshith Koppu"
                fill
                sizes="(max-width: 1000px) 90vw, 420px"
                style={{ objectFit: "cover", objectPosition: "top" }}
                priority
              />
            </div>
            <p className="mono" style={{ marginTop: "0.8rem", fontSize: "0.66rem", letterSpacing: "0.2em", color: "var(--muted)" }}>
              SDK-001 // AI DEVELOPER · FULL STACK · ML
            </p>
          </Rv>
        </div>

        <Rv>
          <div className="stats">
            {STATS.map((s) => (
              <div className="stat" key={s.l}>
                <b>{s.v}</b>
                <span>{s.l}</span>
              </div>
            ))}
          </div>
        </Rv>

        <Rv>
          <div className="pillars">
            {PILLARS.map((p) => (
              <div className="pillar" key={p.title}>
                <i>{p.n}</i>
                <h4>{p.title}</h4>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </Rv>
      </div>
    </section>
  );
}
