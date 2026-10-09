"use client";

import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";

import GoogleAnalytics from "./google-analytics";

const STORAGE_KEY = "runeicons-analytics-consent";
const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

type Choice = "granted" | "denied";

const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
};

const readChoice = (): Choice | null => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "granted" || stored === "denied" ? stored : null;
  } catch {
    return null;
  }
};

const readServer = (): Choice | null | undefined => undefined;

export default function AnalyticsConsent() {
  const choice = useSyncExternalStore<Choice | null | undefined>(subscribe, readChoice, readServer);

  if (!MEASUREMENT_ID || choice === undefined || choice === "denied") return null;
  if (choice === "granted") return <GoogleAnalytics />;

  const decide = (next: Choice) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    listeners.forEach((listener) => listener());
  };

  return (
    <div
      role="region"
      aria-label="Analytics consent"
      className="shadow-lg fixed right-4 bottom-4 left-4 z-[100] max-w-sm rounded-xl border border-border bg-card p-4 text-card-foreground sm:left-auto"
    >
      <p className="text-body-sm text-muted-foreground">
        We use Google Analytics to count visits. It sets cookies and nothing is sold or used for
        ads.
      </p>
      <div className="mt-3 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => decide("denied")}>
          Decline
        </Button>
        <Button size="sm" onClick={() => decide("granted")}>
          Accept
        </Button>
      </div>
    </div>
  );
}
