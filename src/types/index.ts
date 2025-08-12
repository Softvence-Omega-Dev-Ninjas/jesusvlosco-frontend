// Define a type for your user (example)
export interface BaseUser {
  id: string;
  name: string;
  email: string;
}

export interface User extends BaseUser {
  avatar?: string;
  phone?: string;
  department?: string;
  lastLogin?: string;
}

// Define a type for your app's theme (example)
export type Theme = "light" | "dark";

// Define a type for your app's routes (example)
export type Route = {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
};

// types.ts (inside your @/types directory)
export interface EmployeeLeave {
  employeeName: string;
  jobTitle: string;
  avatar: string;
  timeOff: {
    total: number;
    remaining: number;
  };
  sickLeave: {
    total: number;
    remaining: number;
  };
  casualLeave: {
    total: number;
    remaining: number;
  };
  unpaidLeave: {
    total: number;
    remaining: number;
  };
  lastStatus: "Approved" | "Canceled";
  leaveRequests: LeaveRequest[]; // Add this to store individual leave requests
}

export interface LeaveRequest {
  id: string;
  type: "Sick leave" | "Casual leave" | "Unpaid leave";
  requestedDate: string;
  status: "Approved" | "Canceled";
  dates: string;
  duration: string;
  note: string;
  adminNote?: string;
}
