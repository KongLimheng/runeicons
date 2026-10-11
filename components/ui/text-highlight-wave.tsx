"use client";

import { Fragment, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type GsapModule = typeof import("gsap");
let gsapPromise: Promise<GsapModule> | null = null;
const loadGsap = () => (gsapPromise ??= import("gsap"));
const FADE = 0.1;
const HOLD = 0.05;
const LIFT_DELAY = 0.1;

function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return reduced;
}

export type WaveSegment = string | { text: string; className?: string };

type Glyph = { char: string; className?: string };

function toLines(segments: WaveSegment[]) {
  const glyphs: Glyph[] = segments.flatMap((segment) => {
    const { text, className } = typeof segment === "string" ? { text: segment } : segment;
    return [...text].map((char) => ({ char, className }));
  });

  const lines: Glyph[][][] = [[[]]];
  for (const glyph of glyphs) {
    const line = lines[lines.length - 1];
    if (glyph.char === "\n") lines.push([[]]);
    else if (glyph.char === " ") line.push([]);
    else line[line.length - 1].push(glyph);
  }
  return lines;
}

interface TextHighlightWaveProps {
  text: string | WaveSegment[];
  as?: "h1" | "h2" | "h3" | "p" | "div" | "span";
  highlightColor?: string;
  charStagger?: number;
  lineStagger?: number;
  restOpacity?: number;
  replay?: boolean;
  className?: string;
}

const TextHighlightWave = ({
  text,
  as: Tag = "div",
  highlightColor = "var(--brand)",
  charStagger = 0.04,
  lineStagger = 0.15,
  restOpacity = 0.15,
  replay = false,
  className,
}: TextHighlightWaveProps) => {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const segments = typeof text === "string" ? [text] : text;
  const plainText = segments.map((s) => (typeof s === "string" ? s : s.text)).join("");
  const lines = toLines(segments);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;
    let observer: IntersectionObserver | undefined;
    let ctx: { revert: () => void } | undefined;
    let tl: { kill: () => void } | undefined;

    loadGsap().then(({ default: gsap }) => {
      if (cancelled) return;

      ctx = gsap.context(() => {
        const chars = gsap.utils.toArray<HTMLElement>("[data-char]", root);
        if (chars.length === 0) return;
        const highlights = chars.map(
          (char) => char.querySelector("[data-highlight]") as HTMLElement,
        );

        if (reduced) {
          gsap.set(chars, { opacity: 1 });
          gsap.set(highlights, { opacity: 0 });
          return;
        }

        const play = () => {
          // Group characters by their vertical position, so a line that wraps
          // staggers like the separate line it visually is.
          const rows = new Map<number, number[]>();
          chars.forEach((char, index) => {
            const row = rows.get(char.offsetTop);
            if (row) row.push(index);
            else rows.set(char.offsetTop, [index]);
          });
          const visualLines = [...rows.entries()]
            .sort((a, b) => a[0] - b[0])
            .map(([, indexes]) => indexes);

          const timeline = gsap.timeline();
          timeline.set(chars, { opacity: restOpacity }, 0);
          timeline.set(highlights, { opacity: 0 }, 0);

          visualLines.forEach((line, lineIndex) => {
            line.forEach((charIndex, i) => {
              const at = lineIndex * lineStagger + i * charStagger;
              timeline.to(highlights[charIndex], { opacity: 1, duration: FADE, ease: "sine.out" }, at);
              timeline.to(
                chars[charIndex],
                { opacity: 1, duration: FADE, ease: "sine.out" },
                at + LIFT_DELAY,
              );
              timeline.to(
                highlights[charIndex],
                { opacity: 0, duration: FADE, ease: "sine.in" },
                at + LIFT_DELAY + FADE + HOLD,
              );
            });
          });

          return timeline;
        };

        observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            tl?.kill();
            tl = play();
            if (!replay) observer?.disconnect();
          },
          { rootMargin: "0px 0px -15% 0px" },
        );
        observer.observe(root);
      }, root);
    });

    return () => {
      cancelled = true;
      observer?.disconnect();
      tl?.kill();
      ctx?.revert();
    };
  }, [plainText, highlightColor, charStagger, lineStagger, restOpacity, replay, reduced]);

  return (
    <Tag ref={rootRef as React.Ref<never>} className={className}>
      <span className="sr-only">{plainText}</span>
      <span aria-hidden="true">
        {lines.map((line, lineIndex) => (
          <span key={lineIndex} className="block">
            {line.map((word, wordIndex) => (
              <Fragment key={wordIndex}>
                <span className="inline-block">
                  {word.map(({ char, className: glyphClassName }, charIndex) => (
                    <span
                      key={charIndex}
                      data-char=""
                      className={cn("relative inline-block", glyphClassName)}
                      style={{ opacity: restOpacity }}
                    >
                      {char}
                      <span
                        data-highlight=""
                        className="pointer-events-none absolute top-0 left-0"
                        style={{ color: highlightColor, opacity: 0 }}
                      >
                        {char}
                      </span>
                    </span>
                  ))}
                </span>
                {wordIndex < line.length - 1 ? " " : null}
              </Fragment>
            ))}
          </span>
        ))}
      </span>
    </Tag>
  );
};

export default TextHighlightWave;
