import type { SearchGroup } from "@/components/search/types";
import { experience } from "@/data/experience";
import { nav, profile, socials } from "@/data/profile";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { formatDate, getPosts } from "@/lib/blogs";
import { blockItems } from "@/registry/blocks";
import { componentItems } from "@/registry/components";

const pageDescriptions: Record<string, string> = {
  "/components": "Small building blocks, with live previews and source code",
  "/blocks": "Whole page sections made from those components",
  "/blogs": "Notes on frontend, full-stack and AI",
};

/** "https://github.com/x/y" -> "github.com/x/y" */
function display(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

/**
 * Everything the Ctrl+K menu can find. Built on the server from the same data
 * files the pages use, so a new post, component or project shows up by itself.
 */
export async function getSearchGroups(): Promise<SearchGroup[]> {
  const posts = await getPosts();
  const job = experience[0];

  return [
    {
      value: "Pages",
      items: [
        {
          id: "page:home",
          label: "Home",
          description: "Profile, stack, experience, education and projects",
          icon: "hugeicons:home-01",
          hint: "Page",
          action: { type: "route", href: "/" },
        },
        ...nav.map((page) => ({
          id: `page:${page.href}`,
          label: page.label,
          description: pageDescriptions[page.href],
          icon: "hugeicons:file-01" as const,
          hint: "Page",
          action: { type: "route" as const, href: page.href },
        })),
      ],
    },
    {
      value: "Sections",
      items: [
        {
          id: "section:about",
          label: "About",
          description: "Who I am and what I'm exploring these days",
          icon: "hugeicons:user",
          hint: "Section",
          action: { type: "route", href: "/#about" },
        },
        {
          id: "section:contact",
          label: "Contact",
          description: "Social links, email, local time and phone",
          icon: "hugeicons:contact-01",
          keywords: ["email", "phone", "social", "reach"],
          hint: "Section",
          action: { type: "route", href: "/#contact" },
        },
        {
          id: "section:stack",
          label: "Stack",
          description: "Languages, frameworks and tools I use",
          icon: "hugeicons:layers-01",
          keywords: ["skills", "technologies", "tools"],
          hint: "Section",
          action: { type: "route", href: "/#stack" },
        },
        {
          id: "section:experience",
          label: "Experience",
          description: `${job.role} at ${job.company}`,
          icon: "hugeicons:briefcase-01",
          keywords: ["work", "job", "internship", "career"],
          hint: "Section",
          action: { type: "route", href: "/#experience" },
        },
        {
          id: "section:education",
          label: "Education",
          description: "Degree and schooling",
          icon: "hugeicons:graduation-scroll",
          keywords: ["degree", "college", "school", "university"],
          hint: "Section",
          action: { type: "route", href: "/#education" },
        },
        {
          id: "section:projects",
          label: "Projects",
          description: projects.map((project) => project.name).join(", "),
          icon: "hugeicons:boxes",
          keywords: ["work", "portfolio", "built"],
          hint: "Section",
          action: { type: "route", href: "/#projects" },
        },
      ],
    },
    {
      value: "Projects",
      items: projects.map((project) => ({
        id: `project:${project.name}`,
        label: project.name,
        description: project.tagline ?? "Details coming soon",
        icon: "hugeicons:boxes" as const,
        keywords: project.tags,
        hint: project.href ? "Live ↗" : "Section",
        action: project.href
          ? { type: "external" as const, href: project.href }
          : { type: "route" as const, href: "/#projects" },
      })),
    },
    {
      value: "Blogs",
      items: posts.map(({ slug, meta }) => ({
        id: `blog:${slug}`,
        label: meta.title,
        description: meta.description,
        icon: "hugeicons:news" as const,
        keywords: meta.tags,
        hint: formatDate(meta.date),
        action: { type: "route" as const, href: `/blogs/${slug}` },
      })),
    },
    {
      value: "Components",
      items: componentItems.map((item) => ({
        id: `component:${item.slug}`,
        label: item.name,
        description: item.description,
        icon: "hugeicons:puzzle" as const,
        hint: "Component",
        action: { type: "route" as const, href: `/components/${item.slug}` },
      })),
    },
    {
      value: "Blocks",
      items: blockItems.map((item) => ({
        id: `block:${item.slug}`,
        label: item.name,
        description: item.description,
        icon: "hugeicons:layout-02" as const,
        hint: "Block",
        action: { type: "route" as const, href: `/blocks/${item.slug}` },
      })),
    },
    {
      value: "Links",
      items: [
        // Socials without a URL yet (Discord, YouTube) are left out.
        ...socials
          .filter((link) => link.href !== "#")
          .map((link) => ({
            id: `link:${link.label}`,
            label: link.label,
            description: display(link.href),
            icon: link.icon,
            hint: "Link ↗",
            action: { type: "external" as const, href: link.href },
          })),
        {
          id: "link:source",
          label: "Source code",
          description: `${display(site.sourceHref)} — this website`,
          icon: "akar-icons:github-fill",
          keywords: ["repo", "repository", "github", "code"],
          hint: "Link ↗",
          action: { type: "external", href: site.sourceHref },
        },
        ...projects
          .filter((project) => project.github)
          .map((project) => ({
            id: `link:repo:${project.name}`,
            label: `${project.name} on GitHub`,
            description: display(project.github!),
            icon: "akar-icons:github-fill" as const,
            keywords: ["repo", "repository", "source", "code"],
            hint: "Link ↗",
            action: { type: "external" as const, href: project.github! },
          })),
      ],
    },
    {
      value: "Actions",
      items: [
        {
          id: "action:copy-email",
          label: "Copy email address",
          description: profile.email,
          icon: "hugeicons:copy-01",
          keywords: ["mail", "contact"],
          hint: "Copy",
          action: { type: "copy", text: profile.email },
        },
        {
          id: "action:copy-phone",
          label: "Copy phone number",
          description: "Fetched only when you pick this",
          icon: "hugeicons:phone",
          keywords: ["call", "contact", "mobile"],
          hint: "Copy",
          action: { type: "copy-phone" },
        },
        {
          id: "action:send-email",
          label: "Send an email",
          description: `Opens your mail app to write to ${profile.email}`,
          icon: "hugeicons:mail-01",
          keywords: ["contact", "hire", "message", "write"],
          hint: "Mail",
          action: { type: "external", href: `mailto:${profile.email}` },
        },
      ],
    },
    {
      value: "Theme",
      items: [
        {
          id: "theme:light",
          label: "Light theme",
          description: "Bright background, dark text",
          icon: "custom:sun-solid",
          keywords: ["appearance", "day", "bright", "white", "mode"],
          hint: "Theme",
          action: { type: "theme", theme: "light" },
        },
        {
          id: "theme:dark",
          label: "Dark theme",
          description: "Dark background, light text",
          icon: "hugeicons:moon-02",
          keywords: ["appearance", "night", "black", "mode"],
          hint: "Theme",
          action: { type: "theme", theme: "dark" },
        },
        {
          id: "theme:system",
          label: "System theme",
          description: "Match your device setting",
          icon: "hugeicons:computer",
          keywords: ["appearance", "auto", "automatic", "device", "mode"],
          hint: "Theme",
          action: { type: "theme", theme: "system" },
        },
      ],
    },
  ];
}
