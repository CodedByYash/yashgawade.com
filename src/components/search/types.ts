import type { IconName } from "@/lib/icons.generated";
import type { ThemePreference } from "@/lib/theme";

/** What happens when a search result is chosen. */
export type SearchAction =
  /** Client-side navigation, including `/#section` jumps. Runs once the menu has closed. */
  | { type: "route"; href: string }
  /** Another site, or a `mailto:` link. */
  | { type: "external"; href: string }
  /** Copies text that is already public on the page. */
  | { type: "copy"; text: string }
  /** Fetches the phone number on demand, so it never sits in the page markup. */
  | { type: "copy-phone" }
  /** Switches the site theme ("system" goes back to following the device). */
  | { type: "theme"; theme: ThemePreference };

export type SearchItem = {
  /** Unique across all groups. */
  id: string;
  label: string;
  description?: string;
  icon: IconName;
  /** Extra words that should find this item but are not shown. */
  keywords?: string[];
  /** Short label on the right, such as "Page" or a date. */
  hint?: string;
  action: SearchAction;
};

export type SearchGroup = {
  /** Group title; also searchable. */
  value: string;
  items: SearchItem[];
};
