import { Band, SectionHeading } from "@/components/panel";
import { ExpandableTags } from "@/components/tag-list";
import { TimelineEntry } from "@/components/timeline-entry";
import { education } from "@/data/education";

/** Schools with dates, stream and skills. */
export function EducationSection() {
  return (
    <section aria-labelledby="education">
      <SectionHeading id="education">Education</SectionHeading>
      {education.map((item, i) => (
        <Band key={item.school} edge={i < education.length - 1 ? "bottom" : "none"}>
          <TimelineEntry icon={item.icon} title={item.school} meta={[item.period, ...item.meta]}>
            <ExpandableTags items={item.skills} />
          </TimelineEntry>
        </Band>
      ))}
    </section>
  );
}
