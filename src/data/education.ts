import type { IconName } from "@/lib/icons.generated";

export type Education = {
  school: string;
  period: string;
  meta: string[];
  icon: IconName;
  skills: string[];
};

export const education: Education[] = [
  {
    school: "DYPIEMR, Akurdi (Pune)",
    period: "01/12/2021 - 01/06/2025",
    meta: ["Bachelor's degree", "Artificial Intelligence & Data Science"],
    icon: "hugeicons:cloud",
    skills: [
      "Javascript", "Python", "TypeScript", "C++", "DSA", "OS", "System Design", "Software Engineering",
      "MySQL", "MongoDB", "Data Science", "ANN", "Cloud Computing", "Computer Networks",
      "Pattern Recognition", "OOP", "Machine Learning", "Data Modeling & Visualization",
    ],
  },
  {
    school: "Hutatma Rajguru High School, Rajgurunagar(Pune)",
    period: "01/06/2018 - 01/06/2020",
    meta: ["Science Stream"],
    icon: "hugeicons:cloud",
    skills: ["HTML", "CSS", "Javascript", "OOP"],
  },
];
