"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ease } from "@/lib/motion";
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

const pixel: Variants = {
  hidden: { opacity: 0, scale: 0.1 },
  show: (k: number) => ({ opacity: 1, scale: 1, transition: { duration: 0.52, ease, delay: k * 0.016 } }),
};

/**
 * The footer wordmark as one SVG. When it scrolls into view the pixels pop in
 * as a diagonal wave (once). Under a pointer, nearby pixels shrink away from
 * the cursor and spring back, like a ripple. Both are skipped for visitors who
 * ask for reduced motion.
 */
export function Wordmark({ className }: { className?: string }) {
  const svg = useRef<SVGSVGElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = svg.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rects = Array.from(el.querySelectorAll("rect"));
    const shown = new Float32Array(rects.length);
    let frame = 0;
    let point: { x: number; y: number } | null = null;

    // Pixels glide toward their target size a little each frame, so the ripple is smooth.
    const paint = () => {
      frame = 0;
      const box = el.getBoundingClientRect();
      const scale = WIDTH / box.width;
      let moving = false;
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
        const diff = level - shown[i];
        if (Math.abs(diff) < 0.004) {
          if (shown[i] !== level) {
            shown[i] = level;
            rect.style.scale = level === 0 ? "" : String(1 - 0.85 * level);
          }
          return;
        }
        moving = true;
        shown[i] += diff * 0.22;
        rect.style.scale = String(1 - 0.85 * shown[i]);
      });
      if (moving) schedule();
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

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <motion.svg
      ref={svg}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      width={WIDTH}
      height={HEIGHT}
      role="img"
      aria-label="Yash Gawade"
      className={className}
      shapeRendering="crispEdges"
      variants={{ hidden: {}, show: {} }}
      {...(reduce ? {} : { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.3 } })}
    >
      {cells.map(({ x, y, key }) => (
        <motion.rect
          key={key}
          x={x * PITCH}
          y={y * PITCH}
          width={CELL}
          height={CELL}
          fill="var(--wordmark)"
          data-cx={x * PITCH + CELL / 2}
          data-cy={y * PITCH + CELL / 2}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          variants={pixel}
          custom={x + y * 0.6}
        />
      ))}
    </motion.svg>
  );
}
