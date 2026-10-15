import versions from "./versions.generated.json";

export const site = {
  craftedBy: "yashgawade.com",
  craftedByHref: "https://yashgawade.com",
  date: "03-10-2026",
  deployedOn: "Vercel",
  sourceHref: "https://github.com/CodedByYash/yashgawade.com",
  stack: versions.map((p) => `${p.name}@${p.version}`),
  inspiredBy: [
    { name: "Chanh Dai", href: "https://chanhdai.com" },
    { name: "Tailwind css", href: "https://tailwindcss.com" },
    { name: "shadcn/ui", href: "https://ui.shadcn.com" },
    { name: "Vercel", href: "https://vercel.com" },
  ],
};
