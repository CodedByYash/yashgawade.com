"use client";

import { useRef, useState } from "react";
import { IconSwap } from "@/components/icon-swap";

/**
 * Code block from the highlighter: the language label and a copy button sit
 * in the top-right corner. Copy reads the text that is actually on screen, so
 * highlighted lines and colours never leak into the clipboard.
 */
export function CodeBlock({ children, ...props }: React.ComponentProps<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  const language = (props as Record<string, unknown>)["data-language"] as string | undefined;

  async function copy() {
    try {
      await navigator.clipboard.writeText(ref.current?.textContent ?? "");
      setState("copied");
    } catch {
      setState("error");
    }
    setTimeout(() => setState("idle"), 1800);
  }

  return (
    <div className="relative">
      <div className="absolute right-2 top-2 z-10 flex items-center gap-1.5 font-mono text-[11px] text-muted">
        {language && language !== "plaintext" && <span aria-hidden>{language}</span>}
        <button
          type="button"
          onClick={copy}
          aria-label="Copy code"
          className="rounded-sm border border-dashed border-chip-line bg-background p-1 text-nav-muted transition-colors hover:text-foreground"
        >
          <IconSwap active={state === "copied"} from="hugeicons:copy-01" to="hugeicons:tick-02" size={14} />
        </button>
        <span role="status" className="sr-only">
          {state === "copied" ? "Code copied" : state === "error" ? "Could not copy" : ""}
        </span>
      </div>
      <pre ref={ref} {...props}>
        {children}
      </pre>
    </div>
  );
}
