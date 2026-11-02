"use client";

import { useId, useRef, useState } from "react";

/**
 * The same example in several languages. Each child is a code block; `labels`
 * names them in order: <CodeTabs labels={["JSON", "TypeScript"]}>
 */
export function CodeTabs({ labels, children }: { labels: string[]; children: React.ReactNode }) {
  const panels = Array.isArray(children) ? children : [children];
  const [active, setActive] = useState(0);
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: React.KeyboardEvent, index: number) {
    const last = labels.length - 1;
    const next =
      event.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : event.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <div className="mt-4">
      <div role="tablist" aria-label="Code language" className="flex gap-px overflow-x-auto font-mono text-xs">
        {labels.map((label, i) => (
          <button
            key={label}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={active === i}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(event) => onKeyDown(event, i)}
            className={`border border-b-0 border-dashed border-chip-line px-3 py-1.5 transition-colors ${
              active === i ? "bg-chip text-foreground" : "text-nav-muted hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {panels.map((panel, i) => (
        <div
          key={labels[i] ?? i}
          role="tabpanel"
          id={`${id}-panel-${i}`}
          aria-labelledby={`${id}-tab-${i}`}
          hidden={active !== i}
          className="[&>figure]:mt-0"
        >
          {panel}
        </div>
      ))}
    </div>
  );
}
