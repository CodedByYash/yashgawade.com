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
      "Built a multi-warehouse inventory platform for D2C brands and retailers: products, warehouses, purchase and sales orders, low-stock alerts, and a live dashboard.",
      "Designed an append-only stock ledger where every quantity change flows through one MongoDB-transaction-wrapped function, so stock can never go negative; verified with a test firing 50 concurrent writes at one product.",
      "Implemented partial receipt on purchase orders and partial fulfillment with implicit backorders on sales orders, plus velocity-based reorder forecasting with plain-English suggestions and no ML infrastructure.",
      "Shipped an installable PWA with camera-based barcode scanning (react-zxing) so warehouse staff can look up and record stock movements from a phone.",
    ],
    tags: [
      "Next.js",
      "TypeScript",
      "Express.js",
      "MongoDB",
      "Tailwind CSS",
      "JWT",
      "PWA",
      "Jest",
    ],
  },
  {
    name: "Inventory MCP Server",
    start: "01/10/2026",
    tagline: "Talk To Your Inventory In Plain English Through Claude",
    points: [
      "Built a Model Context Protocol server that exposes the inventory API as 8 tools (5 read-only, 3 write) so an AI assistant can check stock, forecast reorders, and create or receive purchase orders by calling the real API.",
      "Added resolver layers so users refer to SKUs, warehouse names, and PO numbers instead of database IDs; ambiguous or unknown names fail before anything is created, with suggestions.",
      "Authenticated through a dedicated service account with a Bearer-token path added to the API's auth middleware, keeping all business logic in the API.",
      "Verified end to end by spawning the compiled server as a real child process over stdio and checking that real business-rule errors, like over-receiving a PO, reach the client intact.",
    ],
    tags: ["MCP", "TypeScript", "Node.js", "Zod", "Claude Desktop"],
  },
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
