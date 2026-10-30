"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconSwap } from "@/components/icon-swap";
import { duration, ease } from "@/lib/motion";

/** State + ARIA wiring for an expandable section. */
export function useDisclosure(defaultOpen = false) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  return {
    open,
    panelId,
    triggerProps: {
      type: "button" as const,
      "aria-expanded": open,
      "aria-controls": panelId,
      onClick: () => setOpen((value) => !value),
    },
  };
}

/** unfold-less when open, unfold-more when closed — matches the Figma icons. */
export function UnfoldIcon({ open, className }: { open: boolean; className?: string }) {
  return (
    <IconSwap
      active={open}
      from="hugeicons:unfold-more"
      to="hugeicons:unfold-less"
      className={className ?? "text-nav-muted"}
    />
  );
}

/** Height-animated panel. Content stays in the DOM only while open. */
export function Collapse({
  open,
  id,
  children,
}: {
  open: boolean;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key="panel"
          id={id}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: duration.base, ease }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
