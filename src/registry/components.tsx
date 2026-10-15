import { IconBox, IconChip, Tag } from "@/components/chips";
import { Greeting, LiveClock } from "@/components/live";
import { Band, Divider, SectionHeading } from "@/components/panel";
import { Logo, Wordmark } from "@/components/pixel-grid";
import { SocialButtons } from "@/components/social-links";
import { ExpandableTags } from "@/components/tag-list";
import { MetaRow, TimelineRail } from "@/components/timeline";
import { socials, profile } from "@/data/profile";
import { DisclosureDemo } from "@/registry/demos";
import type { RegistryItem } from "@/registry/types";

/** Small building blocks used across the site. */
export const componentItems: RegistryItem[] = [
  {
    slug: "tag",
    name: "Tag",
    description: "Text-only dashed chip for skills and technologies.",
    files: ["src/components/chips.tsx"],
    preview: (
      <ul className="flex flex-wrap justify-center gap-2.5">
        <Tag>Next.js</Tag>
        <Tag>TypeScript</Tag>
        <Tag>Motion</Tag>
      </ul>
    ),
  },
  {
    slug: "icon-chip",
    name: "Icon chip",
    description: "Monospace chip with a brand icon, used in the Stack section.",
    files: ["src/components/chips.tsx", "src/components/icon.tsx"],
    preview: (
      <ul className="flex flex-wrap justify-center gap-2.5">
        <IconChip icon="bxl:mongodb">MongoDB</IconChip>
        <IconChip icon="hugeicons:react">React</IconChip>
        <IconChip icon="bxl:prisma-orm">Prisma</IconChip>
      </ul>
    ),
  },
  {
    slug: "icon-box",
    name: "Icon box",
    description: "Small square icon holder that sits beside personal details.",
    files: ["src/components/chips.tsx", "src/components/icon.tsx"],
    preview: (
      <ul className="flex gap-4">
        <li><IconBox icon="hugeicons:code" /></li>
        <li><IconBox icon="hugeicons:location-01" /></li>
        <li><IconBox icon="hugeicons:at" /></li>
        <li><IconBox icon="hugeicons:phone" /></li>
      </ul>
    ),
  },
  {
    slug: "expandable-tags",
    name: "Expandable tags",
    description: "Shows the first few tags and folds the rest behind a “+N more” toggle.",
    files: ["src/components/tag-list.tsx", "src/components/chips.tsx"],
    preview: (
      <ExpandableTags
        limit={4}
        items={["AWS", "ECS", "Fargate", "S3", "RDS", "IOT Core", "Kinesis", "SageMaker"]}
        className="justify-center"
      />
    ),
  },
  {
    slug: "dashed-panel",
    name: "Dashed panel",
    description: "Full-width band with the 780px dashed-rail column that frames every section.",
    files: ["src/components/panel.tsx"],
    preview: (
      <div className="w-full">
        <Band edge="both" columnClassName="px-4 py-6 text-center text-sm text-muted">
          Content sits between the dashed rails.
        </Band>
      </div>
    ),
  },
  {
    slug: "hatched-divider",
    name: "Hatched divider",
    description: "40px diagonal-hatch separator between major sections.",
    files: ["src/components/panel.tsx", "src/app/globals.css"],
    preview: (
      <div className="w-full">
        <Divider />
      </div>
    ),
  },
  {
    slug: "section-heading",
    name: "Section heading",
    description: "Heading band with a bottom rule for “Stack”, “Experience” and friends.",
    files: ["src/components/panel.tsx"],
    preview: (
      <div className="w-full">
        <SectionHeading>Section title</SectionHeading>
      </div>
    ),
  },
  {
    slug: "disclosure",
    name: "Disclosure",
    description: "useDisclosure hook and an animated Collapse with correct ARIA wiring.",
    files: ["src/components/disclosure.tsx"],
    preview: <DisclosureDemo />,
  },
  {
    slug: "timeline-rail",
    name: "Timeline rail",
    description: "Icon box with a curved connector, plus the pipe-separated meta row.",
    files: ["src/components/timeline.tsx"],
    preview: (
      <div className="flex w-full max-w-sm gap-4">
        <div className="h-24 shrink-0">
          <TimelineRail icon="hugeicons:cloud" />
        </div>
        <div className="min-w-0">
          <p className="text-base font-medium leading-[22px]">Cloud Engineer Intern</p>
          <div className="mt-2">
            <MetaRow items={["Internship", "01/02/2026 - 01/05/2026", "3 Months"]} />
          </div>
        </div>
      </div>
    ),
  },
  {
    slug: "pixel-grid",
    name: "Pixel logo and wordmark",
    description: "Pixel art drawn as a single SVG from a bitmap, instead of hundreds of DOM nodes.",
    files: ["src/components/pixel-grid.tsx"],
    preview: (
      <div className="flex w-full flex-col items-center gap-5">
        <Logo />
        <Wordmark className="h-auto w-full max-w-72" />
      </div>
    ),
  },
  {
    slug: "social-buttons",
    name: "Social buttons",
    description: "Square dashed icon links; entries without a URL render inert.",
    files: ["src/components/social-links.tsx", "src/data/profile.ts"],
    preview: <SocialButtons items={socials} />,
  },
  {
    slug: "live-clock",
    name: "Greeting and live clock",
    description: "Greets by the visitor’s local time and shows a ticking clock in a fixed time zone.",
    files: ["src/components/live.tsx"],
    preview: (
      <div className="space-y-2 text-center">
        <Greeting />
        <p className="font-mono text-sm">
          <LiveClock timeZone={profile.timeZone} label={profile.timeZoneLabel} />
        </p>
      </div>
    ),
  },
];
