import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { PostNav, SeriesList, TagLinks } from "@/components/blog/post-links";
import { Toc } from "@/components/blog/toc";
import { Band, Divider } from "@/components/panel";
import { PageHeader } from "@/components/registry/page-header";
import { profile } from "@/data/profile";
import { site } from "@/data/site";
import { formatDate, getPost, getPosts, getSlugs, seriesOf } from "@/lib/blogs";

type Props = { params: Promise<{ slug: string }> };

/**
 * Cache Components needs at least one param to prerender, so an empty blog
 * folder falls back to a placeholder that the page turns into a 404.
 */
export async function generateStaticParams() {
  const posts = await getPosts();
  const slugs = posts.length > 0 ? posts.map((post) => post.slug) : getSlugs().slice(0, 1);
  return (slugs.length > 0 ? slugs : ["no-posts-yet"]).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  const { meta } = post;
  const url = `${site.url}/blogs/${slug}`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url },
    authors: [{ name: profile.name, url: site.url }],
    keywords: meta.tags,
    openGraph: {
      type: "article",
      url,
      title: meta.title,
      description: meta.description,
      publishedTime: meta.date,
      authors: [profile.name],
      tags: meta.tags,
    },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description, creator: "@Y_ash_tweets" },
    ...(meta.draft ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const { meta, Content, headings, minutes } = post;
  const posts = await getPosts();
  const parts = seriesOf(posts, meta.series);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    author: { "@type": "Person", name: profile.name, url: site.url },
    mainEntityOfPage: `${site.url}/blogs/${slug}`,
    keywords: meta.tags?.join(", "),
  };

  return (
    <main>
      <ReadingProgress targetId="post-body" />
      <PageHeader
        title={meta.title}
        description={meta.description}
        back={{ href: "/blogs", label: "All posts" }}
        meta={
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <time dateTime={meta.date} className="font-mono text-xs text-muted">
              {formatDate(meta.date)}
            </time>
            <span className="font-mono text-xs text-muted">{minutes} min read</span>
            {meta.series && (
              <span className="font-mono text-xs text-muted">
                {meta.series}
                {meta.part ? ` · Part ${meta.part}${parts.length > 1 ? ` of ${parts.length}` : ""}` : ""}
              </span>
            )}
            {meta.draft && <span className="font-mono text-xs text-foreground">Draft</span>}
            <TagLinks tags={meta.tags} />
          </div>
        }
      />
      <Divider />
      <Band edge="none" columnClassName="relative px-4 py-8 sm:px-8">
        <Toc headings={headings} />
        <article id="post-body" className="max-w-[68ch]">
          <Content />
        </article>
        <div className="max-w-[68ch]">
          <SeriesList series={meta.series ?? ""} parts={parts} currentSlug={slug} />
          <PostNav posts={posts} slug={slug} />
        </div>
      </Band>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </main>
  );
}
