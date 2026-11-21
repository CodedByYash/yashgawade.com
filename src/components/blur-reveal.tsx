"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ease } from "@/lib/motion";

const STAGGER = 30; // ms between letters
const LETTER = 560; // ms one letter takes to sharpen
const FIRST_DELAY = 600; // first line waits for the rest of the hero to arrive
const NEXT_DELAY = 80;
const HOLD = 2800; // how long a finished line stays
const LEAVE = 300; // fade-out before the next line starts

function Line({ text, base }: { text: string; base: number }) {
  let index = 0;
  return (
    <span>
      {text.split(" ").map((word, w) => (
        <span key={w}>
          {w > 0 && " "}
          <span className="inline-block whitespace-nowrap">
            {Array.from(word).map((char, c) => (
              <motion.span
                key={c}
                className="inline-block"
                initial={{ opacity: 0, filter: "blur(8px)", y: 3 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: LETTER / 1000, ease, delay: (base + index++ * STAGGER) / 1000 }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

/**
 * Rotating tagline. Each line sharpens letter by letter from the left, holds,
 * fades out, and the next line takes its place. All lines are laid out in one
 * grid cell so the box is always as tall as the longest, and nothing shifts.
 * Screen readers get the first line once, never the animation.
 */
export function BlurReveal({ lines }: { lines: readonly string[] }) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const current = step % lines.length;

  useEffect(() => {
    if (reduced || lines.length < 2) return;
    const length = Array.from(lines[current]).length;
    const base = step === 0 ? FIRST_DELAY : NEXT_DELAY;
    const shown = base + length * STAGGER + LETTER + HOLD;
    const leave = setTimeout(() => setLeaving(true), shown);
    const next = setTimeout(() => {
      setLeaving(false);
      setStep((value) => value + 1);
    }, shown + LEAVE);
    return () => {
      clearTimeout(leave);
      clearTimeout(next);
    };
  }, [step, current, lines, reduced]);

  return (
    <>
      <span className="sr-only">{lines[0]}</span>
      <span aria-hidden className="grid">
        {lines.map((text, i) => (
          <motion.span
            key={text}
            className={`col-start-1 row-start-1 ${i === current ? "" : "invisible"}`}
            initial={false}
            animate={i === current && leaving ? { opacity: 0, filter: "blur(6px)" } : { opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: LEAVE / 1000, ease }}
          >
            {i === current ? <Line text={text} base={step === 0 ? FIRST_DELAY : NEXT_DELAY} /> : text}
          </motion.span>
        ))}
      </span>
    </>
  );
}
