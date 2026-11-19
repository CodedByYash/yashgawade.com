"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { nav } from "@/data/profile";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary">
      <ul className="flex items-center gap-3 font-nav text-sm font-medium min-[360px]:gap-4 sm:gap-6">
        {nav.map((item, index) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href} className="nav-in" style={{ "--d": `${200 + index * 90}ms` } as React.CSSProperties}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  // py-3 grows the tap target to ~41px without moving the text.
                  "relative block py-3 transition-colors duration-500 hover:text-nav-active",
                  active
                    ? "text-nav-active"
                    : "text-nav-muted after:absolute after:inset-x-0 after:bottom-2 after:h-px after:origin-left after:scale-x-0 after:bg-nav-active after:transition-transform after:duration-500 after:ease-(--ease-out) hover:after:scale-x-100",
                )}
              >
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    aria-hidden
                    className="absolute inset-x-0 bottom-2 h-px bg-nav-active"
                    transition={{ duration: duration.slow, ease }}
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
