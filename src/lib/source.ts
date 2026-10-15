import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Reads a project source file for display. Paths come from the registry
 * constants (never from the URL), and are still confined to the project root.
 * This runs while pages are prerendered, so the files don't need to ship with
 * the server bundle — hence the tracing opt-outs.
 */
export function readSource(file: string): string {
  const root = process.cwd();
  const full = path.resolve(/* turbopackIgnore: true */ root, file);
  if (!full.startsWith(root + path.sep)) throw new Error(`Refusing to read outside the project: ${file}`);
  return readFileSync(/* turbopackIgnore: true */ full, "utf8").trimEnd();
}
