import Image from "next/image";
import { Icon } from "@/components/icon";
import { Band } from "@/components/panel";
import { profile } from "@/data/profile";

/** Avatar, name with verified badge, and tagline. */
export function ProfileHeader({ headingAs: Heading = "h1" }: { headingAs?: "h1" | "h2" }) {
  return (
    <Band edge="none" columnClassName="flex h-[100px]">
      <Image
        src={profile.avatar}
        alt={profile.name}
        width={100}
        height={100}
        priority
        className="size-[100px] shrink-0 rounded-full object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col pt-[33px]">
        <div className="flex h-[35px] items-center gap-2.5 border-y border-l border-line px-4">
          <Heading className="text-2xl font-semibold leading-[33px]">{profile.name}</Heading>
          <Icon name="hugeicons:badge-check" size={24} aria-label="Verified" />
        </div>
        <p className="px-4 py-2 text-[11px] font-medium leading-4">{profile.tagline}</p>
      </div>
    </Band>
  );
}
