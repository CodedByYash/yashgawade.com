import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { Band, Divider } from "@/components/panel";
import { PageHeader } from "@/components/registry/page-header";
import { Breakout } from "@/components/not-found/breakout";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main>
      <PageHeader
        title="Page not found"
        description="This page wandered off. Break through the 404 for a bit of fun, or head straight back."
      />
      <Divider />
      <Band edge="none" columnClassName="px-4 py-8 sm:px-8">
        <Breakout />
        <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-sm">
          <li>
            <Link href="/" className="inline-flex items-center gap-1.5 underline underline-offset-4">
              <Icon name="hugeicons:home-01" size={16} />
              Back home
            </Link>
          </li>
          <li>
            <Link href="/blogs" className="inline-flex items-center gap-1.5 underline underline-offset-4">
              <Icon name="hugeicons:news" size={16} />
              Read the blog
            </Link>
          </li>
          <li>
            <Link href="/components" className="inline-flex items-center gap-1.5 underline underline-offset-4">
              <Icon name="hugeicons:puzzle" size={16} />
              Browse components
            </Link>
          </li>
        </ul>
      </Band>
    </main>
  );
}
