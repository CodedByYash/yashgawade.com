import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostList } from "@/components/blog/post-list";
import { Divider } from "@/components/panel";
import { PageHeader } from "@/components/registry/page-header";
import { getPosts, getTags } from "@/lib/blogs";

type Props = { params: Promise<{ tag: string }> };

/** At least one param is needed to prerender, so with no tags yet a placeholder 404s. */
export async function generateStaticParams() {
  const tags = getTags(await getPosts());
  return (tags.length > 0 ? tags.map((t) => t.slug) : ["none-yet"]).map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const entry = getTags(await getPosts()).find((t) => t.slug === tag);
  return entry ? { title: `#${entry.slug}`, description: `Posts tagged ${entry.tag}.` } : {};
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const entry = getTags(await getPosts()).find((t) => t.slug === tag);
  if (!entry) notFound();

  return (
    <main>
      <PageHeader
        title={entry.tag}
        description={`${entry.posts.length} ${entry.posts.length === 1 ? "post" : "posts"} tagged ${entry.tag}.`}
        back={{ href: "/blogs", label: "All posts" }}
      />
      <Divider />
      <PostList posts={entry.posts} />
    </main>
  );
}
