import type { Metadata } from "next";
import { Divider } from "@/components/panel";
import { PageHeader } from "@/components/registry/page-header";
import { ComponentGrid } from "@/components/registry/registry-list";
import { componentItems } from "@/registry/components";

export const metadata: Metadata = {
  title: "Components",
  description: "The small building blocks this site is made from, with live previews and source.",
};

export default function ComponentsPage() {
  return (
    <main>
      <PageHeader
        title="Components"
        description="The small building blocks this site is made from. Every preview is live and the full source is one click away."
      />
      <Divider />
      <ComponentGrid base="/components" items={componentItems} />
    </main>
  );
}
