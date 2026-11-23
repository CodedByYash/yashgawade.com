"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AutoHeight } from "@/components/auto-height";
import { tagClass } from "@/components/chips";
import { Item, Stagger } from "@/components/motion";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Tag list that shows the first `limit` items and folds the rest behind "+N more".
 * Tags arrive left to right, blurred then sharp. Pressing "+N more" brings the
 * hidden tags in one by one while the list grows smoothly; "Show less" fades
 * them out and then closes the gap.
 */
export function ExpandableTags({
  items,
  limit = 8,
  className,
  offset = 0,
}: {
  items: string[];
  limit?: number;
  className?: string;
  /** Delays the first reveal by this many steps, so a list can follow other content. */
  offset?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const hidden = items.length - limit;
  const alwaysShown = hidden <= 0 ? items : items.slice(0, limit);
  const extras = hidden > 0 ? items.slice(limit) : [];

  return (
    <AutoHeight>
      <Stagger id={id} dir="blur-right" speed="fast" offset={offset} className={cn("flex flex-wrap gap-2.5 py-[3px]", className)}>
        {alwaysShown.map((item) => (
          <Item key={item} className={tagClass}>
            {item}
          </Item>
        ))}
        <AnimatePresence initial={false}>
          {expanded &&
            extras.map((item, j) => (
              <motion.li
                key={item}
                className={tagClass}
                initial={{ opacity: 0, x: -14, scale: 0.96, filter: "blur(8px)" }}
                animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.75, ease, delay: j * 0.07 } }}
                exit={{
                  opacity: 0,
                  x: 16,
                  scale: 0.94,
                  filter: "blur(8px)",
                  transition: { duration: 0.5, ease, delay: (extras.length - 1 - j) * 0.06 },
                }}
              >
                {item}
              </motion.li>
            ))}
        </AnimatePresence>
        {hidden > 0 && (
          <Item className="flex">
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={id}
              onClick={() => setExpanded((value) => !value)}
              className="border border-dashed border-tag-line-first bg-tag px-2 py-0.5 text-xs font-semibold leading-[1.8] text-muted transition-[color,background-color] duration-500 hover:bg-chip hover:text-foreground"
            >
              {expanded ? "Show less" : `+${hidden} more`}
            </button>
          </Item>
        )}
      </Stagger>
    </AutoHeight>
  );
}
