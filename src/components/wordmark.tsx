"use client";

import { useEffect, useRef } from "react";
import { WORDMARK_ROWS } from "@/components/pixel-grid";

const CELL = 10;
const GAP = 4;
const PITCH = CELL + GAP;
const RADIUS = 110; // ripple reach, in SVG units (about 8 cells)

const COLS = WORDMARK_ROWS[0].length;
const WIDTH = COLS * PITCH - GAP;
const HEIGHT = WORDMARK_ROWS.length * PITCH - GAP;

const cells = WORDMARK_ROWS.flatMap((row, y) =>
  [...row].flatMap((bit, x) => (bit === "1" ? [{ x, y, key: `${x}-${y}` }] : [])),
);

/**
 * The footer wordmark as one SVG. When it scrolls into view the pixels pop in
 * as a diagonal wave (once). Under a pointer, nearby pixels shrink away from
 * the cursor and spring back, like a ripple. Both are skipped for visitors who
 * ask for reduced motion.
 */
export function Wordmark({ className }: { className?: string }) {
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = svg.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rects = Array.from(el.querySelectorAll("rect"));
    const last = new Float32Array(rects.length);
    let frame = 0;
    let point: { x: number; y: number } | null = null;

    const paint = () => {
      frame = 0;
      const box = el.getBoundingClientRect();
      const scale = WIDTH / box.width;
      rects.forEach((rect, i) => {
        let level = 0;
        if (point) {
          const cx = Number(rect.dataset.cx);
          const cy = Number(rect.dataset.cy);
          const px = (point.x - box.left) * scale;
          const py = (point.y - box.top) * scale;
          const near = 1 - Math.hypot(cx - px, cy - py) / RADIUS;
          level = near > 0 ? near * near : 0;
        }
        // Only touch pixels whose value changed, so the page stays cheap.
        // A pixel going back to rest always resets fully.
        if (level === last[i] || (level !== 0 && Math.abs(level - last[i]) < 0.02)) return;
        last[i] = level;
        rect.style.scale = level === 0 ? "" : String(1 - 0.85 * level);
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const move = (event: PointerEvent) => {
      point = { x: event.clientX, y: event.clientY };
      schedule();
    };
    const leave = () => {
      point = null;
      schedule();
    };

    // The wave plays the first time the wordmark is on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("in");
        io.disconnect();
      },
      { threshold: 0.3 },
    );
    io.observe(el);

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <svg
      ref={svg}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      width={WIDTH}
      height={HEIGHT}
      role="img"
      aria-label="Yash Gawade"
      className={`pixel-wave ${className ?? ""}`}
      shapeRendering="crispEdges"
    >
      {cells.map(({ x, y, key }) => (
        <rect
          key={key}
          x={x * PITCH}
          y={y * PITCH}
          width={CELL}
          height={CELL}
          fill="var(--wordmark)"
          data-cx={x * PITCH + CELL / 2}
          data-cy={y * PITCH + CELL / 2}
          style={{ "--k": x + y * 0.6 } as React.CSSProperties}
        />
      ))}
    </svg>
  );
}
