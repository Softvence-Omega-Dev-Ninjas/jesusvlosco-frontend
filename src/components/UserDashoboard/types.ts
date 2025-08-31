export interface Shift {
  startTime: string;
  endTime: string;
  date: string;
  location: string;
  team: string[];
}

// Task object from API (upcomingTasks[])
export interface Task {
  id: string;
  title: string;
  description: string;
  startTime: string;   // ISO datetime
  endTime: string;     // ISO datetime
  location: string;
  attachment: string | null;
  labels: "LOW" | "MEDIUM" | "HIGH"; // based on your "MEDIUM" example
  status: "OPEN" | "IN_PROGRESS" | "DONE"; // based on your "OPEN" example
  createdAt: string;
  updatedAt: string;
  projectId: string;
}

// CompanyUpdate object from API (companyUpdates[])
export interface CompanyUpdate {
  id: string;
  type: "Announcement";
  title: string;
  message: string; // HTML content string
  meta: {
    performedBy: string;     // userId
    publishedAt: string;     // ISO datetime
    announcementId: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Recognition object from API (recognitions[])
export interface Recognition {
  id: string;
  type: "Recognition";
  title: string;
  message: string;
  meta: {
    createdAt: string;
    performedBy: string;
    recognitionId: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Urgent shift change object from API (urgentShiftChange[])
export interface UrgentShiftChange {
  id: string;
  type: "UrgentShiftChanged";
  title: string;
  message: string;
  meta: {
    date: string;   // ISO datetime
    status: "URGENT_SHIFT_CHANGED";
    performedBy: string;
  };
  createdAt: string;
  updatedAt: string;
}

