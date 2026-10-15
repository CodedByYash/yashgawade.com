import { Band, SectionHeading } from "@/components/panel";
import { ProjectRow } from "@/components/project-row";
import { projects } from "@/data/projects";

/** Collapsible project rows; the first one opens by default. */
export function ProjectsSection() {
  return (
    <section aria-labelledby="projects">
      <SectionHeading id="projects">Projects</SectionHeading>
      {projects.map((project, i) => (
        <Band
          key={project.name}
          edge="none"
          className={i < projects.length - 1 ? "border-b border-line" : undefined}
        >
          <ProjectRow project={project} />
        </Band>
      ))}
    </section>
  );
}
