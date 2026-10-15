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
          columnClassName="grid grid-cols-[minmax(0,1fr)] sm:grid-cols-[260px_1fr]"
        >
          <h3 className="flex items-center px-[25px] pt-4 font-mono text-sm font-medium uppercase sm:py-4">
            {String(i + 1).padStart(2, "0")} {group.title}
          </h3>
          <div className="flex items-center border-line px-6 py-4 sm:border-l sm:pl-[31px]">
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
