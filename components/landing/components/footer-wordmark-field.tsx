"use client";

import { useEffect, useRef } from "react";

import { WORDMARK_D, WORDMARK_VB_H, WORDMARK_VB_W } from "../svg/wordmark-data";

const VB_W = WORDMARK_VB_W;
const VB_H = WORDMARK_VB_H;
const CELL = 12;
const COLS = Math.floor(VB_W / CELL);
const ROWS = Math.floor(VB_H / CELL);
const GRID_X = (VB_W - COLS * CELL) / 2;
const GRID_Y = (VB_H - ROWS * CELL) / 2;
const ICON_SCALE = 0.8;
const REVEAL_RADIUS = 120;

const ROLL_PERIOD_S = 2.4;
const ROLL_FADE = 0.18;
const POINTER_EASE = 10;
const REVEAL_IN = 7;
const REVEAL_OUT = 3;
const ICON_ALPHA = 0.6;

const ICONS = [
  "documents/file-text",
  "documents/folder",
  "documents/save",
  "documents/inbox",
  "documents/archive",
  "documents/clipboard",
  "code/braces",
  "code/terminal",
  "code/git-branch",
  "code/server",
  "gadgets/laptop",
  "gadgets/watch",
  "identity/lock",
  "identity/fingerprint-pattern",
  "indicators/circle-check",
  "layouts/grid-2x2",
  "messaging/mail",
  "messaging/send",
  "metrics/chart-bar",
  "metrics/activity",
  "money/gift",
  "money/shopping-bag",
  "nature/cloud",
  "nature/sun",
  "other/zap",
  "playback/play",
  "playback/camera",
  "schedule/clock",
  "senses/eye",
  "senses/pointer",
  "tools/heart",
  "tools/star",
  "tools/sparkles",
  "tools/search",
  "tools/settings",
  "tools/bookmark",
];

const hash = (x: number, y: number) => {
  const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return h - Math.floor(h);
};

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

const FooterWordmarkField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const host = canvas.parentElement;
    if (!host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const letters = new Path2D(WORDMARK_D);
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const images: HTMLImageElement[] = [];
    let iconsRequested = false;
    const requestIcons = () => {
      if (iconsRequested) return;
      iconsRequested = true;
      for (const name of ICONS) {
        const img = new Image();
        img.addEventListener("load", () => !frame && update(), { once: true });
        img.src = `/pixelated/${name}.svg`;
        images.push(img);
      }
    };

    const coverage = new Uint8Array(COLS * ROWS);
    const probe = document.createElement("canvas").getContext("2d");
    if (probe) {
      const touches = (x: number, y: number, r: number) =>
        probe.isPointInPath(letters, x, y) ||
        probe.isPointInPath(letters, x - r, y - r) ||
        probe.isPointInPath(letters, x + r, y - r) ||
        probe.isPointInPath(letters, x - r, y + r) ||
        probe.isPointInPath(letters, x + r, y + r);
      const iconReach = (CELL * ICON_SCALE) / 2;
      for (let j = 0; j < ROWS; j++) {
        for (let i = 0; i < COLS; i++) {
          const x = GRID_X + i * CELL + CELL / 2;
          const y = GRID_Y + j * CELL + CELL / 2;
          coverage[j * COLS + i] = touches(x, y, iconReach) ? 1 : 0;
        }
      }
    }

    let scale = 1;
    let dpr = 1;
    let frame = 0;
    let previous = 0;
    let elapsed = 0;
    let visible = false;
    let target: { x: number; y: number } | null = null;
    const pointer = { x: 0, y: 0 };
    let stir = 0;
    let reveal = 0;
    let color = getComputedStyle(host).color;

    let spritePx = 0;
    let spriteKey = "";
    let sprites: (HTMLCanvasElement | null)[] = [];
    const getSprites = (color: string) => {
      spritePx = Math.max(8, Math.round(CELL * ICON_SCALE * scale * dpr));
      const key = `${color}|${spritePx}`;
      if (key === spriteKey && sprites.length === images.length && sprites.every(Boolean))
        return sprites;
      spriteKey = key;
      sprites = images.map((img) => {
        if (!img.complete || !img.naturalWidth) return null;
        const c = document.createElement("canvas");
        c.width = spritePx;
        c.height = spritePx;
        const g = c.getContext("2d");
        if (!g) return null;
        g.imageSmoothingEnabled = false;
        g.drawImage(img, 0, 0, spritePx, spritePx);
        g.globalCompositeOperation = "source-in";
        g.fillStyle = color;
        g.fillRect(0, 0, spritePx, spritePx);
        return c;
      });
      return sprites;
    };

    const draw = (t: number) => {
      const tinted = getSprites(color);
      const k = scale * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (reveal <= 0) return;
      ctx.imageSmoothingEnabled = false;

      ctx.setTransform(k, 0, 0, k, 0, 0);
      ctx.save();
      ctx.clip(letters);
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      const half = CELL / 2;

      for (let j = 0; j < ROWS; j++) {
        for (let i = 0; i < COLS; i++) {
          if (!coverage[j * COLS + i]) continue;
          const x = GRID_X + i * CELL + half;
          const y = GRID_Y + j * CELL + half;

          const distance = Math.hypot(x - pointer.x, y - pointer.y);
          const glow = stir * (1 - smoothstep(REVEAL_RADIUS * 0.5, REVEAL_RADIUS, distance));
          if (glow < 0.02) continue;
          const seed = hash(i, j);

          const phase = t / ROLL_PERIOD_S + seed * 6;
          const n = Math.floor(phase);
          const fade = smoothstep(0, ROLL_FADE, phase - n);
          const rollNow = hash(seed * 97, n);
          const rollPrev = hash(seed * 97, n - 1);

          const px = Math.round(x * k - spritePx / 2);
          const py = Math.round(y * k - spritePx / 2);
          const now = tinted[Math.floor(rollNow * tinted.length)];
          const prev = tinted[Math.floor(rollPrev * tinted.length)];
          if (prev && prev !== now && fade < 1) {
            ctx.globalAlpha = reveal * ICON_ALPHA * glow * (1 - fade);
            ctx.drawImage(prev, px, py);
          }
          if (now) {
            ctx.globalAlpha = reveal * ICON_ALPHA * glow * (prev === now ? 1 : fade);
            ctx.drawImage(now, px, py);
          }
        }
      }

      ctx.restore();
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      const dt = Math.min((now - previous) / 1000, 0.1);
      previous = now;
      elapsed += dt;
      if (target) {
        const follow = 1 - Math.exp(-dt * POINTER_EASE);
        pointer.x += (target.x - pointer.x) * follow;
        pointer.y += (target.y - pointer.y) * follow;
      }
      stir = target ? Math.min(1, stir + dt * 3) : Math.max(0, stir - dt * 1.2);
      reveal = target ? Math.min(1, reveal + dt * REVEAL_IN) : Math.max(0, reveal - dt * REVEAL_OUT);
      draw(elapsed);
      if (!target && reveal === 0) {
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const update = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      color = getComputedStyle(host).color;
      if (reducedMotion.matches) reveal = target ? 1 : 0;
      draw(elapsed);
      if (visible && !document.hidden && !reducedMotion.matches && (target || reveal > 0)) {
        previous = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    const resize = () => {
      const width = host.clientWidth;
      dpr = Math.min(devicePixelRatio || 1, 2);
      color = getComputedStyle(host).color;
      scale = width / VB_W;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(VB_H * scale * dpr));
      draw(elapsed);
    };

    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const next = {
        x: ((e.clientX - rect.left) / rect.width) * VB_W,
        y: ((e.clientY - rect.top) / rect.height) * VB_H,
      };
      if (!target && stir === 0) {
        pointer.x = next.x;
        pointer.y = next.y;
      }
      target = next;
      if (!frame) update();
    };
    const onLeave = () => {
      target = null;
      if (reducedMotion.matches) update();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) requestIcons();
      update();
    });
    intersection.observe(host);
    const themeObserver = new MutationObserver(update);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    reducedMotion.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      themeObserver.disconnect();
      reducedMotion.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
};

export default FooterWordmarkField;
