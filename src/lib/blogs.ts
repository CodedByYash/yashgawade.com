import { readdirSync } from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";

export type BlogMeta = {
  title: string;
  description: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  tags?: string[];
};

export type Post = { slug: string; meta: BlogMeta };

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const dir = path.join(process.cwd(), "src/content/blogs");

/** Every `.mdx` file in src/content/blogs is a post; the file name is the URL slug. */
export function getSlugs(): string[] {
  return readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""))
    .filter((slug) => SLUG.test(slug));
}

type PostModule = { default: ComponentType; meta: BlogMeta };

/** Returns null for unknown slugs. The slug is checked against the file list before it reaches `import()`. */
export async function getPost(slug: string) {
  if (!getSlugs().includes(slug)) return null;
  const mod = (await import(`@/content/blogs/${slug}.mdx`)) as PostModule;
  return { slug, meta: mod.meta, Content: mod.default };
}

/** Newest first. */
export async function getPosts(): Promise<Post[]> {
  const posts = await Promise.all(
    getSlugs().map(async (slug) => {
      const post = await getPost(slug);
      return post ? { slug, meta: post.meta } : null;
    }),
  );
  return posts
    .filter((post): post is Post => post !== null)
    .sort((a, b) => b.meta.date.localeCompare(a.meta.date));
}

/** "10 Oct 2026". Fixed to UTC so the date never shifts with the server's time zone. */
export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
