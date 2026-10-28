import type { SearchGroup, SearchItem } from "./types";

/** Lower-case and strip accents so "cafe" finds "Café". */
function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "");
}

export function tokenize(query: string): string[] {
  return normalize(query).split(/\s+/).filter(Boolean);
}

/** True when every character of `needle` appears in `haystack`, in order. */
function isSubsequence(needle: string, haystack: string) {
  let i = 0;
  for (const char of haystack) {
    if (char === needle[i]) i += 1;
    if (i === needle.length) return true;
  }
  return false;
}

/**
 * How well an item matches. 0 means "hide it"; higher sorts first.
 * Every word the visitor typed has to match somewhere.
 */
export function score(item: SearchItem, groupTitle: string, tokens: string[]): number {
  if (tokens.length === 0) return 1;

  const label = normalize(item.label);
  const words = label.split(/[^a-z0-9]+/).filter(Boolean);
  const squashed = label.replace(/[^a-z0-9]/g, "");
  const other = normalize([item.description, item.hint, groupTitle, ...(item.keywords ?? [])].filter(Boolean).join(" "));

  let total = 0;
  for (const token of tokens) {
    let points = 0;
    if (label === token) points = 100;
    else if (label.startsWith(token)) points = 80;
    else if (words.some((word) => word.startsWith(token))) points = 60;
    else if (label.includes(token)) points = 40;
    else if (other.includes(token)) points = 20;
    else if (token.length >= 3 && isSubsequence(token, squashed)) points = 10; // "cmpnts" -> "Components"
    if (points === 0) return 0;
    total += points;
  }

  // The whole phrase beating a longer label: "community app" should put
  // "Community App" ahead of "Community App on GitHub".
  const phrase = tokens.join(" ");
  if (label === phrase) total += 50;
  else if (label.startsWith(phrase)) total += 20;

  return total;
}

/**
 * Drops non-matching items and orders the rest best-first. While searching,
 * the group holding the best match goes on top so that Enter always opens the
 * best result; ties keep the original group order. With no query the groups
 * stay in their natural order.
 */
export function rankGroups(groups: SearchGroup[], query: string): SearchGroup[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return groups;

  return groups
    .map((group, groupIndex) => {
      const entries = group.items
        .map((item, index) => ({ item, index, points: score(item, group.value, tokens) }))
        .filter((entry) => entry.points > 0)
        .sort((a, b) => b.points - a.points || a.index - b.index);
      return {
        group: { ...group, items: entries.map((entry) => entry.item) },
        best: entries[0]?.points ?? 0,
        groupIndex,
      };
    })
    .filter((ranked) => ranked.group.items.length > 0)
    .sort((a, b) => b.best - a.best || a.groupIndex - b.groupIndex)
    .map((ranked) => ranked.group);
}

/** Splits `text` into plain and matched parts for highlighting. */
export function splitMatches(text: string, query: string): { text: string; match: boolean }[] {
  const words = query.trim().split(/\s+/).filter(Boolean).slice(0, 6);
  if (words.length === 0) return [{ text, match: false }];

  const pattern = words
    .sort((a, b) => b.length - a.length)
    .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const regex = new RegExp(`(${pattern})`, "gi");

  return text
    .split(regex)
    .filter((part) => part !== "")
    .map((part) => ({ text: part, match: new RegExp(`^(?:${pattern})$`, "i").test(part) }));
}
