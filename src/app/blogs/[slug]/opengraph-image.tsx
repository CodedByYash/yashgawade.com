import { ImageResponse } from "next/og";
import { OgCard, ogSize } from "@/components/blog/og-card";
import { formatDate, getPost, getPosts, getSlugs } from "@/lib/blogs";

export const alt = "Blog post by Yash Gawade";
export const size = ogSize;
export const contentType = "image/png";

export async function generateStaticParams() {
  const posts = await getPosts();
  const slugs = posts.length > 0 ? posts.map((post) => post.slug) : getSlugs().slice(0, 1);
  return (slugs.length > 0 ? slugs : ["no-posts-yet"]).map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  return new ImageResponse(
    (
      <OgCard
        title={post?.meta.title ?? "Yash Gawade"}
        kicker={post?.meta.series ?? "Blog"}
        footer={post ? `${formatDate(post.meta.date)} · ${post.minutes} min read` : ""}
      />
    ),
    size,
  );
}
