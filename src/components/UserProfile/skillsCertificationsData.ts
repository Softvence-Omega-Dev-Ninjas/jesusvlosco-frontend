export interface SkillItem {
  id: string;
  name: string;
  yearsOfExperience: number;
  proficiency: string; // e.g., "Expert", "Intermediate"
  tools?: string[]; // Optional array of tools (e.g., "Asana", "Trello", "Jira")
  description: string;
}

export interface CertificationItem {
  id: string;
  name: string; // e.g., "PMP - Project Management Professional"
  issuingOrganization: string; // e.g., "PMI"
  completionDate: string; // e.g., "May 2024"
  description: string;
}

export const dummySkills: SkillItem[] = [
  {
    id: "skill1",
    name: "Project management",
    yearsOfExperience: 5,
    proficiency: "Expert",
    tools: ["Asana", "Trello", "Jira"],
    description: "Managed projects on time, within budget.",
  },
  {
    id: "skill2",
    name: "Communication Skills",
    yearsOfExperience: 7,
    proficiency: "Expert",
    description: "Expertise in verbal and written communication.",
  },
];

export const dummyCertifications: CertificationItem[] = [
  {
    id: "cert1",
    name: "PMP - Project Management Professional",
    issuingOrganization: "PMI",
    completionDate: "May 2024",
    description: "Certified in project management processes.",
  },
];
