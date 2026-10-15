import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RegistryDetail } from "@/components/registry/registry-detail";
import { componentItems } from "@/registry/components";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return componentItems.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = componentItems.find((i) => i.slug === slug);
  return item ? { title: item.name, description: item.description } : {};
}

export default async function ComponentPage({ params }: Props) {
  const { slug } = await params;
  const item = componentItems.find((i) => i.slug === slug);
  if (!item) notFound();
  return <RegistryDetail item={item} back={{ href: "/components", label: "All components" }} />;
}
