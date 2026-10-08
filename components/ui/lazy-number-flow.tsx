"use client";

import { useEffect, useState, type ComponentType } from "react";

type NumberFlowProps = { value: number; suffix?: string };

export default function LazyNumberFlow({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [Flow, setFlow] = useState<ComponentType<NumberFlowProps> | null>(null);

  useEffect(() => {
    let alive = true;
    import("@number-flow/react").then((mod) => {
      if (alive) setFlow(() => mod.default as ComponentType<NumberFlowProps>);
    });
    return () => {
      alive = false;
    };
  }, []);

  return Flow ? <Flow value={value} suffix={suffix} /> : <>{value}{suffix}</>;
}
