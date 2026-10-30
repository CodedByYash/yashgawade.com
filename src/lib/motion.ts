/** Shared motion tokens. The same curve is `--ease-out` in globals.css. */
export const ease = [0.22, 1, 0.36, 1] as const;

export const duration = {
  /** Hover and icon swaps. */
  fast: 0.15,
  /** Panels opening and closing. */
  base: 0.22,
  /** Things entering the page. */
  slow: 0.4,
} as const;
