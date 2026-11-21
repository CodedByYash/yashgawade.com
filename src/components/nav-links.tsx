"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { Enter } from "@/components/motion";
import { nav } from "@/data/profile";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary">
      <ul className="flex items-center gap-3 font-nav text-sm font-medium min-[360px]:gap-4 sm:gap-6">
        {nav.map((item, index) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Enter as="li" key={item.href} kind="drop" delay={0.2 + index * 0.09}>
              <MotionLink
                href={item.href}
                aria-current={active ? "page" : undefined}
                initial="rest"
                whileHover="hover"
                whileFocus="hover"
                className={cn(
                  // py-3 grows the tap target to ~41px without moving the text.
                  "relative block py-3 transition-colors duration-500 hover:text-nav-active",
                  active ? "text-nav-active" : "text-nav-muted",
                )}
              >
                {item.label}
                {active ? (
                  <motion.span
                    layoutId="nav-underline"
                    aria-hidden
                    className="absolute inset-x-0 bottom-2 h-px bg-nav-active"
                    transition={{ duration: duration.slow, ease }}
                  />
                ) : (
                  <motion.span
                    aria-hidden
                    className="absolute inset-x-0 bottom-2 h-px origin-left bg-nav-active"
                    variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                    transition={{ duration: 0.5, ease }}
                  />
                )}
              </MotionLink>
            </Enter>
          );
        })}
      </ul>
    </nav>
  );
}
