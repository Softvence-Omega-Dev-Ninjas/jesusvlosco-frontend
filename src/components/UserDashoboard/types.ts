export interface Shift {
  startTime: string;
  endTime: string;
  date: string;
  location: string;
  team: string[];
}

export interface Task {
  title: string;
  priority: "Today" | "Tomorrow";
  time?: string;
}

export interface CompanyUpdate {
  department: string;
  title: string;
  description: string;
  time: string;
}

export interface BadgeItem {
  title: string;
  date: string;
}
