import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import type { ComponentType } from "react";

export type BlogMeta = {
  title: string;
  description: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  tags?: string[];
  /** Drafts show in development only (set SHOW_DRAFTS=1 to see them in a build). */
  draft?: boolean;
  /** Posts with the same series name are linked together, ordered by `part`. */
  series?: string;
  part?: number;
};

export type Heading = { id: string; text: string; level: 2 | 3 };

export type Post = { slug: string; meta: BlogMeta; minutes: number };

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const dir = path.join(process.cwd(), "src/content/blogs");
const showDrafts = process.env.NODE_ENV !== "production" || process.env.SHOW_DRAFTS === "1";

/** Every `.mdx` file in src/content/blogs is a post; the file name is the URL slug. */
export function getSlugs(): string[] {
  return readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""))
    .filter((slug) => SLUG.test(slug));
}

type PostModule = { default: ComponentType<{ components?: object }>; meta: BlogMeta };

function readSource(slug: string) {
  return readFileSync(path.join(dir, `${slug}.mdx`), "utf8");
}

/** Plain text of a markdown heading, close to what rehype-slug reads back from the page. */
function headingText(raw: string) {
  return raw
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*_]/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

/** h2 and h3 headings, with the same ids rehype-slug gives them. */
export function getHeadings(source: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let fence: string | null = null;
  for (const line of source.split("\n")) {
    const mark = line.match(/^\s*(`{3,}|~{3,})/);
    if (mark) {
      if (!fence) fence = mark[1][0];
      else if (mark[1][0] === fence) fence = null;
      continue;
    }
    if (fence) continue;
    const match = line.match(/^(#{2,3})\s+(.+?)\s*#*\s*$/);
    if (!match) continue;
    const text = headingText(match[2]);
    headings.push({ id: slugger.slug(text), text, level: match[1].length as 2 | 3 });
  }
  return headings;
}

/** About 200 words a minute, counting code too. Never less than one. */
export function readingMinutes(source: string) {
  const body = source.replace(/^export const meta = \{[\s\S]*?\n\};/, "");
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Returns null for unknown slugs. The slug is checked against the file list before it reaches `import()`. */
export async function getPost(slug: string) {
  if (!getSlugs().includes(slug)) return null;
  const mod = (await import(`@/content/blogs/${slug}.mdx`)) as PostModule;
  if (mod.meta.draft && !showDrafts) return null;
  const source = readSource(slug);
  return {
    slug,
    meta: mod.meta,
    Content: mod.default,
    headings: getHeadings(source),
    minutes: readingMinutes(source),
  };
}

/** Published posts, newest first. */
export async function getPosts(): Promise<Post[]> {
  const posts = await Promise.all(
    getSlugs().map(async (slug) => {
      const post = await getPost(slug);
      return post ? { slug, meta: post.meta, minutes: post.minutes } : null;
    }),
  );
  return posts
    .filter((post): post is Post => post !== null)
    .sort((a, b) => b.meta.date.localeCompare(a.meta.date) || a.slug.localeCompare(b.slug));
}

/** The other posts in the same series, in reading order (includes `slug` itself). */
export function seriesOf(posts: Post[], series?: string) {
  if (!series) return [];
  return posts
    .filter((post) => post.meta.series === series)
    .sort((a, b) => (a.meta.part ?? 0) - (b.meta.part ?? 0));
}

/** "Next.js" -> "next-js", for tag page URLs. */
export function tagSlug(tag: string) {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Every tag in use with its posts, most used first. */
export function getTags(posts: Post[]) {
  const map = new Map<string, { tag: string; slug: string; posts: Post[] }>();
  for (const post of posts) {
    for (const tag of post.meta.tags ?? []) {
      const slug = tagSlug(tag);
      const entry = map.get(slug) ?? { tag, slug, posts: [] };
      entry.posts.push(post);
      map.set(slug, entry);
    }
  }
  return [...map.values()].sort((a, b) => b.posts.length - a.posts.length || a.tag.localeCompare(b.tag));
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
