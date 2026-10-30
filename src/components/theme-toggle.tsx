"use client";

import { Icon } from "@/components/icon";
import { setThemePreference, useResolvedTheme } from "@/lib/theme";

const spin =
  "absolute inset-0 transition-[rotate,scale,opacity] duration-500 ease-(--ease-out)";

/**
 * Header button: shows a sun in light mode and a moon in dark mode, and
 * switches to the other one. Which icon shows is decided by CSS from the
 * class on <html>, so server and browser always render the same markup.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useResolvedTheme();

  return (
    <button
      type="button"
      onClick={(event) => {
        const box = event.currentTarget.getBoundingClientRect();
        setThemePreference(theme === "dark" ? "light" : "dark", {
          x: box.left + box.width / 2,
          y: box.top + box.height / 2,
        });
      }}
      aria-label="Toggle theme"
      title="Toggle theme"
      className={className}
    >
      <span className="relative block size-5">
        <Icon
          name="custom:sun-solid"
          size={20}
          className={`${spin} dark:-rotate-90 dark:scale-50 dark:opacity-0`}
        />
        <Icon
          name="hugeicons:moon-02"
          size={20}
          className={`${spin} rotate-90 scale-50 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100`}
        />
      </span>
    </button>
  );
}
