import type { IconName } from "@/lib/icons.generated";

export type StackItem = { name: string; icon: IconName; monochrome?: boolean };
export type StackGroup = { title: string; items: StackItem[] };

export const stack: StackGroup[] = [
  {
    title: "Languages",
    items: [
      { name: "Typescript", icon: "bxl:typescript" },
      { name: "Javascript", icon: "bxl:javascript" },
      { name: "Python", icon: "hugeicons:python" },
    ],
  },
  {
    title: "Frontend",
    items: [
      { name: "React", icon: "hugeicons:react" },
      { name: "Next.js", icon: "akar-icons:nextjs-fill" },
      { name: "Tailwind CSS", icon: "hugeicons:tailwindcss" },
      { name: "Shadcn/ui", icon: "bxl:shadcn-ui" },
      { name: "Motion", icon: "bxl:motion-js" },
    ],
  },
  {
    title: "Backend & Database",
    items: [
      { name: "Node.js", icon: "devicon-plain:nodejs-wordmark" },
      { name: "Express.js", icon: "griddy-icons:expressjs" },
      { name: "MongoDB", icon: "bxl:mongodb" },
      { name: "Socket.IO", icon: "devicon:socketio", monochrome: true },
      { name: "PostgreSQL", icon: "akar-icons:postgresql-fill" },
      { name: "Prisma", icon: "bxl:prisma-orm" },
    ],
  },
  {
    title: "Workflow & AI",
    items: [
      { name: "ChatGPT", icon: "bi:openai" },
      { name: "Claude", icon: "ant-design:claude-filled" },
      { name: "Cursor", icon: "bxl:cursor-ai" },
      { name: "Gemini", icon: "ant-design:gemini-filled" },
      { name: "Git", icon: "bi:git" },
      { name: "Github", icon: "akar-icons:github-fill" },
      { name: "Docker", icon: "ant-design:docker-outlined" },
      { name: "Kubernetes", icon: "bxl:kubernetes" },
    ],
  },
  {
    title: "Design",
    items: [{ name: "Figma", icon: "basil:figma-solid" }],
  },
];
