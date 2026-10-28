import Link from "next/link";
import { Icon } from "@/components/icon";
import { NavLinks } from "@/components/nav-links";
import { Band } from "@/components/panel";
import { Logo } from "@/components/pixel-grid";
import { SiteSearch } from "@/components/search/site-search";
import { ThemeToggle } from "@/components/theme-toggle";
import { socials } from "@/data/profile";

const iconButton =
  "flex size-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-foreground/10";

export function SiteHeader() {
  const github = socials.find((s) => s.label === "GitHub");

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      {/* The design draws the navbar's bottom line dashed, like the rails. */}
      <Band
        edge="none"
        className="border-b border-dashed"
        columnClassName="flex h-[60px] items-center justify-between px-[17px]"
      >
        <Link href="/" aria-label="Yash Gawade — home" className="rounded-sm">
          <Logo />
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <NavLinks />

          <SiteSearch />

          {github && (
            <a
              href={github.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className={`${iconButton} max-[399px]:hidden`}
            >
              <Icon name={github.icon} size={20} />
            </a>
          )}

          {/* Hidden on the narrowest phones to keep the header on one line; the search menu has theme actions too. */}
          <ThemeToggle className={`${iconButton} max-[359px]:hidden`} />
        </div>
      </Band>
    </header>
  );
}
