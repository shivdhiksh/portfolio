"use client";
import { useEffect, useRef } from "react";
import { SECTIONS, getSceneProgress, lerpColor } from "@/lib/sections";

interface Node {
  x: number; // 0..1
  y: number; // 0..1
  z: number; // depth 0.2..1, drives parallax + size
  vx: number;
  vy: number;
}

const rgba = (c: number[], a: number) =>
  `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${a})`;

/**
 * Full-screen scroll-reactive background: a rotating spider web plus a neural
 * node field. Colors and web position blend between sections as you scroll.
 */
export default function SpidyBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    const mouse = { x: -1000, y: -1000 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = w < 768 ? 36 : 80;
      nodes = Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        z: 0.2 + Math.random() * 0.8,
        vx: reduceMotion ? 0 : (Math.random() - 0.5) * 0.00012,
        vy: reduceMotion ? 0 : (Math.random() - 0.5) * 0.00012,
      }));
    };
    resize();

    const onMouse = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse, { passive: true });

    let smooth = getSceneProgress();
    let lastScroll = window.scrollY;
    let spin = 0;
    let raf = 0;

    const drawWeb = (cx: number, cy: number, radius: number, rot: number, color: number[], alpha: number) => {
      const spokes = 16;
      const rings = 10;
      ctx.lineWidth = 1;
      ctx.strokeStyle = rgba(color, alpha * 1.2);
      ctx.beginPath();
      for (let k = 0; k < spokes; k++) {
        const a = rot + (k * Math.PI * 2) / spokes;
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * radius * 1.7, cy + Math.sin(a) * radius * 1.7);
      }
      ctx.stroke();

      ctx.strokeStyle = rgba(color, alpha);
      ctx.beginPath();
      for (let j = 1; j <= rings; j++) {
        const r = radius * Math.pow(j / rings, 1.35);
        for (let k = 0; k < spokes; k++) {
          const a0 = rot + (k * Math.PI * 2) / spokes;
          const a1 = rot + ((k + 1) * Math.PI * 2) / spokes;
          const am = (a0 + a1) / 2;
          // Control point pulled toward the centre gives each strand its sag.
          const cr = r * 0.9;
          ctx.moveTo(cx + Math.cos(a0) * r, cy + Math.sin(a0) * r);
          ctx.quadraticCurveTo(cx + Math.cos(am) * cr, cy + Math.sin(am) * cr, cx + Math.cos(a1) * r, cy + Math.sin(a1) * r);
        }
      }
      ctx.stroke();
    };

    const frame = (time: number) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;

      const scrollY = window.scrollY;
      const velocity = scrollY - lastScroll;
      lastScroll = scrollY;

      smooth += (getSceneProgress() - smooth) * 0.08;
      const i0 = Math.min(SECTIONS.length - 1, Math.floor(smooth));
      const i1 = Math.min(SECTIONS.length - 1, i0 + 1);
      const f = smooth - i0;
      const colA = lerpColor(SECTIONS[i0].colors[0], SECTIONS[i1].colors[0], f);
      const colB = lerpColor(SECTIONS[i0].colors[1], SECTIONS[i1].colors[1], f);
      const light = document.documentElement.classList.contains("light");
      const strength = light ? 0.55 : 1;

      ctx.fillStyle = light ? "#eef2f7" : "#02040a";
      ctx.fillRect(0, 0, w, h);

      // Color glows that drift with scroll position.
      const big = Math.max(w, h);
      const g1x = w * (0.5 + 0.38 * Math.sin(smooth * 0.9));
      const g1y = h * (0.32 + 0.14 * Math.cos(smooth * 0.7));
      const g1 = ctx.createRadialGradient(g1x, g1y, 0, g1x, g1y, big * 0.65);
      g1.addColorStop(0, rgba(colA, 0.26 * strength));
      g1.addColorStop(1, rgba(colA, 0));
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      const g2x = w - g1x * 0.8;
      const g2y = h * (0.78 - 0.12 * Math.sin(smooth * 0.6));
      const g2 = ctx.createRadialGradient(g2x, g2y, 0, g2x, g2y, big * 0.55);
      g2.addColorStop(0, rgba(colB, 0.2 * strength));
      g2.addColorStop(1, rgba(colB, 0));
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      // Spider web: drifts, scales and spins as you move through the page.
      spin += Math.abs(velocity) * 0.0007 * Math.sign(velocity || 1);
      const rot = smooth * 0.4 + spin + (reduceMotion ? 0 : time * 0.00002);
      const webR = big * (0.5 + 0.1 * Math.sin(smooth));
      drawWeb(
        w * (0.5 + 0.32 * Math.cos(smooth * 0.8 + 1)),
        h * (0.45 + 0.12 * Math.sin(smooth * 0.6)),
        webR,
        rot,
        colA,
        0.15 * strength
      );

      // Node field with scroll parallax.
      const pts = nodes.map((n) => {
        n.x = (n.x + n.vx * 16 + 1) % 1;
        n.y = (n.y + n.vy * 16 + 1) % 1;
        const sy = (((n.y * h - scrollY * 0.18 * n.z) % h) + h) % h;
        return { x: n.x * w, y: sy, z: n.z };
      });

      ctx.lineWidth = 0.7;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            ctx.strokeStyle = rgba(colA, 0.22 * (1 - d / 130) * strength);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (md < 190) {
          ctx.strokeStyle = rgba(colB, 0.55 * (1 - md / 190));
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
      for (const p of pts) {
        ctx.fillStyle = rgba(p.z > 0.6 ? colA : colB, 0.35 + p.z * 0.5);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 0.8 + p.z * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Speed streaks when scrolling hard.
      const speed = Math.abs(velocity);
      if (!reduceMotion && speed > 18) {
        ctx.strokeStyle = rgba(colB, Math.min(0.5, speed / 160));
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < 14; i++) {
          const x = (Math.sin(i * 91.7 + Math.floor(time / 90)) * 0.5 + 0.5) * w;
          const y = (Math.sin(i * 47.3 + time / 140) * 0.5 + 0.5) * h;
          ctx.moveTo(x, y);
          ctx.lineTo(x, y - Math.sign(velocity) * Math.min(160, speed * 3));
        }
        ctx.stroke();
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }}
      />
      <div className="hud-overlay" aria-hidden />
    </>
  );
}
