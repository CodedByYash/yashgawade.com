"use client";

import { Icon } from "@/components/icon";
import { setThemePreference, useResolvedTheme } from "@/lib/theme";

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
      onClick={() => setThemePreference(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      title="Toggle theme"
      className={className}
    >
      <Icon name="custom:sun-solid" size={20} className="dark:hidden" />
      <Icon name="hugeicons:moon-02" size={20} className="hidden dark:block" />
    </button>
  );
}
