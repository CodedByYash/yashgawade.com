import Image from "next/image";
import { BlurReveal } from "@/components/blur-reveal";
import { Icon } from "@/components/icon";
import { Band } from "@/components/panel";
import { profile } from "@/data/profile";

/** Avatar, name with verified badge, and tagline. */
export function ProfileHeader({ headingAs: Heading = "h1" }: { headingAs?: "h1" | "h2" }) {
  return (
    <Band edge="none" columnClassName="flex min-h-[100px]">
      {/* A dashed rail separates the avatar from the name, as in the design. */}
      <div className="shrink-0 border-r border-dashed border-line">
        <Image
          src={profile.avatar}
          alt={profile.name}
          width={100}
          height={100}
          priority
          className="enter size-[100px] rounded-full object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col pt-[33px]">
        <div className="flex h-[35px] items-center gap-2.5 border-y border-line px-4">
          <Heading
            className="enter text-2xl font-semibold leading-[33px]"
            style={{ "--d": "120ms" } as React.CSSProperties}
          >
            <span className="metal-text">{profile.name}</span>
          </Heading>
          <span className="enter flex" style={{ "--d": "320ms" } as React.CSSProperties}>
            <Icon name="bi:patch-check-fill" size={22} aria-label="Verified" />
          </span>
        </div>
        <p className="px-4 py-2 text-xs font-medium leading-4 text-tagline">
          <BlurReveal lines={profile.taglines} />
        </p>
      </div>
    </Band>
  );
}
