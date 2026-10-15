import { Band, Divider } from "@/components/panel";
import { CodeBlock } from "@/components/registry/code-block";
import { PageHeader } from "@/components/registry/page-header";
import type { RegistryItem } from "@/registry/types";

/** Detail page body: header, live preview, then the source files. */
export function RegistryDetail({
  item,
  back,
  fullBleed,
}: {
  item: RegistryItem;
  back: { href: string; label: string };
  /** Blocks are full-width bands, so they get no padding frame. */
  fullBleed?: boolean;
}) {
  return (
    <main>
      <PageHeader title={item.name} description={item.description} back={back} />
      <Divider />
      <Band edge="bottom" columnClassName="border-x-0 sm:border-x">
        <h2 className="sr-only">Preview</h2>
        {fullBleed ? (
          <div className="overflow-hidden">{item.preview}</div>
        ) : (
          <div className="flex min-h-56 items-center justify-center overflow-hidden p-6">{item.preview}</div>
        )}
      </Band>
      <Divider />
      <Band edge="none">
        <h2 className="border-b border-line px-4 py-3 text-lg font-semibold">Source</h2>
        <div className="divide-y divide-dashed divide-line">
          {item.files.map((file) => (
            <CodeBlock key={file} file={file} />
          ))}
        </div>
      </Band>
    </main>
  );
}
