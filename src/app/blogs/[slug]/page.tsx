import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Tag } from "@/components/chips";
import { Band, Divider } from "@/components/panel";
import { PageHeader } from "@/components/registry/page-header";
import { formatDate, getPost, getSlugs } from "@/lib/blogs";

type Props = { params: Promise<{ slug: string }> };

/**
 * Cache Components needs at least one param to prerender, so an empty blog
 * folder falls back to a placeholder that the page turns into a 404.
 */
export function generateStaticParams() {
  const slugs = getSlugs();
  return (slugs.length > 0 ? slugs : ["no-posts-yet"]).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return post ? { title: post.meta.title, description: post.meta.description } : {};
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const { meta, Content } = post;

  return (
    <main>
      <PageHeader
        title={meta.title}
        description={meta.description}
        back={{ href: "/blogs", label: "All posts" }}
        meta={
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <time dateTime={meta.date} className="font-mono text-xs text-muted">
              {formatDate(meta.date)}
            </time>
            {meta.tags && (
              <ul className="flex flex-wrap gap-2.5">
                {meta.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </ul>
            )}
          </div>
        }
      />
      <Divider />
      <Band edge="none" columnClassName="px-4 py-8 sm:px-8">
        <article className="max-w-[68ch]">
          <Content />
        </article>
      </Band>
    </main>
  );
}
