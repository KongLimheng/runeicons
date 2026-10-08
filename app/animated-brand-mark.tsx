"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { BRAND_PATHS, BRAND_VIEWBOX } from "./brand-mark";

const OFFSETS = [
  { x: 1, y: -1 },
  { x: 0, y: 0 },
  { x: -1, y: 1 },
];

const SPRING = { type: "spring", stiffness: 420, damping: 34 } as const;

type Props = {
  size: number;
  fill: string;
  intro?: boolean;
  hover?: boolean;
};

export function AnimatedBrandMark({ size, fill, intro = false, hover = true }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!hover || reduce) return;
    const host = ref.current?.closest("a, button") ?? ref.current;
    if (!host) return;
    const on = () => setActive(true);
    const off = () => setActive(false);
    host.addEventListener("pointerenter", on);
    host.addEventListener("pointerleave", off);
    host.addEventListener("focusin", on);
    host.addEventListener("focusout", off);
    return () => {
      host.removeEventListener("pointerenter", on);
      host.removeEventListener("pointerleave", off);
      host.removeEventListener("focusin", on);
      host.removeEventListener("focusout", off);
    };
  }, [hover, reduce]);

  const open = 0.9;
  const start = 4;

  return (
    <svg
      ref={ref}
      width={size}
      height={Math.round((size * 52) / 49.59)}
      viewBox={BRAND_VIEWBOX}
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {BRAND_PATHS.map((d, i) => {
        const o = OFFSETS[i] ?? { x: 0, y: 0 };
        return (
          <motion.path
            key={d}
            d={d}
            fill={fill}
            initial={
              intro && !reduce
                ? { x: o.x * start, y: o.y * start, opacity: 0 }
                : false
            }
            animate={{
              x: active ? o.x * open : 0,
              y: active ? o.y * open : 0,
              opacity: 1,
            }}
            transition={{ ...SPRING, delay: intro && !reduce && !active ? 0.04 * i : 0 }}
          />
        );
      })}
    </svg>
  );
}
