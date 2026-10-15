import { Icon } from "@/components/icon";
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
              <span
                aria-hidden
                className="flex size-[38px] items-center justify-center rounded-full border border-dashed border-chip-line bg-chip"
              >
                <Icon name={job.companyIcon} size={24} className="text-chip-line" />
              </span>
              <h3 className="text-lg font-semibold leading-[27px]">{job.company}</h3>
            </div>
            <p className="text-sm font-medium text-muted">{job.location}</p>
          </div>
          <TimelineEntry icon={job.icon} title={job.role} meta={[job.type, job.period, job.duration]}>
            <ul className="list-disc space-y-3 pl-5 text-sm leading-5 marker:text-muted sm:text-justify">
              {job.highlights.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <ExpandableTags items={job.skills} className="mt-3" />
          </TimelineEntry>
        </Band>
      ))}
    </section>
  );
}
