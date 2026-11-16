type TraceKind = "model" | "tool" | "denied" | "error" | "verify" | "final";

type TraceEvent = {
  step: number;
  kind: TraceKind;
  label: string;
  detail?: string;
};

/** One hue per event kind, so a long trace can be scanned by colour. */
const HUES: Record<TraceKind, number> = {
  model: 265,
  tool: 150,
  denied: 25,
  error: 60,
  verify: 200,
  final: 150,
};

/**
 * An agent run as a timeline. Pass the events your harness recorded and the reader
 * can follow what the model asked for, what the harness allowed and what was verified.
 *
 *   <TraceLog title="Run" events={[{ step: 1, kind: "model", label: "requests read_file" }]} />
 */
export function TraceLog({ title = "Execution trace", events }: { title?: string; events: TraceEvent[] }) {
  return (
    <figure className="mt-4 border border-dashed border-chip-line bg-chip">
      <figcaption className="border-b border-dashed border-chip-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-label">
        {title}
      </figcaption>
      <ol className="py-1">
        {events.map((e, i) => {
          const hue = HUES[e.kind];
          const strong = e.kind === "final";
          return (
            <li key={i} className="grid grid-cols-[1.5rem_4.5rem_1fr] items-baseline gap-x-2 px-3 py-1 text-[13px] leading-5 max-sm:grid-cols-[1.25rem_4.25rem_1fr]">
              <span className="text-right font-mono text-[11px] text-nav-muted">{e.step}</span>
              <span
                className="font-mono text-[11px] font-semibold uppercase tracking-wide"
                style={{ color: `oklch(0.58 0.16 ${hue})` }}
              >
                {e.kind}
              </span>
              <span className="min-w-0">
                <span className={strong ? "font-semibold" : undefined}>{e.label}</span>
                {e.detail ? (
                  <span className="ml-2 break-words font-mono text-[12px] text-nav-muted">{e.detail}</span>
                ) : null}
              </span>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
