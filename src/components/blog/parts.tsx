import { Icon } from "@/components/icon";
import type { IconName } from "@/lib/icons.generated";
import { cn } from "@/lib/utils";

const calloutKinds = {
  note: { icon: "hugeicons:information-circle", label: "Note" },
  tip: { icon: "hugeicons:idea-01", label: "Tip" },
  warning: { icon: "hugeicons:alert-02", label: "Warning" },
} as const satisfies Record<string, { icon: IconName; label: string }>;

/** <Callout type="note" | "tip" | "warning" title="…"> */
export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: keyof typeof calloutKinds;
  title?: string;
  children: React.ReactNode;
}) {
  const kind = calloutKinds[type];
  return (
    <aside
      className={cn(
        "mt-4 flex gap-3 border border-dashed bg-chip px-4 py-3",
        type === "warning" ? "border-foreground" : "border-chip-line",
      )}
    >
      <Icon name={kind.icon} size={20} className="mt-0.5 shrink-0 text-icon" />
      <div className="min-w-0 text-[14px] leading-6 [&>p]:mt-2 [&>p:first-child]:mt-0">
        <p className="font-mono text-xs font-semibold uppercase tracking-wide text-label">{title ?? kind.label}</p>
        {children}
      </div>
    </aside>
  );
}

/** Command output. Lines starting with "$ " are shown as commands. */
export function Terminal({ title = "Terminal", children }: { title?: string; children: string }) {
  return (
    <figure className="mt-4 border border-dashed border-chip-line bg-chip">
      <figcaption className="flex items-center gap-2 border-b border-dashed border-chip-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-label">
        <Icon name="hugeicons:command-line" size={14} />
        {title}
      </figcaption>
      <pre className="overflow-x-auto px-4 py-3 font-mono text-[13px] leading-6">
        {children
          .trim()
          .split("\n")
          .map((line, i) =>
            line.startsWith("$ ") ? (
              <span key={i} className="block">
                <span className="select-none text-muted">$ </span>
                {line.slice(2)}
              </span>
            ) : (
              <span key={i} className="block text-muted">
                {line || " "}
              </span>
            ),
          )}
      </pre>
    </figure>
  );
}

/**
 * A small flow diagram that follows the theme and wraps on phones:
 * <Flow steps={["Prompt", "Model", "Tool call", "Result"]} loop="until done" />
 */
export function Flow({ steps, loop, caption }: { steps: string[]; loop?: string; caption?: string }) {
  return (
    <figure className="mt-4">
      <ol className="flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        {steps.map((step, i) => (
          <li key={step} className="flex flex-col items-center gap-2 sm:flex-row">
            <span className="w-full border border-dashed border-chip-line bg-chip px-3 py-2 text-center font-mono text-xs sm:w-auto">
              {step}
            </span>
            {i < steps.length - 1 && (
              <Icon
                name="hugeicons:arrow-right-02"
                size={18}
                aria-hidden
                className="rotate-90 text-muted sm:rotate-0"
              />
            )}
          </li>
        ))}
      </ol>
      {loop && (
        <p className="mt-2 flex items-center gap-1.5 font-mono text-xs text-muted">
          <Icon name="hugeicons:repeat" size={14} aria-hidden />
          {loop}
        </p>
      )}
      {caption && <figcaption className="mt-2 text-xs text-muted">{caption}</figcaption>}
    </figure>
  );
}

/** Before/after for prompts or code. Strings only: <Compare before={`…`} after={`…`} /> */
export function Compare({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
}: {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const column = (label: string, text: string, strong?: boolean) => (
    <figure className={cn("border border-dashed bg-chip", strong ? "border-foreground" : "border-chip-line")}>
      <figcaption className="border-b border-dashed border-chip-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-label">
        {label}
      </figcaption>
      <p className="whitespace-pre-wrap px-4 py-3 text-[14px] leading-6">{text.trim()}</p>
    </figure>
  );
  return (
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      {column(beforeLabel, before)}
      {column(afterLabel, after, true)}
    </div>
  );
}

/** A plain link card for a repository. Nothing is fetched from GitHub. */
export function RepoCard({
  repo,
  description,
}: {
  /** "owner/name" */
  repo: string;
  description?: string;
}) {
  return (
    <a
      href={`https://github.com/${repo}`}
      target="_blank"
      rel="noopener noreferrer"
      className="march [--march:var(--foreground)] mt-4 flex items-center gap-3 border border-dashed border-chip-line bg-chip px-4 py-3 no-underline"
    >
      <Icon name="hugeicons:github-01" size={24} className="shrink-0 text-icon" />
      <span className="min-w-0 flex-1">
        <span className="block break-all font-mono text-sm font-semibold">{repo}</span>
        {description && <span className="mt-0.5 block text-[13px] leading-5 text-muted">{description}</span>}
      </span>
      <Icon name="hugeicons:arrow-up-right-01" size={18} className="shrink-0 text-muted" />
    </a>
  );
}

/** Collapsible section for long logs or full prompts. */
export function Details({ summary, children }: { summary: string; children: React.ReactNode }) {
  return (
    <details className="group mt-4 border border-dashed border-chip-line bg-chip">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium marker:hidden">
        {summary}
        <Icon
          name="hugeicons:arrow-down-01"
          size={18}
          className="shrink-0 text-muted transition-transform duration-200 ease-(--ease-out) group-open:rotate-180"
        />
      </summary>
      <div className="border-t border-dashed border-chip-line px-4 pb-4 [&>:first-child]:mt-3">{children}</div>
    </details>
  );
}
