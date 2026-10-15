"use client";

import { useId, useState } from "react";
import { Tag } from "@/components/chips";
import { cn } from "@/lib/utils";

/** Tag list that shows the first `limit` items and folds the rest behind "+N more". */
export function ExpandableTags({
  items,
  limit = 8,
  className,
}: {
  items: string[];
  limit?: number;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const hidden = items.length - limit;
  const visible = expanded || hidden <= 0 ? items : items.slice(0, limit);

  return (
    <ul id={id} className={cn("flex flex-wrap gap-2.5 py-[3px]", className)}>
      {visible.map((item) => (
        <Tag key={item}>{item}</Tag>
      ))}
      {hidden > 0 && (
        <li className="flex">
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={id}
            onClick={() => setExpanded((value) => !value)}
            className="border border-dashed border-tag-line-first bg-tag px-2 py-0.5 text-xs font-semibold leading-[1.8] text-muted transition-colors hover:text-white"
          >
            {expanded ? "Show less" : `+${hidden} more`}
          </button>
        </li>
      )}
    </ul>
  );
}
