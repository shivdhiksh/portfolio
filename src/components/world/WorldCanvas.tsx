"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SECTIONS, getSceneProgress, lerpColor } from "@/lib/sections";

/**
 * A holographic HUD world. Scrolling flies the camera along a spline past a chain
 * of instruments, one per chapter: the dot-sphere over a radar floor, a run of HUD
 * gates, floating data panels, a double helix, an equalizer field and a final beacon.
 * The whole scene rolls and spins with scroll position and speed, and a shockwave
 * ring fires every time you cross into a new chapter.
 * Index i is where the camera is while chapter i is centered; the last entry is the page end.
 */
const CAM = [
  { p: [0, 4, 64], l: [0, 0, 0], f: 55 },
  { p: [-34, 8, 26], l: [0, 0, -30], f: 56 },
  { p: [0, 0, -46], l: [0, 0, -150], f: 62 },
  { p: [6, 3, -205], l: [0, 0, -300], f: 64 },
  { p: [0, 0, -345], l: [0, 0, -440], f: 60 },
  { p: [0, 16, -490], l: [0, -8, -570], f: 56 },
  { p: [0, 6, -600], l: [0, 4, -700], f: 52 },
  { p: [0, 5, -662], l: [0, 5, -700], f: 48 },
] as const;

const BASE_FOG = new THREE.Color("#02070d");
const BEACON_Z = -700;

type Tintable = THREE.PointsMaterial | THREE.LineBasicMaterial | THREE.SpriteMaterial | THREE.MeshBasicMaterial;

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dotTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.85)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(255,255,255,0.95)");
  g.addColorStop(0.3, "rgba(255,255,255,0.28)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

/** Radar dial (circles and degree ticks) and a separate sweep wedge, both white so chapter color can tint them. */
function radarTextures() {
  const S = 512;
  const c = S / 2;

  const dial = document.createElement("canvas");
  dial.width = dial.height = S;
  const d = dial.getContext("2d")!;
  d.strokeStyle = "rgba(255,255,255,0.9)";
  d.lineWidth = 2;
  [0.98, 0.74, 0.5, 0.26].forEach((r, i) => {
    d.globalAlpha = i === 0 ? 0.95 : 0.45;
    d.beginPath();
    d.arc(c, c, r * c, 0, Math.PI * 2);
    d.stroke();
  });
  d.globalAlpha = 0.85;
  for (let i = 0; i < 120; i++) {
    const a = (i / 120) * Math.PI * 2;
    const len = i % 10 === 0 ? 26 : i % 5 === 0 ? 16 : 8;
    d.beginPath();
    d.moveTo(c + Math.cos(a) * (0.98 * c), c + Math.sin(a) * (0.98 * c));
    d.lineTo(c + Math.cos(a) * (0.98 * c - len), c + Math.sin(a) * (0.98 * c - len));
    d.stroke();
  }

  const sweep = document.createElement("canvas");
  sweep.width = sweep.height = S;
  const s = sweep.getContext("2d")!;
  const steps = 90;
  for (let i = 0; i < steps; i++) {
    const a1 = -(i / steps) * 1.1;
    const a0 = -((i + 1) / steps) * 1.1;
    s.fillStyle = `rgba(255,255,255,${(1 - i / steps) * 0.5})`;
    s.beginPath();
    s.moveTo(c, c);
    s.arc(c, c, 0.98 * c, a0, a1);
    s.fill();
  }
  s.strokeStyle = "rgba(255,255,255,0.95)";
  s.lineWidth = 3;
  s.beginPath();
  s.moveTo(c, c);
  s.lineTo(c + 0.98 * c, c);
  s.stroke();

  return [new THREE.CanvasTexture(dial), new THREE.CanvasTexture(sweep)] as const;
}

function fibSphere(n: number, radius: number) {
  const out: number[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (2 * (i + 0.5)) / n;
    const r = Math.sqrt(1 - y * y);
    const phi = i * golden;
    out.push(Math.cos(phi) * r * radius, y * radius, Math.sin(phi) * r * radius);
  }
  return out;
}

function circlePoints(n: number, radius: number) {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    out.push(Math.cos(a) * radius, Math.sin(a) * radius, 0);
  }
  return out;
}

function pointsGeo(arr: number[]) {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
  return g;
}

/** Tick marks around a ring, as line segments. */
function tickGeo(radius: number, count: number, short: number, long: number, every: number) {
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const len = i % every === 0 ? long : short;
    out.push(Math.cos(a) * radius, Math.sin(a) * radius, 0, Math.cos(a) * (radius + len), Math.sin(a) * (radius + len), 0);
  }
  return pointsGeo(out);
}

/** A HUD panel: four corner brackets, a few scan lines and a column of data bars. */
function panelGeo(w: number, h: number, rand: () => number) {
  const b = 4;
  const x0 = -w / 2;
  const x1 = w / 2;
  const y0 = -h / 2;
  const y1 = h / 2;
  const seg: number[] = [];
  const line = (ax: number, ay: number, bx: number, by: number) => seg.push(ax, ay, 0, bx, by, 0);
  [
    [x0, y0, 1, 1],
    [x1, y0, -1, 1],
    [x0, y1, 1, -1],
    [x1, y1, -1, -1],
  ].forEach(([cx, cy, sx, sy]) => {
    line(cx, cy, cx + sx * b, cy);
    line(cx, cy, cx, cy + sy * b);
  });
  for (let i = 1; i <= 4; i++) line(x0 + 3, y1 - (i * h) / 6, x0 + 3 + rand() * (w * 0.55) + 4, y1 - (i * h) / 6);
  for (let i = 0; i < 7; i++) {
    const bx = x1 - 4 - i * 2.2;
    line(bx, y0 + 3, bx, y0 + 3 + rand() * (h * 0.5) + 2);
  }
  return pointsGeo(seg);
}

export default function WorldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: window.innerWidth >= 800, powerPreference: "high-performance" });
    } catch {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFailed(true);
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Phones get a lighter scene: fewer particles, a coarser terrain and a lower pixel ratio.
    const lite = window.innerWidth < 800;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lite ? 1.25 : 1.75));
    renderer.setClearColor(BASE_FOG);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(BASE_FOG.clone(), 0.0042);
    scene.background = BASE_FOG.clone();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.5, 1600);
    const rand = rng(2024);
    const dot = dotTexture();
    const glow = glowTexture();
    const [dialTex, sweepTex] = radarTextures();

    // Materials grouped by which chapter color drives them.
    const matsA: Tintable[] = [];
    const matsB: Tintable[] = [];
    const pointsMat = (size: number, opacity: number, group: Tintable[]) => {
      const m = new THREE.PointsMaterial({
        map: dot,
        size,
        sizeAttenuation: true,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        alphaTest: 0.01,
      });
      group.push(m);
      return m;
    };
    const lineMat = (opacity: number, group: Tintable[]) => {
      const m = new THREE.LineBasicMaterial({
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      group.push(m);
      return m;
    };
    const flatMat = (map: THREE.Texture | null, opacity: number, group: Tintable[]) => {
      const m = new THREE.MeshBasicMaterial({
        map,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
      group.push(m);
      return m;
    };

    // ── 0 · Hero: the intro's dot-sphere, orbit rings, and a radar floor beneath it
    const hero = new THREE.Group();
    hero.add(new THREE.Points(pointsGeo(fibSphere(lite ? 1500 : 2600, 24)), pointsMat(0.9, 0.95, matsA)));
    const core = new THREE.Points(
      pointsGeo(
        Array.from({ length: 420 }, () => {
          const a = rand() * Math.PI * 2;
          const b = Math.acos(2 * rand() - 1);
          const r = Math.cbrt(rand()) * 8;
          return [Math.sin(b) * Math.cos(a) * r, Math.sin(b) * Math.sin(a) * r, Math.cos(b) * r];
        }).flat()
      ),
      pointsMat(0.7, 0.9, matsB)
    );
    hero.add(core);
    const coreGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.55 }));
    matsA.push(coreGlow.material);
    coreGlow.scale.set(64, 64, 1);
    hero.add(coreGlow);
    const rings: THREE.Points[] = [];
    [
      { r: 30, tilt: [1.25, 0.2], speed: 0.1 },
      { r: 36, tilt: [0.5, 1.0], speed: -0.07 },
      { r: 43, tilt: [1.0, -0.6], speed: 0.05 },
    ].forEach(({ r, tilt, speed }, i) => {
      const ring = new THREE.Points(pointsGeo(circlePoints(i === 0 ? 220 : 340, r)), pointsMat(0.55, 0.9, matsB));
      ring.rotation.set(tilt[0], tilt[1], 0);
      ring.userData.speed = speed;
      hero.add(ring);
      rings.push(ring);
    });
    scene.add(hero);

    const radar = new THREE.Group();
    radar.position.set(0, -25, 0);
    const dial = new THREE.Mesh(new THREE.PlaneGeometry(150, 150), flatMat(dialTex, 0.55, matsA));
    dial.rotation.x = -Math.PI / 2;
    const sweep = new THREE.Mesh(new THREE.PlaneGeometry(150, 150), flatMat(sweepTex, 0.6, matsB));
    sweep.rotation.x = -Math.PI / 2;
    radar.add(dial, sweep);
    scene.add(radar);

    // Holographic floor
    const grid = new THREE.GridHelper(1400, 280, 0xffffff, 0xffffff);
    grid.position.set(0, -26, -340);
    const gridMat = grid.material as THREE.LineBasicMaterial;
    gridMat.transparent = true;
    gridMat.opacity = 0.18;
    gridMat.depthWrite = false;
    gridMat.blending = THREE.AdditiveBlending;
    matsA.push(gridMat);
    scene.add(grid);

    // ── 2 · A run of HUD gates the camera flies through
    const gates: THREE.Group[] = [];
    for (let i = 0; i < 10; i++) {
      const gate = new THREE.Group();
      gate.add(new THREE.LineLoop(pointsGeo(circlePoints(120, 15)), lineMat(0.75, matsB)));
      gate.add(new THREE.LineSegments(tickGeo(16.2, 72, 1.6, 3.4, 6), lineMat(0.55, matsA)));
      gate.add(new THREE.LineLoop(pointsGeo(circlePoints(90, 21)), lineMat(0.18, matsA)));
      gate.position.z = -66 - i * 17;
      gate.userData.dir = i % 2 ? 1 : -1;
      scene.add(gate);
      gates.push(gate);
    }

    // ── 3 · Floating data panels the camera drifts through, and a sparse node field
    const panels = new THREE.Group();
    const panelMeta: { g: THREE.LineSegments; base: THREE.Vector3; ph: number }[] = [];
    for (let i = 0; i < 9; i++) {
      const w = 26 + rand() * 12;
      const h = 15 + rand() * 7;
      const g = new THREE.LineSegments(panelGeo(w, h, rand), lineMat(0.7, i % 2 ? matsA : matsB));
      const base = new THREE.Vector3((i % 2 ? 1 : -1) * (20 + rand() * 12), (rand() - 0.5) * 18, -222 - i * 14);
      g.position.copy(base);
      g.rotation.y = (i % 2 ? -1 : 1) * 0.35;
      panels.add(g);
      panelMeta.push({ g, base, ph: rand() * 6 });
    }
    scene.add(panels);
    const nodePts: number[] = [];
    for (let i = 0; i < 160; i++) {
      const a = rand() * Math.PI * 2;
      const b = Math.acos(2 * rand() - 1);
      const r = 14 + Math.cbrt(rand()) * 50;
      nodePts.push(Math.sin(b) * Math.cos(a) * r, Math.sin(b) * Math.sin(a) * r * 0.7, -285 + Math.cos(b) * r * 1.5);
    }
    const net = new THREE.Points(pointsGeo(nodePts), pointsMat(1.0, 0.9, matsB));
    scene.add(net);

    // ── 4 · Double helix
    const helix = new THREE.Group();
    const strandA: number[] = [];
    const strandB: number[] = [];
    const rungs: number[] = [];
    for (let i = 0; i < 260; i++) {
      const a = i * 0.28;
      const z = -350 - i * 0.55;
      const x1 = Math.cos(a) * 11;
      const y1 = Math.sin(a) * 11;
      const x2 = Math.cos(a + Math.PI) * 11;
      const y2 = Math.sin(a + Math.PI) * 11;
      strandA.push(x1, y1, z);
      strandB.push(x2, y2, z);
      if (i % 4 === 0) rungs.push(x1, y1, z, x2, y2, z);
    }
    helix.add(new THREE.Points(pointsGeo(strandA), pointsMat(1.5, 1, matsA)));
    helix.add(new THREE.Points(pointsGeo(strandB), pointsMat(1.5, 1, matsB)));
    helix.add(new THREE.LineSegments(pointsGeo(rungs), lineMat(0.25, matsA)));
    scene.add(helix);

    // ── 5 · Data terrain with an equalizer field of bars
    const COLS = lite ? 56 : 110;
    const ROWS = lite ? 36 : 70;
    const STEP = lite ? 6.3 : 3.2;
    const terrainPos = new Float32Array(COLS * ROWS * 3);
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const k = (r * COLS + c) * 3;
        terrainPos[k] = (c - COLS / 2) * STEP;
        terrainPos[k + 2] = -470 - r * STEP;
      }
    }
    const terrainAttr = new THREE.BufferAttribute(terrainPos, 3);
    const terrainGeo = new THREE.BufferGeometry();
    terrainGeo.setAttribute("position", terrainAttr);
    scene.add(new THREE.Points(terrainGeo, pointsMat(1.0, 0.8, matsA)));

    const BAR_COLS = lite ? 18 : 28;
    const BAR_ROWS = lite ? 9 : 14;
    const bars = new THREE.InstancedMesh(new THREE.BoxGeometry(1.6, 1, 1.6), flatMat(null, 0.15, matsB), BAR_COLS * BAR_ROWS);
    bars.frustumCulled = false;
    scene.add(bars);
    const dummy = new THREE.Object3D();

    // ── 6 · Final beacon
    const beacon = new THREE.Group();
    beacon.position.set(0, 5, BEACON_Z);
    beacon.add(new THREE.Points(pointsGeo(fibSphere(lite ? 1200 : 2000, 30)), pointsMat(0.9, 0.9, matsB)));
    const beaconGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.7 }));
    matsB.push(beaconGlow.material);
    beaconGlow.scale.set(150, 150, 1);
    beacon.add(beaconGlow);
    const beaconRings: THREE.Points[] = [];
    [38, 46].forEach((r, i) => {
      const ring = new THREE.Points(pointsGeo(circlePoints(300, r)), pointsMat(0.6, 0.9, matsA));
      ring.rotation.set(1.1 + i * 0.5, i * 0.7, 0);
      ring.userData.speed = i ? -0.08 : 0.1;
      beacon.add(ring);
      beaconRings.push(ring);
    });
    const pulses = Array.from({ length: 3 }, () => {
      const p = new THREE.LineLoop(pointsGeo(circlePoints(160, 1)), lineMat(0.5, matsA));
      beacon.add(p);
      return p;
    });
    scene.add(beacon);

    // Shockwave rings fired when a new chapter is reached
    const shocks = Array.from({ length: 3 }, () => {
      const s = new THREE.LineLoop(pointsGeo(circlePoints(120, 1)), lineMat(0, matsB));
      s.visible = false;
      s.userData.age = 99;
      scene.add(s);
      return s;
    });
    let shockIndex = 0;

    // ── Ambient drifting particles
    const COUNT = lite ? 650 : 1500;
    const BOX = new THREE.Vector3(180, 120, 200);
    const dust = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      dust[i * 3] = (rand() - 0.5) * BOX.x;
      dust[i * 3 + 1] = rand() * BOX.y;
      dust[i * 3 + 2] = (rand() - 0.5) * BOX.z;
    }
    const dustAttr = new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3);
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", dustAttr);
    const dustPts = new THREE.Points(dustGeo, pointsMat(0.32, 0.5, matsA));
    dustPts.frustumCulled = false;
    scene.add(dustPts);

    // Camera path
    const posCurve = new THREE.CatmullRomCurve3(CAM.map((c) => new THREE.Vector3(...c.p)), false, "centripetal");
    const lookCurve = new THREE.CatmullRomCurve3(CAM.map((c) => new THREE.Vector3(...c.l)), false, "centripetal");

    const mouse = { x: 0, y: 0 };
    const onMouse = (e: MouseEvent) => {
      mouse.x = e.clientX / window.innerWidth - 0.5;
      mouse.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    const pos = new THREE.Vector3();
    const look = new THREE.Vector3();
    const fwd = new THREE.Vector3();
    const fogColor = new THREE.Color();
    const tintA = new THREE.Color();
    const tintB = new THREE.Color();
    let smooth = getSceneProgress();
    let chapter = Math.min(SECTIONS.length - 1, Math.floor(smooth));
    let camX = 0;
    let camY = 0;
    let raf = 0;
    let last = performance.now();
    let elapsed = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) {
        last = now;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      elapsed += dt;

      const target = Math.min(CAM.length - 1, getSceneProgress());
      const before = smooth;
      smooth += (target - smooth) * (1 - Math.exp(-4.2 * dt));
      const vel = (smooth - before) / Math.max(dt, 0.001);
      const boost = reduce ? 0 : Math.min(Math.abs(vel) * 0.9, 3.2);
      const sgn = vel >= 0 ? 1 : -1;

      const t = smooth / (CAM.length - 1);
      posCurve.getPoint(t, pos);
      lookCurve.getPoint(t, look);
      const i0 = Math.min(CAM.length - 2, Math.floor(smooth));
      const f = smooth - i0;
      camera.fov = CAM[i0].f + (CAM[i0 + 1].f - CAM[i0].f) * f;
      camera.updateProjectionMatrix();

      if (!reduce) {
        camX += (mouse.x * 4 - camX) * (1 - Math.exp(-3 * dt));
        camY += (-mouse.y * 2.4 - camY) * (1 - Math.exp(-3 * dt));
      }
      camera.position.set(pos.x + camX, pos.y + camY + (reduce ? 0 : Math.sin(elapsed * 0.6) * 0.3), pos.z);
      camera.lookAt(look);
      // The view rolls with where you are on the page and banks into fast scrolls.
      if (!reduce) camera.rotateZ(Math.sin(smooth * 1.15) * 0.17 + THREE.MathUtils.clamp(-vel * 0.06, -0.16, 0.16));

      // Chapter grading
      const c0 = Math.min(SECTIONS.length - 1, Math.floor(smooth));
      const c1 = Math.min(SECTIONS.length - 1, c0 + 1);
      const cf = Math.min(1, smooth - c0);
      const a = lerpColor(SECTIONS[c0].colors[0], SECTIONS[c1].colors[0], cf);
      const b = lerpColor(SECTIONS[c0].colors[1], SECTIONS[c1].colors[1], cf);
      tintA.setRGB(a[0] / 255, a[1] / 255, a[2] / 255);
      tintB.setRGB(b[0] / 255, b[1] / 255, b[2] / 255);
      fogColor.copy(BASE_FOG).lerp(tintA, 0.07);
      (scene.fog as THREE.FogExp2).color.copy(fogColor);
      (scene.background as THREE.Color).copy(fogColor);
      matsA.forEach((m) => m.color.copy(tintA));
      matsB.forEach((m) => m.color.copy(tintB));

      // Shockwave on entering a new chapter
      if (c0 !== chapter) {
        chapter = c0;
        if (!reduce) {
          const s = shocks[shockIndex++ % shocks.length];
          camera.getWorldDirection(fwd);
          s.position.copy(camera.position).addScaledVector(fwd, 34);
          s.quaternion.copy(camera.quaternion);
          s.userData.age = 0;
          s.visible = true;
        }
      }
      shocks.forEach((s) => {
        if (s.userData.age > 1.6) {
          s.visible = false;
          return;
        }
        s.userData.age += dt;
        const k = s.userData.age / 1.6;
        s.scale.setScalar(2 + k * 60);
        (s.material as THREE.LineBasicMaterial).opacity = (1 - k) * 0.9;
      });

      // Everything spins with time, with where you are, and with how hard you scroll.
      if (!reduce) {
        hero.rotation.y = elapsed * 0.07 + smooth * 0.9;
        core.rotation.y -= dt * (0.18 + boost * 0.6);
        rings.forEach((r) => (r.rotation.z += dt * (r.userData.speed + sgn * boost * 0.5 * Math.sign(r.userData.speed))));
        sweep.rotation.z -= dt * (1.1 + boost * 1.4);
        beaconRings.forEach((r) => (r.rotation.z += dt * (r.userData.speed + sgn * boost * 0.4)));
        beacon.rotation.y += dt * (0.05 + boost * 0.15);
        helix.rotation.z = elapsed * 0.12 + smooth * 1.6;
        gates.forEach((g, i) => {
          g.rotation.z += dt * g.userData.dir * (0.25 + boost * 0.9);
          const line = g.children[1] as THREE.LineSegments;
          (line.material as THREE.LineBasicMaterial).opacity = 0.3 + 0.5 * Math.max(0, Math.sin(elapsed * 1.6 - i * 0.7));
        });
        panelMeta.forEach(({ g, base, ph }) => {
          g.position.y = base.y + Math.sin(elapsed * 0.8 + ph) * 1.6;
          (g.material as THREE.LineBasicMaterial).opacity = 0.55 + 0.25 * Math.sin(elapsed * 2.2 + ph);
        });
        net.rotation.y += dt * (0.02 + boost * 0.05);
        pulses.forEach((p, i) => {
          const ph = (elapsed * 0.35 + i / 3) % 1;
          p.scale.setScalar(30 + ph * 70);
          (p.material as THREE.LineBasicMaterial).opacity = (1 - ph) * 0.55;
        });

        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            const x = terrainPos[(r * COLS + c) * 3];
            const z = terrainPos[(r * COLS + c) * 3 + 2];
            terrainPos[(r * COLS + c) * 3 + 1] = -16 + Math.sin(x * 0.11 + elapsed * 0.9) * 2.4 + Math.cos(z * 0.09 + elapsed * 0.6) * 2.4;
          }
        }
        terrainAttr.needsUpdate = true;
      }

      // Equalizer bars
      for (let r = 0; r < BAR_ROWS; r++) {
        for (let c = 0; c < BAR_COLS; c++) {
          const h = 2 + (Math.sin(c * 0.55 + elapsed * 2.1 + r * 0.7) * 0.5 + 0.5) * (6 + Math.sin(r * 0.4 + elapsed) * 3 + 5) * (reduce ? 0.4 : 0.7);
          dummy.position.set((c - BAR_COLS / 2) * (lite ? 6.5 : 4.2), -25 + h / 2, -545 - r * 5);
          dummy.scale.set(1, h, 1);
          dummy.updateMatrix();
          bars.setMatrixAt(r * BAR_COLS + c, dummy.matrix);
        }
      }
      bars.instanceMatrix.needsUpdate = true;
      coreGlow.material.opacity = 0.45 + 0.15 * Math.sin(elapsed * 1.6);

      // Particles wrap around the camera
      const cam = camera.position;
      for (let i = 0; i < COUNT; i++) {
        let y = dust[i * 3 + 1] - dt * (reduce ? 0 : 2 + (i % 4) + boost * 8);
        if (y < 0) y += BOX.y;
        dust[i * 3 + 1] = y;
        const wx = ((dust[i * 3] - cam.x + BOX.x * 1.5) % BOX.x) - BOX.x / 2;
        const wz = ((dust[i * 3 + 2] - cam.z + BOX.z * 1.5) % BOX.z) - BOX.z / 2;
        dustAttr.setXYZ(i, cam.x + wx, cam.y - BOX.y / 2 + y, cam.z + wz);
      }
      dustAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      bars.dispose();
      dot.dispose();
      glow.dispose();
      dialTex.dispose();
      sweepTex.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <>
      {failed ? (
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            background: "radial-gradient(ellipse at 50% 30%, #0b2a3a, #02070d 70%)",
          }}
        />
      ) : (
        <canvas
          ref={canvasRef}
          aria-hidden
          style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, display: "block" }}
        />
      )}
      <div className="world-vignette" aria-hidden />
      <div className="world-grain" aria-hidden />
    </>
  );
}
