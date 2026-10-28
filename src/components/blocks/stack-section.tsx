import { IconChip } from "@/components/chips";
import { Band, SectionHeading } from "@/components/panel";
import { stack } from "@/data/stack";

/** Numbered stack groups with icon chips. */
export function StackSection() {
  return (
    <section aria-labelledby="stack">
      <SectionHeading id="stack">Stack</SectionHeading>
      {stack.map((group, i) => (
        <Band
          key={group.title}
          edge="none"
          className={i < stack.length - 1 ? "border-b border-dashed" : undefined}
          // One-line rows are 67px tall in the design, two-line rows 103px.
          columnClassName={`grid grid-cols-[minmax(0,1fr)] sm:grid-cols-[260px_1fr] ${
            i < stack.length - 1 ? "sm:min-h-[66px]" : "sm:min-h-[67px]"
          }`}
        >
          <h3 className="flex items-center px-[25px] pt-4 font-mono text-sm font-medium uppercase sm:py-4">
            <span className="text-index">{String(i + 1).padStart(2, "0")}</span>&nbsp;{group.title}
          </h3>
          <div className="flex items-center border-dashed border-line px-6 py-4 sm:border-l sm:pl-[31px]">
            <ul className="flex flex-wrap gap-2.5">
              {group.items.map((item) => (
                <IconChip key={item.name} icon={item.icon} monochrome={item.monochrome}>
                  {item.name}
                </IconChip>
              ))}
            </ul>
          </div>
        </Band>
      ))}
    </section>
  );
}
