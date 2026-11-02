import Link from "next/link";
import { TagLinks } from "@/components/blog/post-links";
import { Band } from "@/components/panel";
import { formatDate, type Post } from "@/lib/blogs";

export function PostList({ posts }: { posts: Post[] }) {
  return (
    <Band edge="none" columnClassName="overflow-hidden">
      {posts.length === 0 ? (
        <p className="px-4 py-12 text-center text-sm text-muted">No posts yet. Check back soon.</p>
      ) : (
        <ul className="-mb-px">
          {posts.map(({ slug, meta, minutes }) => (
            <li
              key={slug}
              className="relative border-b border-dashed border-line px-4 py-5 transition-colors hover:bg-chip/40"
            >
              <p className="flex flex-wrap items-center gap-x-3 font-mono text-xs text-muted">
                <time dateTime={meta.date}>{formatDate(meta.date)}</time>
                <span>{minutes} min read</span>
                {meta.series && (
                  <span>
                    {meta.series}
                    {meta.part ? ` · Part ${meta.part}` : ""}
                  </span>
                )}
                {meta.draft && <span className="text-foreground">Draft</span>}
              </p>
              <h2 className="mt-1 text-lg font-semibold leading-snug">
                {/* The ::after stretches this link over the whole row. */}
                <Link href={`/blogs/${slug}`} className="after:absolute after:inset-0 after:content-['']">
                  {meta.title}
                </Link>
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted">{meta.description}</p>
              <TagLinks tags={meta.tags} className="mt-3" />
            </li>
          ))}
        </ul>
      )}
    </Band>
  );
}
