import { Icon } from "@/components/icon";
import { Glint, Item, Letters, Reveal, Stagger } from "@/components/motion";
import { Band, SectionHeading } from "@/components/panel";
import { ExpandableTags } from "@/components/tag-list";
import { TimelineEntry } from "@/components/timeline-entry";
import { experience } from "@/data/experience";

/** Companies with a collapsible role, highlights and skills. */
export function ExperienceSection() {
  return (
    <section aria-labelledby="experience">
      <SectionHeading id="experience">Experience</SectionHeading>
      {experience.map((job) => (
        <Band key={job.company} edge="none">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-[17px] pt-4">
            <div className="flex items-center gap-4">
              <Reveal
                as="span"
                kind="pop"
                className="relative flex size-[38px] items-center justify-center rounded-full border border-dashed border-box-line bg-box"
              >
                <Icon name={job.companyIcon} size={24} className="text-icon" />
                <Glint />
              </Reveal>
              <h3 className="text-xl font-semibold leading-[27px]">
                <Letters text={job.company} />
              </h3>
            </div>
            <Reveal as="p" kind="fade" delay={0.3} className="text-sm font-medium text-muted">
              {job.location}
            </Reveal>
          </div>
          <TimelineEntry icon={job.icon} title={job.role} meta={[job.type, job.period, job.duration]}>
            {/* The design insets this text 24px from the right and sets it on a 25px line. */}
            <Stagger
              dir="up"
              className="list-disc pl-[21px] text-sm font-medium leading-[25px] marker:text-foreground sm:pr-6 sm:text-justify"
            >
              {job.highlights.map((line) => (
                <Item key={line}>{line}</Item>
              ))}
            </Stagger>
            <ExpandableTags items={job.skills} className="mt-3 sm:pr-6" offset={job.highlights.length} />
          </TimelineEntry>
        </Band>
      ))}
    </section>
  );
}
