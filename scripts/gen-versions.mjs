// Writes the installed versions of the footer "Stack" packages so the footer
// never goes stale. Runs automatically before `dev` and `build`.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const packages = ["next", "react", "@base-ui/react", "shadcn", "tailwindcss"];
const out = packages.map((name) => {
  const { version } = JSON.parse(readFileSync(`node_modules/${name}/package.json`, "utf8"));
  return { name, version };
});
mkdirSync("src/data", { recursive: true });
writeFileSync("src/data/versions.generated.json", JSON.stringify(out, null, 2) + "\n");
console.log("Stack versions:", out.map((p) => `${p.name}@${p.version}`).join(", "));
