"use client";

import { useState } from "react";
import { IconSwap } from "@/components/icon-swap";

/**
 * A prompt, shown as a prompt: wrapped plain text with a copy button, not a
 * code block. Pass the text as a string child: <Prompt>{`...`}</Prompt>.
 */
export function Prompt({ title = "Prompt", children }: { title?: string; children: string }) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(children.trim());
      setState("copied");
    } catch {
      setState("error");
    }
    setTimeout(() => setState("idle"), 1800);
  }

  return (
    <figure className="mt-4 border border-dashed border-chip-line bg-chip">
      <figcaption className="flex items-center justify-between border-b border-dashed border-chip-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-label">
        {title}
        <button
          type="button"
          onClick={copy}
          aria-label={`Copy ${title.toLowerCase()}`}
          className="flex items-center gap-1.5 normal-case text-nav-muted transition-colors hover:text-foreground"
        >
          <IconSwap active={state === "copied"} from="hugeicons:copy-01" to="hugeicons:tick-02" size={14} />
          {state === "copied" ? "Copied" : state === "error" ? "Failed" : "Copy"}
        </button>
      </figcaption>
      <p className="whitespace-pre-wrap px-4 py-3 text-[14px] leading-6">{children.trim()}</p>
    </figure>
  );
}
