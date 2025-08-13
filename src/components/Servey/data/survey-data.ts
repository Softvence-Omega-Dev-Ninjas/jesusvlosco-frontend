import { User } from "../types/survey";

export const mockUsers: User[] = [...Array(10)].map((_, i) => ({
  id: (21360 + i).toString(),
  name: [
    "Cody Fisher",
    "Leslie Alexander",
    "Kristin Watson",
    "Robert Fox",
    "Jacob Jones",
    "Theresa Webb",
    "Guy Hawkins",
    "Kathryn Murphy",
    "Devon Lane",
    "Esther Howard",
  ][i],
  email: `user${i + 1}@example.com`,
  phone: "(123) 456-7890",
  department: ["Design", "Medical", "Trainer", "Medical", "Medical", "Sales", "Marketing", "Marketing", "Medical", "Sales"][i],
  lastLogin: "2024-06-01",
  avatar: ["CF", "LA", "KW", "RF", "JJ", "TW", "GH", "KM", "DL", "EH"][i],
}));

export const surveySteps = ["Assign by", "Recipients", "Publish settings", "Summary"];

export const defaultSurveySettings = {
  assignBy: "all" as const,
  selectedUsers: [],
  publishNow: true,
  publishDate: "2025-06-21",
  publishTime: "16:40",
  notifyPushUp: false,
  notificationText: "A new update is waiting for you in the XYZ company app",
  showOnFeed: false,
  sendReminder: false,
  reminderDate: "2025-06-21",
  reminderTime: "16:40",
  showOnFeedAgency: false,
};
