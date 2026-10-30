"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SELECTOR = "[data-reveal]";

/**
 * Plays the scroll reveals once. Elements marked `data-reveal` start hidden
 * (only when the "js" class is on <html>, see globals.css) and get the `in`
 * class the first time they scroll into view. `data-reveal="children"` also
 * staggers its direct children.
 */
export function RevealController() {
  const pathname = usePathname();

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px" },
    );

    const watch = (el: Element) => {
      if (seen.has(el) || el.classList.contains("in")) return;
      seen.add(el);
      if (el.getAttribute("data-reveal") === "children") {
        Array.from(el.children).forEach((child, i) => {
          (child as HTMLElement).style.setProperty("--i", String(Math.min(i, 14)));
        });
      }
      io.observe(el);
    };

    const scan = (root: ParentNode) => {
      if (root instanceof Element && root.matches(SELECTOR)) watch(root);
      root.querySelectorAll(SELECTOR).forEach(watch);
    };

    scan(document);
    const mo = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => node instanceof Element && scan(node));
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
