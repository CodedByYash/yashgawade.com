"use client";

import { motion } from "motion/react";
import { Icon } from "@/components/icon";
import type { IconName } from "@/lib/icons.generated";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

const swap = "col-start-1 row-start-1 flex";

/**
 * Two icons in one spot. When `active` flips, the old one spins out while the
 * new one spins in (copy → tick, unfold-more → unfold-less).
 */
export function IconSwap({
  active,
  from,
  to,
  size = 20,
  className,
}: {
  active: boolean;
  from: IconName;
  to: IconName;
  size?: number;
  className?: string;
}) {
  const hidden = (turn: number) => ({ rotate: turn, scale: 0.5, opacity: 0 });
  const shown = { rotate: 0, scale: 1, opacity: 1 };
  return (
    <span className={cn("inline-grid shrink-0 place-items-center", className)}>
      <motion.span className={swap} initial={false} animate={active ? hidden(90) : shown} transition={{ duration: 0.3, ease }}>
        <Icon name={from} size={size} />
      </motion.span>
      <motion.span className={swap} initial={false} animate={active ? shown : hidden(-90)} transition={{ duration: 0.3, ease }}>
        <Icon name={to} size={size} />
      </motion.span>
    </span>
  );
}
