"use client";

/**
 * Every animation on the site is built from the pieces in this file, and all
 * of them run on Motion. Components that scroll into view animate once; pieces
 * that loop (shine, ring, rails, hatch) stop for visitors who ask for reduced
 * motion, and scroll reveals simply show the finished content.
 */

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  type Variants,
} from "motion/react";
import { ease } from "@/lib/motion";

const viewport = { once: true, margin: "0px 0px -8% 0px" } as const;

/* ------------------------------------------------------------------ */
/* Staggered lists                                                     */
/* ------------------------------------------------------------------ */

type Dir = "up" | "down" | "left" | "right" | "blur-right" | "soft";

const DIRS: Record<Dir, { x: number; y: number; blur: number; scale: number }> = {
  up: { x: 0, y: 14, blur: 6, scale: 1 },
  down: { x: 0, y: -14, blur: 6, scale: 1 },
  right: { x: -20, y: 0, blur: 6, scale: 1 },
  left: { x: 20, y: 0, blur: 6, scale: 1 },
  "blur-right": { x: -12, y: 0, blur: 9, scale: 0.96 },
  soft: { x: 0, y: 14, blur: 8, scale: 0.94 },
};

const SPEEDS = {
  normal: { step: 0.1, dur: 0.8 },
  slow: { step: 0.09, dur: 1.2 },
  fast: { step: 0.06, dur: 0.7 },
} as const;

const StaggerContext = createContext<{ dir: Dir; dur: number }>({ dir: "up", dur: 0.8 });

const staggerTags = { div: motion.div, ul: motion.ul, ol: motion.ol, p: motion.p, h3: motion.h3 };
const itemTags = { li: motion.li, div: motion.div, span: motion.span, a: motion.a };

/**
 * A group whose <Item> children arrive one after another when it scrolls into
 * view. `offset` delays the first child by that many steps.
 */
export function Stagger({
  as = "ul",
  dir = "up",
  speed = "normal",
  offset = 0,
  className,
  id,
  children,
}: {
  as?: keyof typeof staggerTags;
  dir?: Dir;
  speed?: keyof typeof SPEEDS;
  offset?: number;
  className?: string;
  id?: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const { step, dur } = SPEEDS[speed];
  const Tag = staggerTags[as] as typeof motion.div;
  const variants = useMemo<Variants>(
    () => ({ hidden: {}, show: { transition: { staggerChildren: step, delayChildren: offset * step } } }),
    [step, offset],
  );
  const value = useMemo(() => ({ dir, dur }), [dir, dur]);

  return (
    <StaggerContext.Provider value={value}>
      <Tag
        id={id}
        className={className}
        variants={variants}
        {...(reduce ? {} : { initial: "hidden", whileInView: "show", viewport })}
      >
        {children}
      </Tag>
    </StaggerContext.Provider>
  );
}

/** One child of a <Stagger>: it rises, slides and sharpens in on its turn. */
export function Item({
  as = "li",
  className,
  children,
}: {
  as?: keyof typeof itemTags;
  className?: string;
  children: React.ReactNode;
}) {
  const { dir, dur } = useContext(StaggerContext);
  const d = DIRS[dir];
  const Tag = itemTags[as] as typeof motion.div;
  const variants = useMemo<Variants>(
    () => ({
      hidden: { opacity: 0, x: d.x, y: d.y, scale: d.scale, filter: `blur(${d.blur}px)` },
      show: { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: dur, ease } },
    }),
    [d, dur],
  );
  return (
    <Tag className={className} variants={variants}>
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Single reveals                                                      */
/* ------------------------------------------------------------------ */

const revealKinds = {
  fade: {
    hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)" },
    duration: 0.9,
    ease: ease,
  },
  wipe: {
    hidden: { clipPath: "inset(0 100% 0 0)" },
    show: { clipPath: "inset(0 0% 0 0)" },
    duration: 0.9,
    ease: ease,
  },
  draw: {
    hidden: { clipPath: "inset(0 0 100% 0)" },
    show: { clipPath: "inset(0 0 0% 0)" },
    duration: 0.7,
    ease: ease,
  },
  pop: {
    hidden: { opacity: 0, scale: 0.4, rotate: -18, filter: "blur(6px)" },
    show: { opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" },
    duration: 0.9,
    ease: [0.34, 1.56, 0.64, 1],
  },
} as const;

const revealTags = { div: motion.div, span: motion.span, p: motion.p, h2: motion.h2, h3: motion.h3, li: motion.li };

/** Plays one entrance, once, when the element scrolls into view. */
export function Reveal({
  as = "div",
  kind = "fade",
  delay = 0,
  className,
  children,
}: {
  as?: keyof typeof revealTags;
  kind?: keyof typeof revealKinds;
  delay?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const spec = revealKinds[kind];
  const Tag = revealTags[as] as typeof motion.div;
  return (
    <Tag
      className={className}
      {...(reduce
        ? {}
        : {
            initial: spec.hidden,
            whileInView: spec.show,
            viewport,
            transition: { duration: spec.duration, ease: spec.ease, delay },
          })}
    >
      {children}
    </Tag>
  );
}

const enterKinds = {
  /** Navbar items: drop in from above. */
  drop: { from: { opacity: 0, y: -10, filter: "blur(4px)" }, to: { opacity: 1, y: 0, filter: "blur(0px)" }, ease: ease },
  /** Small badges: spring in. */
  pop: {
    from: { opacity: 0, scale: 0.4, rotate: -18, filter: "blur(6px)" },
    to: { opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" },
    ease: [0.34, 1.56, 0.64, 1],
  },
  /** Pictures: a short rise. */
  rise: { from: { opacity: 0, y: 6 }, to: { opacity: 1, y: 0 }, ease: ease },
} as const;

/** Plays one entrance as soon as the page loads (use for things above the fold). */
export function Enter({
  as = "div",
  kind,
  delay = 0,
  duration = 0.8,
  className,
  children,
}: {
  as?: keyof typeof revealTags;
  kind: keyof typeof enterKinds;
  delay?: number;
  duration?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const spec = enterKinds[kind];
  const Tag = revealTags[as] as typeof motion.div;
  return (
    <Tag
      className={className}
      initial={reduce ? false : spec.from}
      animate={spec.to}
      transition={{ duration, ease: spec.ease, delay }}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Titles                                                              */
/* ------------------------------------------------------------------ */

const letterVariants: Variants = {
  hidden: { opacity: 0, y: "0.5em", rotate: 4, filter: "blur(6px)" },
  show: (i: number) => ({
    opacity: 1,
    y: "0em",
    rotate: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease, delay: i * 0.038 },
  }),
};

/**
 * Text split into words and letters. When it scrolls into view each letter
 * rises and sharpens in turn. Words stay whole, so wrapping never breaks one
 * in half, and screen readers get the plain text.
 */
export function Letters({ text }: { text: string }) {
  const reduce = useReducedMotion();
  let index = 0;
  return (
    <>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        {...(reduce ? {} : { initial: "hidden", whileInView: "show", viewport })}
      >
        {text.split(" ").map((word, w) => (
          <span key={w}>
            {w > 0 && " "}
            <span className="inline-block whitespace-nowrap">
              {Array.from(word).map((char, c) => (
                <motion.span key={c} className="inline-block" variants={letterVariants} custom={index++}>
                  {char}
                </motion.span>
              ))}
            </span>
          </span>
        ))}
      </motion.span>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Glint: shine + travelling ring                                      */
/* ------------------------------------------------------------------ */

/** A soft glint crosses the parent every few seconds. The parent needs `relative`. */
export function Shine({ index = 0 }: { index?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-[inherit]">
      <motion.span
        className="absolute inset-0"
        style={{ backgroundImage: "linear-gradient(105deg, transparent 25%, var(--shine) 50%, transparent 75%)" }}
        initial={{ x: "-130%" }}
        animate={{ x: ["-130%", "-130%", "130%", "130%"] }}
        transition={{
          duration: 5.2,
          times: [0, 0.58, 0.82, 1],
          ease: ["linear", ease, "linear"],
          repeat: Infinity,
          delay: 1.2 + index * 0.7,
        }}
      />
    </span>
  );
}

/** A bright arc travels round the parent's border. The parent needs `relative`. */
export function Ring({ index = 0 }: { index?: number }) {
  const reduce = useReducedMotion();
  const start = ((index * 1.1) / 4.5) * 360;
  const angle = useMotionValue(start);
  const background = useMotionTemplate`conic-gradient(from ${angle}deg, transparent 0 72%, var(--ring) 90%, transparent 100%)`;

  useEffect(() => {
    if (reduce) return;
    const controls = animate(angle, start + 360, { duration: 4.5, ease: "linear", repeat: Infinity });
    return () => controls.stop();
  }, [angle, start, reduce]);

  if (reduce) return null;
  return <motion.span aria-hidden className="ring-arc pointer-events-none absolute -inset-px z-[2] rounded-[inherit]" style={{ background }} />;
}

/** Shine and ring together, for the round and square icon boxes. */
export function Glint({ index = 0, ring = true }: { index?: number; ring?: boolean }) {
  return (
    <>
      {ring && <Ring index={index} />}
      <Shine index={index} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Lines and dividers                                                  */
/* ------------------------------------------------------------------ */

/** 40px hatched divider: wipes in once, then the stripes crawl slowly. */
export function Hatch() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      className="h-10 w-full overflow-hidden border-y border-line"
      {...(reduce
        ? {}
        : {
            initial: { clipPath: "inset(0 100% 0 0)" },
            whileInView: { clipPath: "inset(0 0% 0 0)" },
            viewport,
            transition: { duration: 0.9, ease },
          })}
    >
      <motion.div
        className="hatch size-full"
        animate={reduce ? undefined : { backgroundPosition: ["0px 0px", "10px 0px"] }}
        transition={{ duration: 3.5, ease: "linear", repeat: Infinity }}
      />
    </motion.div>
  );
}

/** A light sweeps along the bottom edge of a heading band. The band needs `relative`. */
export function Sweep() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <span aria-hidden className="pointer-events-none absolute inset-x-0 -bottom-px h-px overflow-hidden">
      <motion.span
        className="block h-px w-[30%]"
        style={{ backgroundImage: "linear-gradient(90deg, transparent, var(--pulse) 50%, transparent)" }}
        initial={{ x: "-100%" }}
        whileInView={{ x: "340%" }}
        viewport={viewport}
        transition={{ duration: 1.5, delay: 0.2, ease: [0.45, 0, 0.2, 1] }}
      />
    </span>
  );
}

/** Thin line under the header that fills as the page scrolls. */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });
  if (reduce) return null;
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-0.5 bg-foreground/70"
      style={{ scaleX, transformOrigin: "left" }}
    />
  );
}

const pulseLine = {
  width: 1,
  height: 220,
  background: "linear-gradient(transparent, var(--pulse) 55%, transparent)",
  boxShadow: "0 0 5px 0 var(--pulse)",
} as const;

/** Two thin lights run down the dashed rails now and then. Place inside a `relative` page. */
export function RailPulse() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-clip">
      <motion.div
        className="absolute"
        style={{ ...pulseLine, left: "max(0px, calc(50% - 390px))" }}
        initial={{ top: "-220px" }}
        animate={{ top: ["-220px", "100%", "100%"] }}
        transition={{ duration: 11, times: [0, 0.62, 1], ease: "linear", repeat: Infinity }}
      />
      <motion.div
        className="absolute"
        style={{ ...pulseLine, left: "min(calc(100% - 1px), calc(50% + 389px))" }}
        initial={{ bottom: "-220px" }}
        animate={{ bottom: ["-220px", "100%", "100%"] }}
        transition={{ duration: 11, times: [0, 0.62, 1], ease: "linear", repeat: Infinity, delay: 5 }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Marching dashes                                                     */
/* ------------------------------------------------------------------ */

/**
 * On hover (or keyboard focus) of its parent, the parent's dashed border is
 * redrawn as four strips of dashes that crawl round the box. The parent needs
 * `relative` and a 1px dashed border.
 */
export function March({ color = "var(--foreground)" }: { color?: string }) {
  const reduce = useReducedMotion();
  const anchor = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const parent = anchor.current?.parentElement;
    if (!parent || reduce) return;
    const enter = () => {
      parent.style.borderColor = "transparent";
      setOn(true);
    };
    const leave = () => {
      parent.style.borderColor = "";
      setOn(false);
    };
    parent.addEventListener("pointerenter", enter);
    parent.addEventListener("pointerleave", leave);
    parent.addEventListener("focusin", enter);
    parent.addEventListener("focusout", leave);
    return () => {
      parent.removeEventListener("pointerenter", enter);
      parent.removeEventListener("pointerleave", leave);
      parent.removeEventListener("focusin", enter);
      parent.removeEventListener("focusout", leave);
      parent.style.borderColor = "";
    };
  }, [reduce]);

  const dash = (angle: number) => `linear-gradient(${angle}deg, ${color} 50%, transparent 50%)`;

  return (
    <span ref={anchor} aria-hidden className="pointer-events-none absolute -inset-px">
      <AnimatePresence>
        {on && (
          <motion.span
            key="dashes"
            className="absolute inset-0"
            style={{
              backgroundImage: [dash(90), dash(180), dash(90), dash(180)].join(", "),
              backgroundSize: "6px 1px, 1px 6px, 6px 1px, 1px 6px",
              backgroundRepeat: "repeat-x, repeat-y, repeat-x, repeat-y",
            }}
            initial={{ opacity: 0, backgroundPosition: "0px 0px, 100% 0px, 0px 100%, 0px 0px" }}
            animate={{ opacity: 1, backgroundPosition: "6px 0px, 100% 6px, -6px 100%, 0px -6px" }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{
              opacity: { duration: 0.2 },
              backgroundPosition: { duration: 0.45, ease: "linear", repeat: Infinity },
            }}
          />
        )}
      </AnimatePresence>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Metal text and the name reveal                                      */
/* ------------------------------------------------------------------ */

/** Steel-gradient text with a sheen that sweeps across every few seconds. */
export function MetalText({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className="metal-text"
      animate={reduce ? undefined : { backgroundPosition: ["100% 0%, 0% 0%", "0% 0%, 0% 0%", "0% 0%, 0% 0%"] }}
      transition={{ duration: 8, times: [0, 0.24, 1], ease, repeat: Infinity, delay: 1.4 }}
    >
      {children}
    </motion.span>
  );
}

const nameEase = [0.65, 0, 0.2, 1] as const;

/** The name is wiped in from the left while a thin scanner bar rides the edge. */
export function NameReveal({
  as = "h1",
  className,
  children,
}: {
  as?: "h1" | "h2";
  className?: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const Heading = (as === "h1" ? motion.h1 : motion.h2) as typeof motion.h1;
  return (
    <div className="relative">
      <Heading
        className={className}
        initial={reduce ? false : { clipPath: "inset(-10% 100% -10% 0)", filter: "blur(10px)", opacity: 0.2 }}
        animate={{ clipPath: "inset(-10% -4% -10% 0)", filter: "blur(0px)", opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.15, ease: nameEase }}
      >
        <MetalText>{children}</MetalText>
      </Heading>
      {!reduce && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -bottom-0.5 -top-0.5 w-0.5 rounded-sm"
          style={{
            background: "linear-gradient(transparent, var(--ring), transparent)",
            boxShadow: "0 0 14px 2px var(--pulse)",
          }}
          initial={{ left: "0%", opacity: 0 }}
          animate={{ left: ["0%", "100%"], opacity: [1, 1, 0] }}
          transition={{
            left: { duration: 1.4, delay: 0.15, ease: nameEase },
            opacity: { duration: 1.4, delay: 0.15, times: [0, 0.88, 1], ease: "linear" },
          }}
        />
      )}
    </div>
  );
}
