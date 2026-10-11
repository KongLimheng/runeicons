"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const FooterWordmarkField = dynamic(() => import("./footer-wordmark-field"), { ssr: false });

const FooterWordmarkLoader = () => {
  const placeholderRef = useRef<HTMLSpanElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const placeholder = placeholderRef.current;
    if (!placeholder) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(placeholder);
    return () => observer.disconnect();
  }, []);

  if (near) return <FooterWordmarkField />;
  return <span ref={placeholderRef} aria-hidden="true" className="pointer-events-none absolute inset-0" />;
};

export default FooterWordmarkLoader;
