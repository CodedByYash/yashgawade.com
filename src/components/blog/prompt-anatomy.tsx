"use client";

import { useState } from "react";
import { IconSwap } from "@/components/icon-swap";

type Part = {
  /** Short label, e.g. "Role", "Task", "Context". */
  label: string;
  text: string;
};

/** A hue per part, spread around the colour wheel so neighbours stay distinct. */
const HUES = [265, 30, 150, 350, 200, 85];

/**
 * A prompt taken apart: each section is tinted and labelled so a reader can
 * see which words do which job. The copy button copies the prompt as plain
 * text with the labels as headings, ready to paste into a chat box.
 */
export function PromptAnatomy({ title = "Anatomy of a prompt", parts }: { title?: string; parts: Part[] }) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  const plain = parts.map((p) => `${p.label.toUpperCase()}:\n${p.text.trim()}`).join("\n\n");

  async function copy() {
    try {
      await navigator.clipboard.writeText(plain);
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
          aria-label="Copy prompt"
          className="flex items-center gap-1.5 normal-case text-nav-muted transition-colors hover:text-foreground"
        >
          <IconSwap active={state === "copied"} from="hugeicons:copy-01" to="hugeicons:tick-02" size={14} />
          {state === "copied" ? "Copied" : state === "error" ? "Failed" : "Copy"}
        </button>
      </figcaption>
      <ul className="flex flex-col gap-2 p-3">
        {parts.map((part, i) => {
          const hue = HUES[i % HUES.length];
          return (
            <li
              key={part.label}
              className="border-l-2 py-1.5 pl-3 pr-2"
              style={{
                borderColor: `oklch(0.68 0.14 ${hue})`,
                background: `oklch(0.68 0.14 ${hue} / 0.09)`,
              }}
            >
              <span
                className="font-mono text-[11px] font-semibold uppercase tracking-wide"
                style={{ color: `oklch(0.58 0.16 ${hue})` }}
              >
                {part.label}
              </span>
              <p className="mt-0.5 whitespace-pre-wrap text-[14px] leading-6">{part.text.trim()}</p>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
