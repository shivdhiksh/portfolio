"use client";
import { useEffect, useRef } from "react";

const POINTS = 1400;
const CORE_POINTS = 150;
const ASSEMBLE_MS = 1800;

interface P {
  tx: number;
  ty: number;
  tz: number;
  sx: number;
  sy: number;
  sz: number;
}

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/** A rotating dot-sphere that assembles from scattered points, with a flickering core cloud. */
export default function IntroSphere({ size = 400 }: { size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const shell: P[] = Array.from({ length: POINTS }, (_, i) => {
      const y = 1 - (2 * (i + 0.5)) / POINTS;
      const r = Math.sqrt(1 - y * y);
      const phi = i * golden;
      const a = Math.random() * Math.PI * 2;
      const b = Math.acos(2 * Math.random() - 1);
      const d = 2.5 + Math.random() * 2;
      return {
        tx: Math.cos(phi) * r,
        ty: y,
        tz: Math.sin(phi) * r,
        sx: Math.sin(b) * Math.cos(a) * d,
        sy: Math.sin(b) * Math.sin(a) * d,
        sz: Math.cos(b) * d,
      };
    });
    const core = Array.from({ length: CORE_POINTS }, () => {
      const a = Math.random() * Math.PI * 2;
      const b = Math.acos(2 * Math.random() - 1);
      const r = Math.cbrt(Math.random()) * 0.34;
      return { x: Math.sin(b) * Math.cos(a) * r, y: Math.sin(b) * Math.sin(a) * r, z: Math.cos(b) * r };
    });

    const R = size * 0.34;
    const c = size / 2;
    const start = performance.now();
    let raf = 0;

    const project = (x: number, y: number, z: number, ry: number, rx: number) => {
      const cy = Math.cos(ry);
      const sy = Math.sin(ry);
      const x1 = x * cy + z * sy;
      const z1 = -x * sy + z * cy;
      const cx = Math.cos(rx);
      const sx = Math.sin(rx);
      const y2 = y * cx - z1 * sx;
      const z2 = y * sx + z1 * cx;
      const s = 3 / (3 - z2);
      return { x: c + x1 * R * s, y: c + y2 * R * s, z: z2 };
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const t = now - start;
      const ry = reduce ? 0.6 : t * 0.00032;
      const rx = 0.38;
      ctx.clearRect(0, 0, size, size);

      const glow = ctx.createRadialGradient(c, c, 0, c, c, R * 1.1);
      glow.addColorStop(0, "rgba(34,211,238,0.42)");
      glow.addColorStop(0.5, "rgba(34,211,238,0.12)");
      glow.addColorStop(1, "rgba(34,211,238,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, size, size);

      shell.forEach((p, i) => {
        const k = reduce ? 1 : ease(Math.min(1, Math.max(0, (t - i * 0.5) / ASSEMBLE_MS)));
        const q = project(
          p.sx + (p.tx - p.sx) * k,
          p.sy + (p.ty - p.sy) * k,
          p.sz + (p.tz - p.sz) * k,
          ry,
          rx
        );
        const depth = (q.z + 1) / 2;
        ctx.fillStyle = `rgba(70,230,255,${0.3 + depth * 0.7})`;
        const s = 0.9 + depth * 1.6;
        ctx.fillRect(q.x - s / 2, q.y - s / 2, s, s);
      });

      const swirl = reduce ? 0 : -t * 0.0007;
      core.forEach((p, i) => {
        const jitter = reduce ? 0 : Math.sin(t * 0.004 + i) * 0.015;
        const q = project(p.x + jitter, p.y - jitter, p.z, swirl, rx);
        ctx.fillStyle = `rgba(190,250,255,${0.25 + ((q.z + 0.4) / 0.8) * 0.55})`;
        ctx.fillRect(q.x - 0.7, q.y - 0.7, 1.4, 1.4);
      });
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [size]);

  return <canvas ref={ref} aria-hidden style={{ width: size, height: size, display: "block" }} />;
}
