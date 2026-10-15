import { Icon } from "@/components/icon";
import type { IconName } from "@/lib/icons.generated";
import { cn } from "@/lib/utils";

/** Mono chip with an icon — used in the Stack section. */
export function IconChip({
  icon,
  monochrome,
  children,
}: {
  icon: IconName;
  monochrome?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center justify-center gap-2.5 border border-dashed border-chip-line bg-chip px-2 py-1 font-mono text-xs font-medium text-white">
      <Icon name={icon} size={20} monochrome={monochrome} className="text-chip-line" />
      <span className="whitespace-nowrap">{children}</span>
    </li>
  );
}

/** Text-only dashed tag — skills on experience / education / projects. */
export function Tag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <li
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
    <span className="flex items-center justify-center border-[0.5px] border-chip-line bg-chip p-1">
      <Icon name={icon} size={15} className="text-chip-line" />
    </span>
  );
}
