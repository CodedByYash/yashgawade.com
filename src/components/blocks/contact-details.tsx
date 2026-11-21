import { IconBox } from "@/components/chips";
import { CopyPhone, LiveClock } from "@/components/live";
import { Item, Stagger } from "@/components/motion";
import { Band } from "@/components/panel";
import { SocialButtons } from "@/components/social-links";
import { profile, socials } from "@/data/profile";

const detailText = "font-mono text-sm font-medium leading-[18px]";

/** Social buttons plus role, location, email, live clock and masked phone. */
export function ContactDetails() {
  return (
    <>
      <Band id="contact" edge="bottom" columnClassName="px-[17px] py-4">
        <SocialButtons items={socials} />
      </Band>

      <Band edge="none" columnClassName="grid sm:grid-cols-2">
        <Stagger dir="down" className="space-y-2 p-4">
          <Item className="flex items-center gap-4">
            <IconBox icon="hugeicons:code" index={0} />
            <span className={detailText}>{profile.role}</span>
          </Item>
          <Item className="flex items-center gap-4">
            <IconBox icon="hugeicons:location-01" index={1} />
            <span className={detailText}>{profile.location}</span>
          </Item>
          <Item className="flex items-center gap-4">
            <IconBox icon="hugeicons:at" index={2} />
            <a href={`mailto:${profile.email}`} className={`${detailText} min-w-0 break-all hover:underline`}>
              {profile.email}
            </a>
          </Item>
        </Stagger>
        <Stagger dir="down" className="space-y-2 border-t border-dashed border-line p-4 sm:border-l sm:border-t-0">
          <Item className="flex items-center gap-4">
            <IconBox icon="hugeicons:time-04" index={3} />
            <span className={detailText}>
              <LiveClock timeZone={profile.timeZone} label={profile.timeZoneLabel} />
            </span>
          </Item>
          <Item className="flex items-center gap-4">
            <IconBox icon="hugeicons:phone" index={4} />
            <span className={`${detailText} flex items-center gap-2`}>
              <CopyPhone />
            </span>
          </Item>
        </Stagger>
      </Band>
    </>
  );
}
