import Link from "next/link";
import { Icon } from "@/components/icon";
import { NavLinks } from "@/components/nav-links";
import { Band } from "@/components/panel";
import { Logo } from "@/components/pixel-grid";
import { SiteSearch } from "@/components/search/site-search";
import { ThemeToggle } from "@/components/theme-toggle";
import { socials } from "@/data/profile";

const iconButton =
  "flex size-9 items-center justify-center rounded-md text-foreground transition-[background-color,scale] duration-500 hover:bg-foreground/10 active:scale-90";

export function SiteHeader() {
  const github = socials.find((s) => s.label === "GitHub");

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      {/* Reading progress: a thin line that fills as the page scrolls (browsers without scroll timelines never show it). */}
      <span aria-hidden className="scroll-progress pointer-events-none absolute inset-x-0 bottom-0 z-10 h-0.5 bg-foreground/70" />
      {/* The design draws the navbar's bottom line dashed, like the rails. */}
      <Band
        edge="none"
        className="border-b border-dashed"
        columnClassName="flex h-[60px] items-center justify-between px-[17px]"
      >
        <Link href="/" aria-label="Yash Gawade — home" className="nav-in rounded-sm" style={{ "--d": "0ms" } as React.CSSProperties}>
          <Logo />
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <NavLinks />

          <div className="nav-in" style={{ "--d": "460ms" } as React.CSSProperties}>
            <SiteSearch />
          </div>

          {github && (
            <a
              href={github.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className={`${iconButton} nav-in max-[399px]:hidden`}
              style={{ "--d": "540ms" } as React.CSSProperties}
            >
              <Icon name={github.icon} size={20} />
            </a>
          )}

          {/* Hidden on the narrowest phones to keep the header on one line; the search menu has theme actions too. */}
          <ThemeToggle className={`${iconButton} nav-in max-[359px]:hidden`} style={{ "--d": "620ms" } as React.CSSProperties} />
        </div>
      </Band>
    </header>
  );
}
