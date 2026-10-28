import { Greeting } from "@/components/live";
import { Band } from "@/components/panel";
import { profile } from "@/data/profile";

/** Time-of-day greeting and the three intro bullets. */
export function Intro() {
  return (
    <>
      <Band id="about" edge="bottom" columnClassName="px-[17px] py-px">
        <Greeting />
      </Band>
      {/* Right padding is a touch under the left, so lines wrap where the design's 730px text box wraps them. */}
      <Band edge="bottom" columnClassName="pl-[25px] pr-[22px] py-4">
        {/* pl-[22px] hangs the text 22px in from the bullet, like the design. */}
        <ul className="list-disc space-y-4 pl-[22px] text-sm font-medium leading-[19px] marker:text-foreground">
          {profile.intro.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </Band>
    </>
  );
}
