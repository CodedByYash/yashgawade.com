import Link from "next/link";
import { Icon } from "@/components/icon";
import { Enter, ScrollProgress } from "@/components/motion";
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
      <ScrollProgress />
      {/* The design draws the navbar's bottom line dashed, like the rails. */}
      <Band
        edge="none"
        className="border-b border-dashed"
        columnClassName="flex h-[60px] items-center justify-between px-[17px]"
      >
        <Enter as="div" kind="drop">
          <Link href="/" aria-label="Yash Gawade — home" className="block rounded-sm">
            <Logo />
          </Link>
        </Enter>

        <div className="flex items-center gap-2 sm:gap-4">
          <NavLinks />

          <Enter as="div" kind="drop" delay={0.46}>
            <SiteSearch />
          </Enter>

          {github && (
            <Enter as="div" kind="drop" delay={0.54} className="max-[399px]:hidden">
              <a
                href={github.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className={iconButton}
              >
                <Icon name={github.icon} size={20} />
              </a>
            </Enter>
          )}

          {/* Hidden on the narrowest phones to keep the header on one line; the search menu has theme actions too. */}
          <Enter as="div" kind="drop" delay={0.62} className="max-[359px]:hidden">
            <ThemeToggle className={iconButton} />
          </Enter>
        </div>
      </Band>
    </header>
  );
}
