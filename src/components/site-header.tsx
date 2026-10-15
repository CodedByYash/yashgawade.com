import Link from "next/link";
import { Icon } from "@/components/icon";
import { NavLinks } from "@/components/nav-links";
import { Band } from "@/components/panel";
import { Logo } from "@/components/pixel-grid";
import { socials } from "@/data/profile";

const iconButton =
  "flex size-9 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10";

export function SiteHeader() {
  const github = socials.find((s) => s.label === "GitHub");

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <Band edge="bottom" columnClassName="flex h-[60px] items-center justify-between px-[17px]">
        <Link href="/" aria-label="Yash Gawade — home" className="rounded-sm">
          <Logo />
        </Link>

        <div className="flex items-center gap-4">
          <NavLinks />

          {/* Command palette is not built yet, so the control is inert. */}
          <button
            type="button"
            disabled
            title="Search is coming soon"
            aria-label="Search (coming soon)"
            className="flex h-[33px] w-[91px] items-center gap-3 px-2 text-nav-muted disabled:cursor-default max-sm:hidden"
          >
            <Icon name="hugeicons:search-01" size={16} />
            <kbd className="rounded bg-kbd px-1.5 py-0.5 font-nav text-[11px] font-medium leading-[13px] text-white">
              Ctrl+K
            </kbd>
          </button>

          {github && (
            <a
              href={github.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className={`${iconButton} max-[359px]:hidden`}
            >
              <Icon name="hugeicons:github-01" size={24} />
            </a>
          )}

          {/* Only the dark theme is designed so far. */}
          <button
            type="button"
            disabled
            title="Light theme is not designed yet"
            aria-label="Theme: dark"
            className={`${iconButton} disabled:cursor-default disabled:hover:bg-transparent max-sm:hidden`}
          >
            <Icon name="hugeicons:moon-02" size={20} />
          </button>
        </div>
      </Band>
    </header>
  );
}
