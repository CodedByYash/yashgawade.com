"use client";

import { MotionConfig } from "motion/react";

/**
 * Makes every Motion animation honour the visitor's "reduce motion" setting
 * (transform and layout animations are skipped, opacity still fades).
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
