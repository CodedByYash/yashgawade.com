"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/data/profile";
import { cn } from "@/lib/utils";

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary">
      <ul className="flex items-center gap-4 font-nav sm:gap-6 text-sm font-medium">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  // py-3 grows the tap target to ~41px without moving the text.
                  "block py-3 transition-colors hover:text-nav-active",
                  active ? "text-nav-active" : "text-nav-muted",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
