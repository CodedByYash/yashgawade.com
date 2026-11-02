import Link from "next/link";
import { Icon } from "@/components/icon";
import { Tag } from "@/components/chips";
import { formatDate, tagSlug, type Post } from "@/lib/blogs";
import { cn } from "@/lib/utils";

/** Tags that link to their own page. `z-10` keeps them clickable above a stretched row link. */
export function TagLinks({ tags, className }: { tags?: string[]; className?: string }) {
  if (!tags?.length) return null;
  return (
    <ul className={cn("flex flex-wrap gap-2.5", className)}>
      {tags.map((tag) => (
        <Tag key={tag} className="relative z-10 p-0">
          <Link
            href={`/blogs/tag/${tagSlug(tag)}`}
            className="px-2 py-0.5 transition-colors hover:text-foreground"
          >
            {tag}
          </Link>
        </Tag>
      ))}
    </ul>
  );
}

/** "Part 2 of 4: AI engineering notes" with the other parts listed. */
export function SeriesList({ series, parts, currentSlug }: { series: string; parts: Post[]; currentSlug: string }) {
  if (parts.length < 2) return null;
  return (
    <nav aria-label={`${series} series`} className="mt-10 border border-dashed border-chip-line bg-chip px-4 py-3">
      <p className="font-mono text-xs uppercase tracking-wide text-label">Series: {series}</p>
      <ol className="mt-2 space-y-1 text-sm">
        {parts.map((part, i) => (
          <li key={part.slug} className="flex gap-2">
            <span className="w-5 shrink-0 font-mono text-index">{String(part.meta.part ?? i + 1).padStart(2, "0")}</span>
            {part.slug === currentSlug ? (
              <span aria-current="page" className="font-semibold">
                {part.meta.title}
              </span>
            ) : (
              <Link href={`/blogs/${part.slug}`} className="text-muted transition-colors hover:text-foreground">
                {part.meta.title}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Neighbour({ post, direction }: { post: Post; direction: "previous" | "next" }) {
  const next = direction === "next";
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className={cn(
        "march [--march:var(--foreground)] flex flex-1 flex-col gap-1 border border-dashed border-chip-line px-4 py-3",
        next && "sm:items-end sm:text-right",
      )}
    >
      <span className="flex items-center gap-1.5 font-mono text-xs text-muted">
        {!next && <Icon name="hugeicons:arrow-left-01" size={14} />}
        {next ? "Newer" : "Older"}
        {next && <Icon name="hugeicons:arrow-right-01" size={14} />}
      </span>
      <span className="text-sm font-semibold leading-snug">{post.meta.title}</span>
      <time dateTime={post.meta.date} className="font-mono text-xs text-muted">
        {formatDate(post.meta.date)}
      </time>
    </Link>
  );
}

/** Older and newer posts, by date. */
export function PostNav({ posts, slug }: { posts: Post[]; slug: string }) {
  const index = posts.findIndex((post) => post.slug === slug);
  const newer = index > 0 ? posts[index - 1] : null;
  const older = index >= 0 && index < posts.length - 1 ? posts[index + 1] : null;
  if (!newer && !older) return null;
  return (
    <nav aria-label="More posts" className="mt-8 flex flex-col gap-3 sm:flex-row">
      {older ? <Neighbour post={older} direction="previous" /> : <span className="hidden flex-1 sm:block" />}
      {newer ? <Neighbour post={newer} direction="next" /> : <span className="hidden flex-1 sm:block" />}
    </nav>
  );
}
