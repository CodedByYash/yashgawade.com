import { ContactDetails } from "@/components/blocks/contact-details";
import { EducationSection } from "@/components/blocks/education-section";
import { ExperienceSection } from "@/components/blocks/experience-section";
import { Intro } from "@/components/blocks/intro";
import { ProfileHeader } from "@/components/blocks/profile-header";
import { ProjectsSection } from "@/components/blocks/projects-section";
import { StackSection } from "@/components/blocks/stack-section";
import { SiteFooter } from "@/components/site-footer";
import type { RegistryItem } from "@/registry/types";

/** Whole page sections, composed from the components. */
export const blockItems: RegistryItem[] = [
  {
    slug: "profile-header",
    name: "Profile header",
    description: "Avatar, name with verified badge and a one-line tagline.",
    files: ["src/components/blocks/profile-header.tsx", "src/data/profile.ts"],
    preview: <ProfileHeader headingAs="h2" />,
  },
  {
    slug: "contact-details",
    name: "Contact details",
    description: "Social buttons, role, location, email, live clock and a masked, copy-only phone number.",
    files: ["src/components/blocks/contact-details.tsx", "src/app/api/phone/route.ts"],
    preview: <ContactDetails />,
  },
  {
    slug: "intro",
    name: "Intro",
    description: "Time-of-day greeting followed by the introduction bullets.",
    files: ["src/components/blocks/intro.tsx"],
    preview: <Intro />,
  },
  {
    slug: "stack-section",
    tall: true,
    name: "Stack section",
    description: "Numbered groups of icon chips, fed by a typed data file.",
    files: ["src/components/blocks/stack-section.tsx", "src/data/stack.ts"],
    preview: <StackSection />,
  },
  {
    slug: "experience-section",
    tall: true,
    name: "Experience section",
    description: "Company header with a collapsible role, highlights and skill tags.",
    files: ["src/components/blocks/experience-section.tsx", "src/components/timeline-entry.tsx", "src/data/experience.ts"],
    preview: <ExperienceSection />,
  },
  {
    slug: "education-section",
    tall: true,
    name: "Education section",
    description: "Schools on a timeline with dates, stream and skills.",
    files: ["src/components/blocks/education-section.tsx", "src/data/education.ts"],
    preview: <EducationSection />,
  },
  {
    slug: "projects-section",
    tall: true,
    name: "Projects section",
    description: "Collapsible project rows; the first opens by default.",
    files: ["src/components/blocks/projects-section.tsx", "src/components/project-row.tsx", "src/data/projects.ts"],
    preview: <ProjectsSection />,
  },
  {
    slug: "footer",
    tall: true,
    name: "Footer",
    description: "Credits, build details with live package versions, and the pixel wordmark.",
    files: ["src/components/site-footer.tsx", "src/data/site.ts", "scripts/gen-versions.mjs"],
    preview: <SiteFooter />,
  },
];
