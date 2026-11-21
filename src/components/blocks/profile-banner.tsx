"use client";

import Image from "next/image";
import { useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Item, Reveal, Stagger } from "@/components/motion";
import { Band } from "@/components/panel";
import { photos } from "@/data/profile";
import { ease } from "@/lib/motion";

const dots = (alpha: number, size: number) =>
  `radial-gradient(color-mix(in srgb, var(--foreground) ${alpha}%, transparent) ${size}px, transparent ${size + 0.7}px)`;

const tilt = [-7, 4, -3, 6, -5];

/** One polaroid-style frame: floats gently, shifts with the cursor, lifts and straightens on hover. */
function Frame({ index, nx, photo }: { index: number; nx: MotionValue<number>; photo: (typeof photos)[number] }) {
  const reduce = useReducedMotion();
  const x = useTransform(nx, (v) => v * -(8 + index * 7));
  return (
    <Item as="div" className={index === 0 ? "" : "-ml-5 sm:-ml-6"}>
      <motion.div style={{ x }}>
        <motion.div
          animate={reduce ? undefined : { y: [0, -4, 0] }}
          transition={{ duration: 5 + index * 0.7, ease: "easeInOut", repeat: Infinity, delay: index * 0.4 }}
        >
          <motion.figure
            className="relative w-[78px] border border-dashed border-box-line bg-background p-1 shadow-[0_10px_24px_-12px_var(--popup-shadow)] sm:w-[104px] sm:p-[5px]"
            style={{ rotate: tilt[index % tilt.length], zIndex: index }}
            whileHover={{ rotate: 0, y: -16, scale: 1.1, zIndex: 20 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={240}
              height={300}
              unoptimized
              draggable={false}
              className="aspect-[4/5] w-full object-cover"
            />
          </motion.figure>
        </motion.div>
      </motion.div>
    </Item>
  );
}

/**
 * Banner between the navbar and the profile header. A field of dots lights up
 * under the cursor, a strip of photos rises from the bottom edge and drifts
 * with the pointer, and the avatar (in the next block) overlaps the banner's
 * bottom edge.
 */
export function ProfileBanner() {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const px = useMotionValue(-300);
  const py = useMotionValue(-300);
  const nx = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 220, damping: 28 });
  const sy = useSpring(py, { stiffness: 220, damping: 28 });
  const snx = useSpring(nx, { stiffness: 90, damping: 20 });

  const lit = useMotionTemplate`radial-gradient(170px circle at ${sx}px ${sy}px, #000 0%, transparent 100%)`;
  const glow = useMotionTemplate`radial-gradient(260px circle at ${sx}px ${sy}px, color-mix(in srgb, var(--foreground) 9%, transparent), transparent)`;

  return (
    <Band edge="bottom" columnClassName="relative h-[150px] overflow-hidden bg-box/40 sm:h-[190px]">
      <div
        className="absolute inset-0"
        onPointerMove={(event) => {
          const box = event.currentTarget.getBoundingClientRect();
          px.set(event.clientX - box.left);
          py.set(event.clientY - box.top);
          nx.set((event.clientX - box.left) / box.width - 0.5);
        }}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => {
          setHovered(false);
          px.set(-300);
          py.set(-300);
          nx.set(0);
        }}
      >
        <div aria-hidden className="absolute inset-0" style={{ backgroundImage: dots(20, 1), backgroundSize: "14px 14px" }} />
        {!reduce && (
          <>
            <motion.div aria-hidden className="absolute inset-0" style={{ background: glow }} />
            <motion.div
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage: dots(75, 1.6),
                backgroundSize: "14px 14px",
                maskImage: lit,
                WebkitMaskImage: lit,
              }}
            />
          </>
        )}

        <Reveal
          as="p"
          kind="fade"
          delay={0.4}
          className="absolute left-4 top-3 font-mono text-[11px] font-medium uppercase tracking-wide text-muted"
        >
          Pune, India · 18.52°N 73.86°E
        </Reveal>

        <motion.div
          className="absolute inset-x-0 bottom-0 flex justify-end pr-5 sm:pr-12"
          initial={false}
          animate={{ y: hovered ? 4 : 22 }}
          transition={{ duration: 0.6, ease }}
        >
          <Stagger as="div" dir="soft" speed="fast" offset={4} className="flex items-end">
            {photos.map((photo, i) => (
              <Frame key={photo.src} index={i} nx={snx} photo={photo} />
            ))}
          </Stagger>
        </motion.div>
      </div>
    </Band>
  );
}
