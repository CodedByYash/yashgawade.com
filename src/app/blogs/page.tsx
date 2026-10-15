import type { Metadata } from "next";
import Link from "next/link";
import { Band, Divider } from "@/components/panel";
import { PageHeader } from "@/components/registry/page-header";
import { Tag } from "@/components/chips";
import { formatDate, getPosts } from "@/lib/blogs";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Notes on frontend, full-stack and AI, written while building.",
};

export default async function BlogsPage() {
  const posts = await getPosts();

  return (
    <main>
      <PageHeader title="Blogs" description="Notes on frontend, full-stack and AI, written while building." />
      <Divider />
      <Band edge="none" columnClassName="overflow-hidden">
        {posts.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-muted">No posts yet. Check back soon.</p>
        ) : (
          <ul className="-mb-px">
            {posts.map(({ slug, meta }) => (
              <li key={slug} className="relative border-b border-dashed border-line px-4 py-5 transition-colors hover:bg-chip/40">
                <time dateTime={meta.date} className="font-mono text-xs text-muted">
                  {formatDate(meta.date)}
                </time>
                <h2 className="mt-1 text-lg font-semibold leading-snug">
                  {/* The ::after stretches this link over the whole row. */}
                  <Link href={`/blogs/${slug}`} className="after:absolute after:inset-0 after:content-['']">
                    {meta.title}
                  </Link>
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted">{meta.description}</p>
                {meta.tags && (
                  <ul className="mt-3 flex flex-wrap gap-2.5">
                    {meta.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </Band>
    </main>
  );
}
