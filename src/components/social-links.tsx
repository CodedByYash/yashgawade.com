import { Icon } from "@/components/icon";
import type { SocialLink } from "@/data/profile";

const box =
  "flex size-[43px] items-center justify-center border border-dashed border-social-line bg-chip text-chip-line transition-colors";

/** Square dashed social buttons. Entries without a URL yet render inert. */
export function SocialButtons({ items }: { items: SocialLink[] }) {
  return (
    <ul className="flex flex-wrap gap-4">
      {items.map((item) => (
        <li key={item.label}>
          {item.href === "#" ? (
            <span className={`${box} opacity-60`} role="img" aria-label={`${item.label} (link not set)`}>
              <Icon name={item.icon} size={24} />
            </span>
          ) : (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className={`${box} hover:border-white hover:text-white`}
            >
              <Icon name={item.icon} size={24} />
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
            className="text-white transition-colors hover:text-nav-muted"
          >
            <Icon name={item.icon} size={20} />
          </a>
        </li>
      ))}
    </ul>
  );
}
