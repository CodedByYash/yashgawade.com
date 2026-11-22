import type { IconName } from "@/lib/icons.generated";

export const profile = {
  name: "Yash Gawade",
  tagline: "I design and build thoughtful digital experiences.",
  // Shown one after another under the name; the first is also the static fallback.
  taglines: [
    "I design and build thoughtful digital experiences.",
    "Frontend and full-stack developer from Pune.",
    "I turn ideas into fast, accessible interfaces.",
    "Building real-time apps with Next.js and Node.js.",
  ],
  role: "Frontend Developer",
  location: "Pune, India",
  email: "gawadeyash0@gmail.com",
  timeZone: "Asia/Kolkata",
  timeZoneLabel: "IST",
  avatar: "/avatar.png",
  site: "yashgawade.com",
  summary:
    "A UI/UX designer and developer crafting thoughtful digital experiences.",
  intro: [
    "I’m Yash Gawade a designer and developer who enjoys turning ideas into clean, interactive digital experiences.",
    "I’m obsessed with the details that make a product feel right from thoughtful layouts and smooth interactions to the code behind them. I love exploring new technologies, experimenting with interfaces, and building things that are both beautiful and useful.",
    "These days, I’m exploring UI/UX, frontend development, full-stack applications, and AI while building projects that challenge me to learn something new.",
  ],
} as const;

export type SocialLink = { label: string; href: string; icon: IconName };

// Discord and YouTube are in the design but no URL was provided yet.
export const socials: SocialLink[] = [
  { label: "X (Twitter)", href: "https://x.com/Y_ash_tweets", icon: "hugeicons:new-twitter" },
  { label: "GitHub", href: "https://github.com/yash83085", icon: "akar-icons:github-fill" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/yash-gawade-1b4560250", icon: "akar-icons:linkedin-box-fill" },
  { label: "Discord", href: "#", icon: "hugeicons:discord" },
  { label: "YouTube", href: "#", icon: "akar-icons:youtube-fill" },
];

export const nav = [
  { label: "Components", href: "/components" },
  { label: "Blocks", href: "/blocks" },
  { label: "Blogs", href: "/blogs" },
] as const;
