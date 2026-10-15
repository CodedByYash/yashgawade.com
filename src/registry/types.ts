import type { ReactNode } from "react";

/** One entry on the Components or Blocks pages. */
export type RegistryItem = {
  slug: string;
  name: string;
  description: string;
  /** Source files shown on the detail page, relative to the project root. */
  files: string[];
  /** Live preview rendered on the list and detail pages. */
  preview: ReactNode;
  /** Blocks taller than the list window get a fade-out at the bottom edge. */
  tall?: boolean;
};
