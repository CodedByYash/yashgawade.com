import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RegistryDetail } from "@/components/registry/registry-detail";
import { blockItems } from "@/registry/blocks";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blockItems.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = blockItems.find((i) => i.slug === slug);
  return item ? { title: item.name, description: item.description } : {};
}

export default async function BlockPage({ params }: Props) {
  const { slug } = await params;
  const item = blockItems.find((i) => i.slug === slug);
  if (!item) notFound();
  return <RegistryDetail item={item} back={{ href: "/blocks", label: "All blocks" }} fullBleed />;
}
