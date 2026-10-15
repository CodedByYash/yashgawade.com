import { CopyButton } from "@/components/registry/copy-button";
import { readSource } from "@/lib/source";

/** File name bar plus the file's source. Read at build time. */
export function CodeBlock({ file }: { file: string }) {
  const code = readSource(file);
  return (
    <figure className="min-w-0">
      <figcaption className="flex items-center justify-between gap-4 border-b border-dashed border-line px-4 py-2">
        <span className="min-w-0 truncate font-mono text-xs text-muted">{file}</span>
        <CopyButton text={code} label={`Copy ${file}`} />
      </figcaption>
      <pre
        tabIndex={0}
        className="max-h-[480px] overflow-auto bg-chip/40 p-4 font-mono text-[12.5px] leading-6 focus-visible:outline-offset-[-2px]"
      >
        <code>{code}</code>
      </pre>
    </figure>
  );
}
