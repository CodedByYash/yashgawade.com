"use client";

import { Collapse, UnfoldIcon, useDisclosure } from "@/components/disclosure";

/** Live demo for the disclosure primitives (useDisclosure + Collapse). */
export function DisclosureDemo() {
  const { open, panelId, triggerProps } = useDisclosure(false);
  return (
    <div className="w-full max-w-xs border border-dashed border-chip-line bg-chip">
      <button {...triggerProps} className="flex w-full items-center justify-between gap-4 px-3 py-2 text-left text-sm font-medium">
        <span>{open ? "Click to collapse" : "Click to expand"}</span>
        <UnfoldIcon open={open} />
      </button>
      <Collapse open={open} id={panelId}>
        <p className="px-3 pb-3 text-sm leading-6 text-muted">
          Height animates with Motion and the trigger exposes aria-expanded and aria-controls.
        </p>
      </Collapse>
    </div>
  );
}
