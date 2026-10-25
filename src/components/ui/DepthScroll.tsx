"use client";
import { useEffect } from "react";

const PERSPECTIVE = "1300px";

const clamp = (v: number) => Math.min(1, Math.max(0, v));

/** Rounded, filled boxes at least card-sized: the "containers" that should recede. */
function isCard(el: HTMLElement) {
  if (el.closest(".chapter-label")) return false;
  const r = el.getBoundingClientRect();
  if (r.width < 160 || r.height < 70) return false;
  const cs = getComputedStyle(el);
  if (parseFloat(cs.borderTopLeftRadius) < 14) return false;
  return cs.backgroundColor !== "rgba(0, 0, 0, 0)" || cs.backgroundImage !== "none";
}

function findTargets(): HTMLElement[] {
  const found = new Set<HTMLElement>();
  document.querySelectorAll<HTMLElement>(".site-main h2").forEach((h) => found.add(h));
  document.querySelectorAll<HTMLElement>(".site-main div, .site-main article").forEach((el) => {
    if (isCard(el)) found.add(el);
  });
  // Keep only outermost matches so nested cards don't compound their tilt.
  return [...found].filter((el) => {
    for (let p = el.parentElement; p; p = p.parentElement) if (found.has(p)) return false;
    return true;
  });
}

/**
 * Cards and headings recede into the page as they leave the top of the screen
 * (tilting back, shrinking, dimming) and rise into place as they arrive from below.
 * Uses the individual CSS transform properties so it composes with the existing
 * framer-motion and hover transforms instead of fighting them.
 */
export default function DepthScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let targets: HTMLElement[] = [];
    let raf = 0;
    let rescan = 0;

    const apply = () => {
      raf = 0;
      const vh = window.innerHeight;
      const rects = targets.map((el) => el.getBoundingClientRect());

      targets.forEach((el, i) => {
        const r = rects[i];
        if (r.bottom < -vh || r.top > vh * 2) return;

        // Tall blocks are judged by their top edge so they don't collapse while still being read.
        const anchor = r.height > vh * 0.7 ? r.top + vh * 0.35 : r.top + r.height / 2;
        const out = clamp((vh * 0.35 - anchor) / (vh * 0.7));
        const into = clamp((anchor - vh * 0.7) / (vh * 0.5));

        if (!el.dataset.depth) {
          el.dataset.depth = "1";
          el.style.transformOrigin = "50% 100%";
          el.style.willChange = "scale, rotate, translate";
          if (el.parentElement) el.parentElement.style.perspective = PERSPECTIVE;
        }
        el.style.scale = String(1 - out * 0.16 - into * 0.06);
        el.style.rotate = `1 0 0 ${(out * 16).toFixed(2)}deg`;
        el.style.translate = `0 ${(into * 28 - out * 18).toFixed(1)}px`;
        el.style.filter = out > 0.02 ? `brightness(${(1 - out * 0.6).toFixed(3)})` : "";
      });
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const scan = () => {
      targets = findTargets();
      schedule();
    };

    // Content mounts and re-renders (tabs, filters), so rescan whenever the DOM settles.
    const observer = new MutationObserver(() => {
      window.clearTimeout(rescan);
      rescan = window.setTimeout(scan, 400);
    });
    observer.observe(document.querySelector(".site-main") ?? document.body, { childList: true, subtree: true });
    rescan = window.setTimeout(scan, 600);

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      observer.disconnect();
      window.clearTimeout(rescan);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
