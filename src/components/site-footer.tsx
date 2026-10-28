import Link from "next/link";
import { Icon } from "@/components/icon";
import { Band } from "@/components/panel";
import { Logo, Wordmark } from "@/components/pixel-grid";
import { SocialInline } from "@/components/social-links";
import { profile, socials } from "@/data/profile";
import { site } from "@/data/site";

const label = "font-mono text-[11px] font-medium uppercase tracking-wide text-label";
// 2×2 grid on phones (divider before every even cell, rule above the second row),
// four across from `sm` up.
const cell =
  "flex flex-col gap-2 border-line px-4 pb-[15px] pt-3.5 max-sm:even:border-l max-sm:nth-[n+3]:border-t sm:[&:not(:first-child)]:border-l";

function Numbered({ children, i }: { children: React.ReactNode; i: number }) {
  return (
    <li className="flex gap-2 font-mono text-[13px] leading-[19px]">
      <span className="w-[17px] font-semibold text-index">{String(i + 1).padStart(2, "0")}</span>
      <span>{children}</span>
    </li>
  );
}

export function SiteFooter() {
  const footerSocials = socials.filter((s) => ["X (Twitter)", "GitHub", "LinkedIn"].includes(s.label));

  return (
    <footer>
      <Band edge="both" columnClassName="flex h-[37px] items-center justify-between px-4 text-xs">
        <span>{profile.site}</span>
        <span className="text-right">{profile.summary}</span>
      </Band>

      <Band edge="bottom" columnClassName="grid grid-cols-2 sm:grid-cols-4">
        <div className={cell}>
          <span className={label}>Crafted by</span>
          <a href={site.craftedByHref} className="text-sm font-medium underline underline-offset-2">
            {site.craftedBy}
          </a>
        </div>
        <div className={cell}>
          <span className={label}>Date</span>
          <time className="text-sm font-medium underline underline-offset-2">{site.date}</time>
        </div>
        <div className={cell}>
          <span className={label}>Deployed on</span>
          <Icon name="akar-icons:vercel-fill" size={15} aria-label={site.deployedOn} />
        </div>
        <div className={cell}>
          <span className={label}>Source code</span>
          <a
            href={site.sourceHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium underline underline-offset-2"
          >
            GitHub
          </a>
        </div>
      </Band>

      <Band edge="none" columnClassName="grid sm:grid-cols-2">
        <div className="p-[17px]">
          <h2 className={label}>Stack</h2>
          <ol className="mt-2.5 space-y-2">
            {site.stack.map((item, i) => (
              <Numbered key={item} i={i}>
                {item}
              </Numbered>
            ))}
          </ol>
        </div>
        <div className="border-t border-line p-[17px] sm:border-l sm:border-t-0">
          <h2 className={label}>Inspired by</h2>
          <ol className="mt-2.5 space-y-2">
            {site.inspiredBy.map((item, i) => (
              <Numbered key={item.name} i={i}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-nav-muted"
                >
                  {item.name}
                </a>
              </Numbered>
            ))}
          </ol>
        </div>
      </Band>

      <div aria-hidden className="h-5 w-full border-y border-line" />

      <Band edge="none" columnClassName="flex h-[53px] items-center justify-between px-[17px]">
        <Link href="/" aria-label="Back to home" className="rounded-sm">
          <Logo />
        </Link>
        <SocialInline items={footerSocials} />
      </Band>

      <Band edge="none" columnClassName="px-[21px] pb-1.5 pt-[5px]">
        <Wordmark className="h-auto w-full max-w-[738px]" />
      </Band>
    </footer>
  );
}
