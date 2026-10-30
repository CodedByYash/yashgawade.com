"use client";

import { Icon } from "@/components/icon";
import { Collapse, UnfoldIcon, useDisclosure } from "@/components/disclosure";
import { ExpandableTags } from "@/components/tag-list";
import type { Project } from "@/data/projects";

export function ProjectRow({ project }: { project: Project }) {
  const { open, panelId, triggerProps } = useDisclosure(project.defaultOpen);
  const hasDetails = Boolean(project.tagline || project.points?.length || project.tags?.length);

  return (
    <div className="relative">
      <div data-reveal="fade" className="flex min-h-[88px] items-center gap-4 px-[17px] py-6">
        <span
          aria-hidden
          className="flex size-10 shrink-0 items-center justify-center rounded border border-dashed border-box-line bg-box"
        >
          <Icon name="hugeicons:boxes" size={24} className="text-icon" />
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold leading-normal">{project.name}</h3>
          <p className="flex items-center gap-1 text-sm font-medium text-muted">
            <span>{project.start} -</span>
            <Icon name="hugeicons:infinity-01" size={16} aria-label="ongoing" />
          </p>
        </div>

        <div className="flex items-center gap-2">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.name} source code on GitHub`}
              className="relative z-10 text-nav-muted transition-colors hover:text-foreground"
            >
              <Icon name="hugeicons:github-01" size={20} />
            </a>
          )}
          {project.href && (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${project.name}`}
              className="relative z-10 text-nav-muted transition-colors hover:text-foreground"
            >
              <Icon name="hugeicons:link-01" size={20} />
            </a>
          )}
          {/* The ::after stretches this button over the whole header row. */}
          <button
            {...triggerProps}
            aria-label={`${open ? "Collapse" : "Expand"} ${project.name}`}
            className="text-nav-muted after:absolute after:inset-x-0 after:top-0 after:h-[88px] after:content-['']"
          >
            <UnfoldIcon open={open} />
          </button>
        </div>
      </div>

      <Collapse open={open} id={panelId}>
        <div className="space-y-2.5 px-4 pb-4 pt-0.5">
          {hasDetails ? (
            <>
              {project.tagline && (
                <p className="font-medium capitalize leading-[22px]">{project.tagline}</p>
              )}
              {project.points && (
                <ul className="list-disc space-y-3 pl-6 leading-6 marker:text-muted">
                  {project.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}
              {project.tags && <ExpandableTags items={project.tags} limit={10} />}
            </>
          ) : (
            <p className="text-sm text-muted">Details coming soon.</p>
          )}
        </div>
      </Collapse>
    </div>
  );
}
