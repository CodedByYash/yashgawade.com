import type { Metadata } from "next";
import { Divider } from "@/components/panel";
import { PageHeader } from "@/components/registry/page-header";
import { BlockList } from "@/components/registry/registry-list";
import { blockItems } from "@/registry/blocks";

export const metadata: Metadata = {
  title: "Blocks",
  description: "The page sections this site is composed from, with live previews and source.",
};

export default function BlocksPage() {
  return (
    <main>
      <PageHeader
        title="Blocks"
        description="Whole page sections composed from the components. The home page is just these blocks stacked in order."
      />
      <Divider />
      <BlockList base="/blocks" items={blockItems} />
    </main>
  );
}
