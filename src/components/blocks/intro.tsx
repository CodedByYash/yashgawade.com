import { Greeting } from "@/components/live";
import { Band } from "@/components/panel";
import { profile } from "@/data/profile";

/** Time-of-day greeting and the three intro bullets. */
export function Intro() {
  return (
    <>
      <Band edge="bottom" columnClassName="px-[17px] py-px">
        <Greeting />
      </Band>
      <Band edge="bottom" columnClassName="px-[25px] py-4">
        <ul className="list-disc space-y-4 text-sm font-medium leading-[19px] marker:text-muted">
          {profile.intro.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </Band>
    </>
  );
}
