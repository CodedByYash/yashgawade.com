import { Icon } from "@/components/icon";
import type { IconName } from "@/lib/icons.generated";
import { cn } from "@/lib/utils";

const chipClass =
  "march [--march:var(--muted)] group flex items-center justify-center gap-2.5 border border-dashed border-chip-line bg-chip px-2 py-1 font-mono text-xs font-medium text-chip-text transition-[translate,background-color,border-color] duration-500 ease-(--ease-out)";

/**
 * Mono chip with an icon, used in the Stack section. With an `href` the chip
 * is a link to the tool's own site and an arrow slides in on hover.
 */
export function IconChip({
  icon,
  monochrome,
  href,
  children,
}: {
  icon: IconName;
  monochrome?: boolean;
  href?: string;
  children: React.ReactNode;
}) {
  const glyph = (
    <Icon
      name={icon}
      size={20}
      monochrome={monochrome}
      className="text-icon transition-colors duration-500 group-hover:text-foreground group-focus-visible:text-foreground"
    />
  );
  if (!href) {
    return (
      <li className={`${chipClass} hover:-translate-y-0.5`}>
        {glyph}
        <span className="whitespace-nowrap">{children}</span>
      </li>
    );
  }
  return (
    <li className="flex">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${chipClass} hover:-translate-y-0.5 hover:bg-box focus-visible:-translate-y-0.5`}
      >
        {glyph}
        <span className="whitespace-nowrap">{children}</span>
        <span className="sr-only"> (opens in a new tab)</span>
        <Icon
          name="hugeicons:arrow-up-right-01"
          size={12}
          className="-ml-1 w-0 -translate-x-1 opacity-0 transition-[width,opacity,translate] duration-500 ease-(--ease-out) group-hover:w-3 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:w-3 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
        />
      </a>
    </li>
  );
}

/** Text-only dashed tag — skills on experience / education / projects. */
export function Tag({
  children,
  className,
  style,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
} & React.LiHTMLAttributes<HTMLLIElement>) {
  return (
    <li
      {...rest}
      style={style}
      className={cn(
        "flex items-center justify-center border border-dashed border-tag-line bg-tag px-2 py-0.5 text-xs font-semibold leading-[1.8] text-tag-text",
        className,
      )}
    >
      {children}
    </li>
  );
}

export function TagList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-2.5 py-[3px]", className)}>
      {items.map((item) => (
        <Tag key={item}>{item}</Tag>
      ))}
    </ul>
  );
}

/** Small square icon box used beside personal details. */
export function IconBox({ icon }: { icon: IconName }) {
  return (
    // 23px square: the design stacks these on a 31px row pitch (23px box + 8px gap).
    <span className="shine flex size-[23px] shrink-0 items-center justify-center border-[0.5px] border-detail-line bg-chip">
      <Icon name={icon} size={15} className="text-detail-icon" />
    </span>
  );
}
