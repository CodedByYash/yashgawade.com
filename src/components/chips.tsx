"use client";

import { motion, type Variants } from "motion/react";
import { Icon } from "@/components/icon";
import { Item, March, Shine } from "@/components/motion";
import { ease } from "@/lib/motion";
import type { IconName } from "@/lib/icons.generated";
import { cn } from "@/lib/utils";

const chipClass =
  "relative group flex items-center justify-center gap-2.5 border border-dashed border-chip-line bg-chip px-2 py-1 font-mono text-xs font-medium text-chip-text transition-[background-color,border-color] duration-500";

const arrow: Variants = {
  rest: { width: 0, opacity: 0, x: -4 },
  hover: { width: 12, opacity: 1, x: 0 },
};

/**
 * Mono chip with an icon, used in the Stack section. With an `href` the chip
 * is a link to the tool's own site and an arrow slides in on hover.
 */
export function IconChip({
  icon,
  monochrome,
  href,
  children,
}: {
  icon: IconName;
  monochrome?: boolean;
  href?: string;
  children: React.ReactNode;
}) {
  const glyph = (
    <Icon
      name={icon}
      size={20}
      monochrome={monochrome}
      className="text-icon transition-colors duration-500 group-hover:text-foreground group-focus-visible:text-foreground"
    />
  );
  if (!href) {
    return (
      <Item className="flex">
        <motion.span className={chipClass} whileHover={{ y: -2 }} transition={{ duration: 0.4, ease }}>
          {glyph}
          <span className="whitespace-nowrap">{children}</span>
          <March color="var(--muted)" />
        </motion.span>
      </Item>
    );
  }
  return (
    <Item className="flex">
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${chipClass} hover:bg-box`}
        initial="rest"
        whileHover="hover"
        whileFocus="hover"
        transition={{ duration: 0.4, ease }}
        variants={{ rest: { y: 0 }, hover: { y: -2 } }}
      >
        {glyph}
        <span className="whitespace-nowrap">{children}</span>
        <span className="sr-only"> (opens in a new tab)</span>
        <motion.span aria-hidden variants={arrow} transition={{ duration: 0.4, ease }} className="-ml-1 flex overflow-hidden">
          <Icon name="hugeicons:arrow-up-right-01" size={12} className="shrink-0" />
        </motion.span>
        <March color="var(--muted)" />
      </motion.a>
    </Item>
  );
}

export const tagClass =
  "flex items-center justify-center border border-dashed border-tag-line bg-tag px-2 py-0.5 text-xs font-semibold leading-[1.8] text-tag-text";

/** Text-only dashed tag — skills on experience / education / projects. */
export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return <li className={cn(tagClass, className)}>{children}</li>;
}

export function TagList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-2.5 py-[3px]", className)}>
      {items.map((item) => (
        <Tag key={item}>{item}</Tag>
      ))}
    </ul>
  );
}

/** Small square icon box used beside personal details. */
export function IconBox({ icon, index = 0 }: { icon: IconName; index?: number }) {
  return (
    // 23px square: the design stacks these on a 31px row pitch (23px box + 8px gap).
    <span className="relative flex size-[23px] shrink-0 items-center justify-center border-[0.5px] border-detail-line bg-chip">
      <Icon name={icon} size={15} className="text-detail-icon" />
      <Shine index={index} />
    </span>
  );
}
