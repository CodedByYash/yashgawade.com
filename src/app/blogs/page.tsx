import type { Metadata } from "next";
import Link from "next/link";
import { PostList } from "@/components/blog/post-list";
import { Icon } from "@/components/icon";
import { Divider } from "@/components/panel";
import { PageHeader } from "@/components/registry/page-header";
import { getPosts, getTags, tagSlug } from "@/lib/blogs";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Notes on frontend, full-stack and AI, written while building.",
  alternates: { types: { "application/rss+xml": "/feed.xml" } },
};

export default async function BlogsPage() {
  const posts = await getPosts();
  const tags = getTags(posts);

  return (
    <main>
      <PageHeader
        title="Blogs"
        description="Notes on frontend, full-stack and AI, written while building."
        meta={
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <a
              href="/feed.xml"
              className="flex items-center gap-1.5 font-mono text-xs text-nav-muted transition-colors hover:text-foreground"
            >
              <Icon name="hugeicons:rss" size={14} />
              RSS
            </a>
            {tags.length > 0 && (
              <ul aria-label="Topics" className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs">
                {tags.map(({ tag, slug, posts: tagged }) => (
                  <li key={slug}>
                    <Link href={`/blogs/tag/${slug}`} className="text-muted transition-colors hover:text-foreground">
                      #{tagSlug(tag)} <span className="text-index">{tagged.length}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        }
      />
      <Divider />
      <PostList posts={posts} />
    </main>
  );
}
