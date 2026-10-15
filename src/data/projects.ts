export type Project = {
  name: string;
  start: string; // dd/mm/yyyy — shown with an ∞ because they are ongoing
  /** Live site. */
  href?: string;
  /** Source repository. */
  github?: string;
  tagline?: string;
  points?: string[];
  tags?: string[];
  defaultOpen?: boolean;
};

export const projects: Project[] = [
  {
    name: "Inventory Management",
    start: "01/09/2026",
    defaultOpen: true,
    tagline:
      "Fast, Clean, Real-Time Inventory Tracking With Velocity-Based Reorder Intelligence Without Enterprise Complexity Or Pricing.",
    points: [
      "Multi-warehouse inventory platform built for D2C brands and retailers.",
      "Real-time stock tracking with inventory movements, warehouse management, and product analytics.",
      "Velocity-based reorder intelligence to identify fast-moving products and potential replenishment needs.",
    ],
    tags: ["Next.js", "MongoDB", "Monorepo", "Redis"],
  },
  // MCP Server: description, links and stack still to be provided.
  { name: "MCP Server", start: "01/10/2026" },
  {
    name: "Community App",
    start: "01/10/2026",
    href: "https://team-chat-tutorial-o8d7.onrender.com",
    github: "https://github.com/CodedByYash/team-chat-tutorial",
    tagline: "Real-Time Collaboration Platform",
    points: [
      "Built a Discord-like collaboration platform with real-time text, audio, and video channels using Socket.io for 1:1 and group communication.",
      "Implemented file attachments, message editing, and deletion with real-time updates via UploadThing, improving user engagement by 25%.",
      "Designed a responsive UI with Tailwind CSS and ShadcnUI supporting dark/light modes with 95% cross device compatibility.",
      "Built role-based access control (kick, role changes) with a unique-link invite system and managed auth via Clerk with WebSocket fallback polling.",
    ],
    tags: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "ShadcnUI",
      "Node.js",
      "Express.js",
      "Prisma",
      "MySQL",
      "Socket.io",
      "Clerk",
    ],
  },
];
