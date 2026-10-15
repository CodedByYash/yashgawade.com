import { Icon } from "@/components/icon";
import type { IconName } from "@/lib/icons.generated";

/**
 * Left rail of an experience / education entry: the icon box plus the
 * connector line that curves out at the bottom.
 */
export function TimelineRail({ icon }: { icon: IconName }) {
  return (
    <div className="flex w-[30px] shrink-0 flex-col self-stretch" aria-hidden>
      <span className="flex size-[30px] items-center justify-center rounded-[2px] border border-chip-line bg-chip">
        <Icon name={icon} size={20} className="text-chip-line" />
      </span>
      <span className="mb-8 ml-[15px] w-[15px] flex-1 rounded-bl-[10px] border-b border-l border-tree" />
    </div>
  );
}

/** "Internship | 01/02/2026 - 01/05/2026 | 3 Months" style meta row. */
export function MetaRow({ items }: { items: string[] }) {
  return (
    <p className="flex flex-col gap-0.5 text-sm font-semibold text-muted sm:flex-row sm:flex-wrap sm:items-stretch sm:gap-x-2">
      {items.map((item, i) => (
        <span key={item} className="flex items-stretch gap-2">
          {i > 0 && <span aria-hidden className="hidden w-px bg-line-strong sm:block" />}
          <span>{item}</span>
        </span>
      ))}
    </p>
  );
}
