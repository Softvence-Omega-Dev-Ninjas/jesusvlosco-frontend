// Enums
export enum TRole {
  EMPLOYEE = "EMPLOYEE",
  ADMIN = "ADMIN", // Assuming there might be an admin role
}

export enum TGender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum TJobTitle {
  FULL_STACK_DEVELOPER = "FULL_STACK_DEVELOPER",
  DATA_ENGINEER = "DATA_ENGINEER",
  BACKEND_DEVELOPER = "BACKEND_DEVELOPER",
  FRONTEND_DEVELOPER = "FRONTEND_DEVELOPER",
}

export enum TDepartment {
  DEVELOPMENT = "DEVELOPMENT",
  MARKETING = "MARKETING",
  SALES = "SALES",
  HR = "HR",
}

// Profile interface
export interface TProfile {
  id: string;
  firstName: string;
  lastName: string;
  profileUrl: string | null;
  gender: TGender;
  jobTitle: TJobTitle;
  department: TDepartment;
  address: string;
  city: string;
  state: string;
  dob: string; // ISO date string
  country: string | null;
  nationality: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  userId: string;
}

// User interface
export interface TUser {
  id: string;
  phone: string;
  employeeID: number;
  email: string;
  role: TRole;
  isLogin: boolean;
  lastLoginAt: string | null; // ISO date string
  password: string;
  otp: string | null;
  otpExpiresAt: string | null; // ISO date string
  isVerified: boolean;
  pinCode: number | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  profile: TProfile;
}

// Team member interface
export interface TTeamMember {
  id: string;
  teamId: string;
  userId: string;
  isAdmin: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  user: TUser;
}

// Project interface
export interface TProject {
  id: string;
  teamId: string;
  managerId: string;
  title: string;
  projectLocation: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Main Team interface
export interface TTeam {
  id: string;
  title: string;
  description: string;
  department: TDepartment;
  image: string;
  creatorId: string;
  lastMessageId: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  members: TTeamMember[];
  projects: TProject[];
}