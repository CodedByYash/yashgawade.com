"use client";

import { useSyncExternalStore } from "react";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const KEY = "theme";
const EVENT = "theme-change";
const DARK_QUERY = "(prefers-color-scheme: dark)";

/**
 * Runs in <head> before the first paint, so a saved choice never flashes the
 * wrong theme. It also adds the "js" class that scroll reveals key off, so
 * content is only hidden when scripts can bring it back. Keep it in sync with
 * `paint()` below.
 */
export const themeScript = `(function(){document.documentElement.classList.add("js");try{var t=localStorage.getItem("${KEY}");var d=t==="dark"||(t!=="light"&&matchMedia("${DARK_QUERY}").matches);document.documentElement.classList.add(d?"dark":"light")}catch(e){}})()`;

export function readPreference(): ThemePreference {
  try {
    const value = localStorage.getItem(KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

function resolve(preference: ThemePreference): ResolvedTheme {
  if (preference === "system") return matchMedia(DARK_QUERY).matches ? "dark" : "light";
  return preference;
}

function paint(theme: ResolvedTheme) {
  const classes = document.documentElement.classList;
  classes.remove("light", "dark");
  classes.add(theme);
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void> };
};

/**
 * Saves the choice ("system" clears it) and applies it right away. When the
 * browser supports View Transitions the new theme grows out of `origin` (the
 * clicked button) as a circle; otherwise it just switches.
 */
export function setThemePreference(
  preference: ThemePreference,
  origin?: { x: number; y: number },
) {
  const next = resolve(preference);
  const doc = document as ViewTransitionDocument;
  const animate =
    typeof doc.startViewTransition === "function" &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !document.documentElement.classList.contains(next);

  const apply = () => {
    try {
      if (preference === "system") localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, preference);
    } catch {
      // Private mode or blocked storage: the theme still changes for this visit.
    }
    paint(next);
    window.dispatchEvent(new Event(EVENT));
  };

  if (!animate) {
    apply();
    return;
  }

  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? window.innerHeight / 2;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  doc.startViewTransition!(apply).ready.then(
    () => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    },
    () => {},
  );
}

function subscribe(onChange: () => void) {
  const query = matchMedia(DARK_QUERY);

  // The system setting changed, or another tab picked a theme.
  const sync = () => {
    paint(resolve(readPreference()));
    onChange();
  };

  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", sync);
  query.addEventListener("change", sync);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", sync);
    query.removeEventListener("change", sync);
  };
}

export function useThemePreference(): ThemePreference {
  return useSyncExternalStore(subscribe, readPreference, () => "system");
}

/** The theme actually showing right now. */
export function useResolvedTheme(): ResolvedTheme {
  return useSyncExternalStore(
    subscribe,
    () => (document.documentElement.classList.contains("dark") ? "dark" : "light"),
    () => "dark",
  );
}
