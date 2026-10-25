"use client";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import LoadingScreen from "@/components/ui/LoadingScreen";
import AnimatedCursor from "@/components/ui/AnimatedCursor";
import ScrollProgress from "@/components/ui/ScrollProgress";
import FloatingSocialDock from "@/components/ui/FloatingSocialDock";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Resume from "@/components/sections/Resume";

import Achievements from "@/components/sections/Achievements";
import GitHub from "@/components/sections/GitHub";
import Contact from "@/components/sections/Contact";
import Testimonials from "@/components/sections/Testimonials";
import Blog from "@/components/sections/Blog";
import Chapter from "@/components/ui/Chapter";
import DepthScroll from "@/components/ui/DepthScroll";

// Both read window/scroll geometry on mount, so they only render on the client.
const SpidyBackdrop = dynamic(() => import("@/components/ui/SpidyBackdrop"), { ssr: false });
const SpidyAssistant = dynamic(() => import("@/components/ui/SpidyAssistant"), { ssr: false });

function MouseSpotlight() {
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);
  return null;
}

function EasterEgg() {
  useEffect(() => {
    const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let idx = 0;
    const handler = (e: KeyboardEvent) => {
      if (e.key === KONAMI[idx]) {
        idx++;
        if (idx === KONAMI.length) {
          idx = 0;
          // Easter egg: rainbow flash
          document.body.style.animation = "none";
          const div = document.createElement("div");
          div.style.cssText = `
            position:fixed;inset:0;z-index:99998;
            background:linear-gradient(135deg,#ff0080,#ff8c00,#40e0d0,#0080ff,#ff0080);
            background-size:400% 400%;
            animation:gradient-xy 1s ease infinite;
            opacity:0.15;pointer-events:none;
          `;
          document.body.appendChild(div);
          setTimeout(() => div.remove(), 2000);
          alert("🎉 You found the Easter Egg! Welcome to the club. 🚀");
        }
      } else {
        idx = 0;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  return null;
}

export default function Home() {
  return (
    <ThemeProvider>
      <LoadingScreen />
      <SpidyBackdrop />
      <AnimatedCursor />
      <ScrollProgress />
      <MouseSpotlight />
      <EasterEgg />
      <FloatingSocialDock />
      <SpidyAssistant />
      <DepthScroll />
      <Navbar />
      <main className="site-main">
        <Hero />
        <Chapter number="02" label="About"><About /></Chapter>
        <Chapter number="03" label="Skills"><Skills /></Chapter>
        <Chapter number="04" label="Projects"><Projects /></Chapter>
        <Chapter number="05" label="Resume"><Resume /></Chapter>
        <Chapter number="06" label="Achievements"><Achievements /></Chapter>
        <Chapter number="07" label="GitHub"><GitHub /></Chapter>
        <Chapter number="08" label="Contact"><Contact /></Chapter>
        <Chapter number="09" label="Testimonials"><Testimonials /></Chapter>
        <Chapter number="10" label="Blog"><Blog /></Chapter>
      </main>
      <Footer />
    </ThemeProvider>
  );
}
