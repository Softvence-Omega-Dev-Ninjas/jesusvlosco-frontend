type TRole = "ADMIN" | "EMPLOYEE" | "SUPER_ADMIN";

type TDepartment = "DEVELOPMENT";

type TTaskLabel = "LOW" | "MEDIUM" | "HIGH";

type TTaskStatus = "OPEN" | "DAFT" | "OVERDUE" | "DONE" | "IN_PROGRESS";

import { TProfile, TPayroll, TShift } from "./shared";

interface TTaskUser {
  id: string;
  taskId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface TUser {
  id: string;
  phone: string;
  employeeID: number;
  email: string;
  role: TRole;
  isLogin: boolean;
  lastLoginAt: string | null;
  password: string;
  otp: string | null;
  otpExpiresAt: string | null;
  isVerified: boolean;
  pinCode: number | null;
  createdAt: string;
  updatedAt: string;
  profile?: TProfile;
  payroll?: TPayroll | null;
  shift?: TShift[];
  taskUsers?: TTaskUser[];
}

interface TTeam {
  id: string;
  title: string;
  description: string;
  department: TDepartment;
  image: string;
  creatorId: string;
  lastMessageId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TProjectUser {
  id: string;
  projectId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: TUser;
}

interface TTaskUserWithUser {
  id: string;
  taskId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: TUser;
}

interface TTask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  attachment: string | null;
  labels: TTaskLabel;
  status: TTaskStatus;
  createdAt: string;
  updatedAt: string;
  tasksUsers: TTaskUserWithUser[];
}

export interface TProject {
  id: string;
  teamId: string;
  managerId: string;
  title: string;
  projectLocation: string;
  createdAt: string;
  updatedAt: string;
  team: TTeam;
  manager: TUser;
  projectUsers: TProjectUser[];
  tasks: TTask[];
}

export interface ProjectUser {
  user: {
    id: string;
    email: string;
    isAvailable: boolean;
    firstName: string;
    lastName: string;
    jobTitle: string;
    department: string;
    phone: string;
    profileUrl: string;
    offDay: string[];
  };
  project: {
    id: string;
    title: string;
    location: string;
  };
  shifts: UserShiftData[]; // User's assigned shifts
  allShifts: UserShiftData[]; // All project shifts
}


// New interfaces for the project users with shifts data
export interface UserShiftData {
  id: string;
  title: string;
  projectId: string;
  date: string; // ISO format: "2025-08-27T08:00:00.000Z"
  startTime: string; // ISO format: "2025-08-27T08:00:00.000Z"
  endTime: string; // ISO format: "2025-08-27T16:00:00.000Z"
  shiftStatus: "PUBLISHED" | "DRAFT" | "TEMPLATE";
  location: string;
  lat: number;
  lng: number;
  note: string;
  job: string;
  allDay: boolean;
}