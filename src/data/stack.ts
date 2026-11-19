import type { IconName } from "@/lib/icons.generated";

export type StackItem = { name: string; icon: IconName; href: string; monochrome?: boolean };
export type StackGroup = { title: string; items: StackItem[] };

export const stack: StackGroup[] = [
  {
    title: "Languages",
    items: [
      { name: "Typescript", icon: "bxl:typescript", href: "https://www.typescriptlang.org" },
      { name: "Javascript", icon: "bxl:javascript", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
      { name: "Python", icon: "hugeicons:python", href: "https://www.python.org" },
    ],
  },
  {
    title: "Frontend",
    items: [
      { name: "React", icon: "hugeicons:react", href: "https://react.dev" },
      { name: "Next.js", icon: "akar-icons:nextjs-fill", href: "https://nextjs.org" },
      { name: "Tailwind CSS", icon: "hugeicons:tailwindcss", href: "https://tailwindcss.com" },
      { name: "Shadcn/ui", icon: "bxl:shadcn-ui", href: "https://ui.shadcn.com" },
      { name: "Motion", icon: "bxl:motion-js", href: "https://motion.dev" },
    ],
  },
  {
    title: "Backend & Database",
    items: [
      { name: "Node.js", icon: "devicon-plain:nodejs-wordmark", href: "https://nodejs.org" },
      { name: "Express.js", icon: "griddy-icons:expressjs", href: "https://expressjs.com" },
      { name: "MongoDB", icon: "bxl:mongodb", href: "https://www.mongodb.com" },
      { name: "Socket.IO", icon: "devicon:socketio", href: "https://socket.io", monochrome: true },
      { name: "PostgreSQL", icon: "akar-icons:postgresql-fill", href: "https://www.postgresql.org" },
      { name: "Prisma", icon: "bxl:prisma-orm", href: "https://www.prisma.io" },
    ],
  },
  {
    title: "Workflow & AI",
    items: [
      { name: "ChatGPT", icon: "bi:openai", href: "https://chatgpt.com" },
      { name: "Claude", icon: "ant-design:claude-filled", href: "https://claude.ai" },
      { name: "Cursor", icon: "bxl:cursor-ai", href: "https://cursor.com" },
      { name: "Gemini", icon: "ant-design:gemini-filled", href: "https://gemini.google.com" },
      { name: "Git", icon: "bi:git", href: "https://git-scm.com" },
      { name: "Github", icon: "akar-icons:github-fill", href: "https://github.com" },
      { name: "Docker", icon: "ant-design:docker-outlined", href: "https://www.docker.com" },
      { name: "Kubernetes", icon: "bxl:kubernetes", href: "https://kubernetes.io" },
    ],
  },
  {
    title: "Design",
    items: [{ name: "Figma", icon: "basil:figma-solid", href: "https://www.figma.com" }],
  },
];
