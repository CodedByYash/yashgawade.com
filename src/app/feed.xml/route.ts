import { site } from "@/data/site";
import { profile } from "@/data/profile";
import { getPosts } from "@/lib/blogs";

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** RSS 2.0 feed of published posts (title, summary and link). */
export async function GET() {
  const posts = await getPosts();
  const items = posts
    .map(({ slug, meta }) => {
      const url = `${site.url}/blogs/${slug}`;
      const categories = (meta.tags ?? []).map((tag) => `<category>${escape(tag)}</category>`).join("");
      return `<item><title>${escape(meta.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${new Date(`${meta.date}T00:00:00Z`).toUTCString()}</pubDate><description>${escape(meta.description)}</description>${categories}</item>`;
    })
    .join("");
  const built = posts[0] ? new Date(`${posts[0].meta.date}T00:00:00Z`).toUTCString() : new Date(0).toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${escape(profile.name)}</title><link>${site.url}/blogs</link><description>Notes on frontend, full-stack and AI, written while building.</description><language>en</language><lastBuildDate>${built}</lastBuildDate><atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
