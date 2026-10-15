import Link from "next/link";
import { Icon } from "@/components/icon";
import { Band } from "@/components/panel";
import type { RegistryItem } from "@/registry/types";

function CardFooter({ href, item }: { href: string; item: RegistryItem }) {
  return (
    <div className="flex min-h-[104px] items-start justify-between gap-4 border-t border-dashed border-line p-4">
      <div className="min-w-0">
        <h2 className="text-base font-semibold leading-snug">
          <Link href={href} className="rounded-sm underline-offset-4 hover:underline">
            {item.name}
          </Link>
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted">{item.description}</p>
      </div>
      <Icon name="hugeicons:arrow-right-01" size={20} className="mt-0.5 text-nav-muted" />
    </div>
  );
}

/*
 * Cards draw a bottom border each; the wrapper is pulled down 1px and clipped
 * so the last row's border never doubles up with the band's own bottom line.
 */

/** Two-column grid of small, interactive previews (Components page). */
export function ComponentGrid({ base, items }: { base: string; items: RegistryItem[] }) {
  return (
    <Band edge="none" columnClassName="overflow-hidden">
      <div className="-mb-px grid sm:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.slug}
            className="flex min-w-0 flex-col border-b border-dashed border-line sm:odd:border-r"
          >
            <div className="flex min-h-44 flex-1 items-center justify-center overflow-hidden p-6">
              {item.preview}
            </div>
            <CardFooter href={`${base}/${item.slug}`} item={item} />
          </article>
        ))}
      </div>
    </Band>
  );
}

/** One wide card per block, with the live block clipped to a window (Blocks page). */
export function BlockList({ base, items }: { base: string; items: RegistryItem[] }) {
  return (
    <Band edge="none" columnClassName="overflow-hidden">
      <div className="-mb-px">
        {items.map((item) => (
          <article key={item.slug} className="border-b border-dashed border-line">
            <div className="relative max-h-72 overflow-hidden">
              {/* inert: the preview is a picture here; the detail page is interactive. */}
              <div inert className="pointer-events-none">
                {item.preview}
              </div>
              {item.tall && (
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent"
                />
              )}
            </div>
            <CardFooter href={`${base}/${item.slug}`} item={item} />
          </article>
        ))}
      </div>
    </Band>
  );
}
