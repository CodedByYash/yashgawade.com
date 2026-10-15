import { ContactDetails } from "@/components/blocks/contact-details";
import { EducationSection } from "@/components/blocks/education-section";
import { ExperienceSection } from "@/components/blocks/experience-section";
import { Intro } from "@/components/blocks/intro";
import { ProfileHeader } from "@/components/blocks/profile-header";
import { ProjectsSection } from "@/components/blocks/projects-section";
import { StackSection } from "@/components/blocks/stack-section";
import { Divider } from "@/components/panel";

export default function Home() {
  return (
    <main>
      <ProfileHeader />
      <Divider />
      <ContactDetails />
      <Divider />
      <Intro />
      <StackSection />
      <Divider />
      <ExperienceSection />
      <Divider />
      <EducationSection />
      <Divider />
      <ProjectsSection />
    </main>
  );
}
