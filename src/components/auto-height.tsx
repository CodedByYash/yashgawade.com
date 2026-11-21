"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ease } from "@/lib/motion";

/**
 * Animates its own height whenever its content changes size, so lists that
 * grow or shrink (like "+4 more") push what is below them down smoothly
 * instead of jumping. A few pixels of padding keep focus rings from being cut.
 */
export function AutoHeight({ children, className }: { children: React.ReactNode; className?: string }) {
  const inner = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.borderBoxSize?.[0]?.blockSize ?? el.getBoundingClientRect().height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      className={`-m-1 overflow-hidden p-1 ${className ?? ""}`}
      initial={false}
      // `auto` until measured, so the server markup and the first paint match.
      animate={{ height: height === null ? "auto" : height + 8 }}
      transition={{ duration: 0.65, ease }}
    >
      <div ref={inner} className="flow-root">
        {children}
      </div>
    </motion.div>
  );
}
