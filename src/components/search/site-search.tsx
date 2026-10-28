import { Search } from "@/components/search/search";
import { getSearchGroups } from "@/lib/search-index";

/** Server wrapper: builds the search index from the site's own data. */
export async function SiteSearch() {
  const groups = await getSearchGroups();
  return <Search groups={groups} />;
}
