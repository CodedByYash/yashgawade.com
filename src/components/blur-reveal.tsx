"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

const STAGGER = 30; // ms between letters (keep in sync with globals.css)
const LETTER = 560; // ms one letter takes to sharpen
const FIRST_DELAY = 600; // first line waits for the rest of the hero to arrive
const NEXT_DELAY = 80;
const HOLD = 2800; // how long a finished line stays
const LEAVE = 300; // fade-out before the next line starts

function Line({ text, base }: { text: string; base: number }) {
  let index = 0;
  return (
    <span style={{ "--base": `${base}ms` } as React.CSSProperties}>
      {text.split(" ").map((word, w) => (
        <span key={w}>
          {w > 0 && " "}
          <span className="blur-word">
            {Array.from(word).map((char, c) => (
              <span
                key={c}
                className="blur-char"
                style={{ "--i": index++ } as React.CSSProperties}
              >
                {char}
              </span>
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
          <span
            key={text}
            data-leaving={i === current && leaving}
            className={`blur-line col-start-1 row-start-1 ${i === current ? "" : "invisible"}`}
          >
            {i === current ? <Line text={text} base={step === 0 ? FIRST_DELAY : NEXT_DELAY} /> : text}
          </span>
        ))}
      </span>
    </>
  );
}
