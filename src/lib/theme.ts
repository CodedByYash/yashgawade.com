"use client";

import { useSyncExternalStore } from "react";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const KEY = "theme";
const EVENT = "theme-change";
const DARK_QUERY = "(prefers-color-scheme: dark)";

/**
 * Runs in <head> before the first paint, so a saved choice never flashes the
 * wrong theme. Keep it in sync with `paint()` below.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem("${KEY}");var d=t==="dark"||(t!=="light"&&matchMedia("${DARK_QUERY}").matches);document.documentElement.classList.add(d?"dark":"light")}catch(e){}})()`;

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

/** Saves the choice ("system" clears it) and applies it right away. */
export function setThemePreference(preference: ThemePreference) {
  try {
    if (preference === "system") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, preference);
  } catch {
    // Private mode or blocked storage: the theme still changes for this visit.
  }
  paint(resolve(preference));
  window.dispatchEvent(new Event(EVENT));
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
