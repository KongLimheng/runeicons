"use client";

import { useEffect, useState, type ComponentType } from "react";

export default function DeferredAnalytics() {
  const [Analytics, setAnalytics] = useState<ComponentType | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      import("@vercel/analytics/next").then((mod) => {
        if (!cancelled) setAnalytics(() => mod.Analytics);
      });
    };

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(load, { timeout: 3000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }
    const timer = window.setTimeout(load, 2000);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  return Analytics ? <Analytics /> : null;
}
