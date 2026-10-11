"use client";

import { LazyMotion } from "motion/react";

const loadFeatures = () => import("motion/react").then((mod) => mod.domMax);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures}>
      {children}
    </LazyMotion>
  );
}
