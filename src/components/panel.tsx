import { Hatch, Letters, Sweep } from "@/components/motion";
import { cn } from "@/lib/utils";

/**
 * Full-width horizontal band with the 780px dashed-rail column inside it.
 * `edge` controls which solid horizontal lines the band draws.
 */
export function Band({
  children,
  className,
  columnClassName,
  edge = "bottom",
  as: Tag = "div",
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  columnClassName?: string;
  edge?: "none" | "top" | "bottom" | "both";
  as?: React.ElementType;
}) {
  return (
    <Tag
      className={cn(
        "w-full border-line",
        (edge === "bottom" || edge === "both") && "border-b",
        (edge === "top" || edge === "both") && "border-t",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-column border-x border-dashed border-line",
          columnClassName,
        )}
      >
        {children}
      </div>
    </Tag>
  );
}

/** 40px hatched divider between major sections. */
export function Divider() {
  return <Hatch />;
}

/** Section heading band ("Stack", "Experience", …). */
export function SectionHeading({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    // 33px text line + 1px above + the band's bottom line = the design's 35px heading.
    <Band edge="bottom" className="relative" columnClassName="flex items-center px-4 pt-px">
      <h2 id={id} className="text-2xl font-bold leading-[33px]">
        {typeof children === "string" ? <Letters text={children} /> : children}
      </h2>
      <Sweep />
    </Band>
  );
}
