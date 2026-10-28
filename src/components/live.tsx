"use client";

import { useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/icon";

const noopSubscribe = () => () => {};

/** True only after hydration — lets us render visitor-local values safely. */
function useHydrated() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

function greetingFor(hour: number) {
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 21) return "Good Evening";
  return "Hello, Night Owl";
}

/** Greets the visitor according to *their* local time. */
export function Greeting() {
  const hydrated = useHydrated();
  const text = hydrated ? greetingFor(new Date().getHours()) : "Hello";
  return (
    <p
      className="font-hand text-2xl font-bold capitalize leading-normal"
      suppressHydrationWarning
    >
      {text}
    </p>
  );
}

function subscribeEveryHalfMinute(callback: () => void) {
  const id = setInterval(callback, 30_000);
  return () => clearInterval(id);
}

function formatClock(timeZone: string, label: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: false,
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "--";
  return `${get("hour")}:${get("minute")} ${get("day")}/${get("month")}/${get("year")} (${label})`;
}

/** Live clock in the owner's time zone, e.g. "11:52 29/09/2026 (IST)". */
export function LiveClock({ timeZone, label }: { timeZone: string; label: string }) {
  const text = useSyncExternalStore(
    subscribeEveryHalfMinute,
    () => formatClock(timeZone, label),
    () => `--:-- --/--/---- (${label})`,
  );
  return <time suppressHydrationWarning>{text}</time>;
}

/**
 * Masked phone number. The real number is never in the page markup — it is
 * fetched from /api/phone only when the visitor clicks copy.
 */
export function CopyPhone({ countryCode = "+91" }: { countryCode?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  async function copy() {
    try {
      const res = await fetch("/api/phone", { cache: "no-store" });
      if (!res.ok) throw new Error("unavailable");
      const { phone } = (await res.json()) as { phone: string };
      await navigator.clipboard.writeText(phone);
      setState("copied");
    } catch {
      setState("error");
    }
    setTimeout(() => setState("idle"), 1800);
  }

  return (
    <>
      <span>{countryCode} **********</span>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy phone number"
        className="-m-0.5 rounded-sm p-0.5 text-nav-muted transition-colors hover:text-foreground"
      >
        <Icon name={state === "copied" ? "hugeicons:tick-02" : "hugeicons:copy-01"} size={20} />
      </button>
      <span role="status" className="sr-only">
        {state === "copied" ? "Phone number copied" : state === "error" ? "Could not copy" : ""}
      </span>
    </>
  );
}
