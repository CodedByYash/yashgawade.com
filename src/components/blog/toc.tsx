"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/blogs";
import { cn } from "@/lib/utils";

/** Highlights the heading that is currently being read. */
function useActiveHeading(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (elements.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // A heading counts once it passes under the sticky header, until the next one does.
      { rootMargin: "-80px 0px -70% 0px" },
    );
    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

function List({ headings, active }: { headings: Heading[]; active: string | null }) {
  return (
    <ol className="space-y-1.5 text-[13px] leading-5">
      {headings.map((heading) => (
        <li key={heading.id} className={heading.level === 3 ? "pl-3" : undefined}>
          <a
            href={`#${heading.id}`}
            aria-current={active === heading.id ? "location" : undefined}
            className={cn(
              "block border-l border-dashed py-0.5 pl-3 transition-colors hover:text-foreground",
              active === heading.id ? "border-foreground text-foreground" : "border-line text-muted",
            )}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

/**
 * "On this page". Sticky in the right margin on wide screens; a collapsible
 * list above the post everywhere else.
 */
export function Toc({ headings }: { headings: Heading[] }) {
  const ids = headings.map((h) => h.id);
  const active = useActiveHeading(ids);
  if (headings.length < 2) return null;

  return (
    <>
      <details className="group mb-6 border border-dashed border-chip-line bg-chip px-4 py-2 min-[1320px]:hidden">
        <summary className="cursor-pointer list-none font-mono text-xs uppercase tracking-wide text-label marker:hidden">
          On this page
        </summary>
        <div className="pb-2 pt-3">
          <List headings={headings} active={active} />
        </div>
      </details>
      <aside
        aria-label="On this page"
        className="absolute inset-y-0 left-full ml-8 hidden w-52 min-[1320px]:block"
      >
        <div className="sticky top-24">
          <p className="mb-3 font-mono text-xs uppercase tracking-wide text-label">On this page</p>
          <List headings={headings} active={active} />
        </div>
      </aside>
    </>
  );
}
