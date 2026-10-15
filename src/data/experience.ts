import type { IconName } from "@/lib/icons.generated";

export type Experience = {
  company: string;
  location: string;
  companyIcon: IconName;
  role: string;
  type: string;
  period: string;
  duration: string;
  icon: IconName;
  highlights: string[];
  skills: string[];
};

export const experience: Experience[] = [
  {
    company: "Arolit Global Services",
    location: "Telangana, Hyderabad(Remote)",
    companyIcon: "hugeicons:code-xml",
    role: "Cloud Engineer Intern",
    type: "Internship",
    period: "01/02/2026 - 01/05/2026",
    duration: "3 Months",
    icon: "hugeicons:cloud",
    highlights: [
      "Designed customised AWS infrastructure solutions based on client workloads and business requirements.",
      "Created cost and architecture plans covering compute, storage, networking, security, analytics, IoT, and AI/ML workloads.",
      "Developed AWS architecture diagrams and Pricing Calculator plans for Production and Staging environments.",
      "Prepared end-to-end SOWs, BOQs, RACI matrices, milestones, and acceptance criteria for client engagements.",
      "Collaborated with Solution Architects and AI/ML Engineers on manufacturing and IoT solutions, including real-time telemetry.",
    ],
    skills: [
      "AWS", "ECS", "Fargate", "S3", "RDS", "IOT Core", "Kinesis", "SageMaker", "KMS", "IAM",
      "Glue", "WAF", "RedShift", "CloudWatch", "GuardDuty",
    ],
  },
];
