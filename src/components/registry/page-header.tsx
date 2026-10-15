import Link from "next/link";
import { Icon } from "@/components/icon";
import { Band } from "@/components/panel";

/** Title band used at the top of the Components / Blocks / Blogs pages. */
export function PageHeader({
  title,
  description,
  back,
  meta,
}: {
  title: string;
  description?: string;
  back?: { href: string; label: string };
  meta?: React.ReactNode;
}) {
  return (
    <Band edge="none" columnClassName="px-4 py-8">
      {back && (
        <Link
          href={back.href}
          className="mb-4 inline-flex items-center gap-1.5 font-mono text-xs text-nav-muted transition-colors hover:text-white"
        >
          <Icon name="hugeicons:arrow-left-01" size={16} />
          {back.label}
        </Link>
      )}
      <h1 className="text-2xl font-bold leading-snug sm:text-3xl">{title}</h1>
      {description && <p className="mt-2 max-w-[60ch] text-sm leading-6 text-muted">{description}</p>}
      {meta && <div className="mt-3">{meta}</div>}
    </Band>
  );
}
