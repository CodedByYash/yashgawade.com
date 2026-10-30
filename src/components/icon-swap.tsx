import { Icon } from "@/components/icon";
import type { IconName } from "@/lib/icons.generated";
import { cn } from "@/lib/utils";

const swap =
  "col-start-1 row-start-1 transition-[rotate,scale,opacity] duration-300 ease-(--ease-out)";

/**
 * Two icons in one spot. When `active` flips, the old one spins out while the
 * new one spins in (copy → tick, unfold-more → unfold-less).
 */
export function IconSwap({
  active,
  from,
  to,
  size = 20,
  className,
}: {
  active: boolean;
  from: IconName;
  to: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-grid shrink-0 place-items-center", className)}>
      <Icon name={from} size={size} className={cn(swap, active && "rotate-90 scale-50 opacity-0")} />
      <Icon name={to} size={size} className={cn(swap, !active && "-rotate-90 scale-50 opacity-0")} />
    </span>
  );
}
