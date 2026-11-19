"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AutoHeight } from "@/components/auto-height";
import { Tag } from "@/components/chips";
import { cn } from "@/lib/utils";

const CLOSE_MS = 300;

/**
 * Tag list that shows the first `limit` items and folds the rest behind "+N more".
 * Tags arrive left to right, blurred then sharp. Pressing "+N more" brings the
 * hidden tags in one by one while the list grows smoothly; "Show less" fades
 * them out first and then closes the gap.
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
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const id = useId();
  const hidden = items.length - limit;
  const showAll = expanded || closing || hidden <= 0;
  const visible = showAll ? items : items.slice(0, limit);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  function toggle() {
    window.clearTimeout(closeTimer.current);
    if (expanded) {
      setClosing(true);
      setExpanded(false);
      closeTimer.current = window.setTimeout(() => setClosing(false), CLOSE_MS);
    } else {
      setClosing(false);
      setExpanded(true);
    }
  }

  return (
    <AutoHeight>
      <ul
        id={id}
        data-reveal="stagger"
        data-dir="blur-right"
        data-speed="fast"
        style={{ "--o": offset } as React.CSSProperties}
        className={cn("flex flex-wrap gap-2.5 py-[3px]", className)}
      >
        {visible.map((item, i) => {
          const extra = i >= limit;
          return (
            <Tag
              key={item}
              className={extra ? "tag-extra" : undefined}
              data-closing={extra && closing ? "true" : undefined}
              style={extra ? ({ "--j": i - limit } as React.CSSProperties) : undefined}
            >
              {item}
            </Tag>
          );
        })}
        {hidden > 0 && (
          <li className="flex">
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={id}
              onClick={toggle}
              className="border border-dashed border-tag-line-first bg-tag px-2 py-0.5 text-xs font-semibold leading-[1.8] text-muted transition-[color,background-color] duration-500 hover:bg-chip hover:text-foreground"
            >
              {expanded ? "Show less" : `+${hidden} more`}
            </button>
          </li>
        )}
      </ul>
    </AutoHeight>
  );
}
