"use client";

import { Collapse, UnfoldIcon, useDisclosure } from "@/components/disclosure";
import { MetaRow, TimelineRail } from "@/components/timeline";
import type { IconName } from "@/lib/icons.generated";

/**
 * One experience / education entry: rail + title + meta row, with the
 * details (bullets, tags) in a collapsible panel.
 */
export function TimelineEntry({
  icon,
  title,
  meta,
  defaultOpen = true,
  children,
}: {
  icon: IconName;
  title: string;
  meta: string[];
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const { open, panelId, triggerProps } = useDisclosure(defaultOpen);

  return (
    <div className="flex gap-4 px-[17px] py-4">
      <TimelineRail icon={icon} open={open} />
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-medium leading-[22px]">
          <button
            {...triggerProps}
            className="flex w-full items-center justify-between gap-4 text-left"
          >
            <span>{title}</span>
            <UnfoldIcon open={open} />
          </button>
        </h3>
        <div className="mt-2">
          <MetaRow items={meta} />
        </div>
        <Collapse open={open} id={panelId}>
          <div className="pt-2">{children}</div>
        </Collapse>
      </div>
    </div>
  );
}
