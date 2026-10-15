import { readFileSync } from "node:fs";
const want = {
  hugeicons: ["typescript-01","java-script","python","react","tailwindcss","code","location-01","at","time-04","phone","copy-01","cloud","boxes","unfold-more","unfold-less","link-01","infinity-01","search-01","search","moon","moon-02","code-xml","new-twitter","github-01","linkedin-01","discord","youtube","badge-check","checkmark-badge-01","sun-03","github","square-arrow-up-right"],
  "akar-icons": ["nextjs-fill","postgresql-fill","github-fill","vercel-fill","linkedin-box-fill"],
  bxl: ["shadcn-ui","motion-js","mongodb","prisma-orm","prisma","cursor-ai","kubernetes","nodejs","framer"],
  "devicon-plain": ["nodejs-wordmark"],
  devicon: ["socketio"],
  "griddy-icons": ["expressjs"],
  bi: ["openai","git"],
  "ant-design": ["claude-filled","gemini-filled","docker-outlined"],
  basil: ["figma-solid"],
};
for (const [set, names] of Object.entries(want)) {
  const j = JSON.parse(readFileSync(`node_modules/@iconify-json/${set}/icons.json`, "utf8"));
  const have = new Set([...Object.keys(j.icons), ...Object.keys(j.aliases ?? {})]);
  const missing = names.filter((n) => !have.has(n));
  console.log(set, "missing:", missing.join(", ") || "none");
}
