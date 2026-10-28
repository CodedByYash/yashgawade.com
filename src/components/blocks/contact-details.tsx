import { IconBox } from "@/components/chips";
import { CopyPhone, LiveClock } from "@/components/live";
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
        <ul className="space-y-2 p-4">
          <li className="flex items-center gap-4">
            <IconBox icon="hugeicons:code" />
            <span className={detailText}>{profile.role}</span>
          </li>
          <li className="flex items-center gap-4">
            <IconBox icon="hugeicons:location-01" />
            <span className={detailText}>{profile.location}</span>
          </li>
          <li className="flex items-center gap-4">
            <IconBox icon="hugeicons:at" />
            <a href={`mailto:${profile.email}`} className={`${detailText} min-w-0 break-all hover:underline`}>
              {profile.email}
            </a>
          </li>
        </ul>
        <ul className="space-y-2 border-t border-dashed border-line p-4 sm:border-l sm:border-t-0">
          <li className="flex items-center gap-4">
            <IconBox icon="hugeicons:time-04" />
            <span className={detailText}>
              <LiveClock timeZone={profile.timeZone} label={profile.timeZoneLabel} />
            </span>
          </li>
          <li className="flex items-center gap-4">
            <IconBox icon="hugeicons:phone" />
            <span className={`${detailText} flex items-center gap-2`}>
              <CopyPhone />
            </span>
          </li>
        </ul>
      </Band>
    </>
  );
}
