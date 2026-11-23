"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "motion/react";
import { IconSwap } from "@/components/icon-swap";

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

const START_DELAY = 700; // caret blinks alone for a moment first
const TYPE_DELAY = 90; // ms per letter
const CARET_HOLD = 1500; // how long the caret keeps blinking after the last letter
const CARET_FADE = 600;

/** The typing caret: zero width, so it never moves the text. It blinks while idle and fades away at the end. */
function Caret({ typing, fading }: { typing: boolean; fading: boolean }) {
  const animation = fading
    ? { opacity: 0, transition: { duration: 0.5 } }
    : typing
      ? { opacity: 1, transition: { duration: 0.05 } }
      : { opacity: [1, 1, 0, 0], transition: { duration: 0.9, times: [0, 0.5, 0.5, 1], ease: "linear" as const, repeat: Infinity } };
  return (
    <span aria-hidden className="relative inline-block w-0 align-baseline">
      <motion.span className="absolute -bottom-[0.18em] left-px block h-[0.95em] w-0.5 rounded-[1px] bg-current" animate={animation} />
    </span>
  );
}

/**
 * Greets the visitor according to *their* local time. The greeting is typed
 * out letter by letter (once it scrolls into view) with a blinking caret that
 * fades away shortly after the last letter. Every letter is in the page from
 * the start, just hidden, so nothing around it ever shifts.
 */
export function Greeting() {
  const hydrated = useHydrated();
  const reduced = useReducedMotion();
  const text = hydrated ? greetingFor(new Date().getHours()) : "Hello";
  const letters = Array.from(text);
  const ref = useRef<HTMLParagraphElement>(null);
  const [typed, setTyped] = useState(0);
  const [started, setStarted] = useState(false);
  const [caret, setCaret] = useState<"on" | "fading" | "gone">("on");
  const animate = hydrated && !reduced;

  // Wait until the greeting is actually on screen.
  useEffect(() => {
    if (!animate || !ref.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setStarted(true);
        io.disconnect();
      },
      { threshold: 0.6 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [animate]);

  useEffect(() => {
    if (!animate || !started) return;
    let count = 0;
    let tick: number | undefined;
    const timers: number[] = [];
    // A short pause with the caret blinking, like someone about to type.
    timers.push(
      window.setTimeout(() => {
        tick = window.setInterval(() => {
          count += 1;
          setTyped(count);
          if (count >= letters.length) {
            window.clearInterval(tick);
            timers.push(window.setTimeout(() => setCaret("fading"), CARET_HOLD));
            timers.push(window.setTimeout(() => setCaret("gone"), CARET_HOLD + CARET_FADE));
          }
        }, TYPE_DELAY);
      }, START_DELAY),
    );
    return () => {
      window.clearInterval(tick);
      timers.forEach(window.clearTimeout);
    };
    // `text` restarts the typing if the visitor's hour changes the greeting.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate, started, text]);

  const showAll = !animate;
  const typing = typed < letters.length;
  const nodes: React.ReactNode[] = [];
  letters.forEach((char, i) => {
    if (!showAll && caret !== "gone" && i === typed) {
      nodes.push(<Caret key="caret" typing={typing} fading={caret === "fading"} />);
    }
    nodes.push(
      <motion.span key={i} initial={false} animate={{ opacity: showAll || i < typed ? 1 : 0 }} transition={{ duration: 0.12 }}>
        {char}
      </motion.span>,
    );
  });
  if (!showAll && caret !== "gone" && typed >= letters.length) {
    nodes.push(<Caret key="caret" typing={false} fading={caret === "fading"} />);
  }

  return (
    // Hidden until the greeting knows the visitor's local time.
    <motion.p
      ref={ref}
      className="font-hand text-2xl font-bold capitalize leading-normal"
      initial={{ opacity: 0 }}
      animate={{ opacity: hydrated ? 1 : 0 }}
      transition={{ duration: 0.4 }}
      suppressHydrationWarning
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden>{nodes}</span>
    </motion.p>
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
        <IconSwap active={state === "copied"} from="hugeicons:copy-01" to="hugeicons:tick-02" />
      </button>
      <span role="status" className="sr-only">
        {state === "copied" ? "Phone number copied" : state === "error" ? "Could not copy" : ""}
      </span>
    </>
  );
}
