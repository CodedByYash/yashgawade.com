import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { getPosts, getTags } from "@/lib/blogs";
import { blockItems } from "@/registry/blocks";
import { componentItems } from "@/registry/components";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  const at = (path: string) => `${site.url}${path}`;
  return [
    { url: at("/") },
    { url: at("/components") },
    { url: at("/blocks") },
    { url: at("/blogs") },
    ...componentItems.map((item) => ({ url: at(`/components/${item.slug}`) })),
    ...blockItems.map((item) => ({ url: at(`/blocks/${item.slug}`) })),
    ...posts.map(({ slug, meta }) => ({ url: at(`/blogs/${slug}`), lastModified: meta.date })),
    ...getTags(posts).map(({ slug }) => ({ url: at(`/blogs/tag/${slug}`) })),
  ];
}
