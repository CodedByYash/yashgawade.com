import { Icon } from "@/components/icon";
import type { SocialLink } from "@/data/profile";

const box =
  "flex size-[43px] items-center justify-center border border-dashed border-social-line bg-social-bg text-social-icon transition-colors";

/**
 * The solid GitHub / LinkedIn / YouTube marks fill their whole box, while the
 * outline icons carry padding. 20px vs 24px gives both the ~19px glyph the
 * design draws.
 */
const glyphSize = (name: string) => (name.startsWith("akar-icons:") ? 20 : 24);

/** Square dashed social buttons. Entries without a URL yet render inert. */
export function SocialButtons({ items }: { items: SocialLink[] }) {
  return (
    <ul className="flex flex-wrap gap-4">
      {items.map((item) => (
        <li key={item.label}>
          {item.href === "#" ? (
            <span className={`${box} opacity-60`} role="img" aria-label={`${item.label} (link not set)`}>
              <Icon name={item.icon} size={glyphSize(item.icon)} />
            </span>
          ) : (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className={`${box} hover:border-foreground hover:text-foreground`}
            >
              <Icon name={item.icon} size={glyphSize(item.icon)} />
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Compact X | GitHub | LinkedIn row used in the footer. */
export function SocialInline({ items }: { items: SocialLink[] }) {
  return (
    <ul className="flex items-center gap-2">
      {items.map((item, i) => (
        <li key={item.label} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden className="h-4 w-px bg-line-strong" />}
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className="text-foreground transition-colors hover:text-nav-muted"
          >
            <Icon name={item.icon} size={20} />
          </a>
        </li>
      ))}
    </ul>
  );
}
