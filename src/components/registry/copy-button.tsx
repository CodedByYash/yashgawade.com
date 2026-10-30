"use client";

import { useState } from "react";
import { IconSwap } from "@/components/icon-swap";

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("error");
    }
    setTimeout(() => setState("idle"), 1800);
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={label}
        className="flex items-center gap-1.5 rounded-sm px-1.5 py-0.5 font-mono text-[11px] text-nav-muted transition-colors hover:text-foreground"
      >
        <IconSwap active={state === "copied"} from="hugeicons:copy-01" to="hugeicons:tick-02" size={16} />
        {state === "copied" ? "Copied" : state === "error" ? "Failed" : "Copy"}
      </button>
      <span role="status" className="sr-only">
        {state === "copied" ? "Copied to clipboard" : state === "error" ? "Could not copy" : ""}
      </span>
    </>
  );
}
