// src/data/recognitionAchievementsData.ts

export interface RecognitionItem {
  id: string; // Unique identifier for each recognition
  title: string;
  date: string; // Format: "Month YYYY" (e.g., "March 2024")
  category: string; // e.g., "Performance", "Innovation", "Leadership"
  description: string;
}

export const dummyRecognitionAchievements: RecognitionItem[] = [
  {
    id: "rec1",
    title: "Employee of the Month",
    date: "March 2024",
    category: "Performance",
    description: "Outstanding performance in development & team collaboration",
  },
  {
    id: "rec2",
    title: "Innovation Award",
    date: "December 2023",
    category: "Innovation",
    description: "Led breakthrough AI integration project",
  },
  {
    id: "rec3",
    title: "Top Performer Q3",
    date: "September 2023",
    category: "Performance",
    description: "Exceeded all quarterly targets and KPIs",
  },
  {
    id: "rec4",
    title: "Leadership Excellence",
    date: "June 2023",
    category: "Leadership",
    description: "Led breakthrough AI integration project",
  },
];
