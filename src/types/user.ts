/* eslint-disable @typescript-eslint/no-explicit-any */
type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  profileUrl: string | null;
  gender: "MALE" | "FEMALE" | "OTHER"; // adjust if needed
  // add other profile fields here if you have more
};

export interface IUser  {
  id: string;
  createdAt: string;       // ISO date string
  updatedAt: string;       // ISO date string
  lastLoginAt: string;     // ISO date string
  email: string;
  employeeID: number;
  phone: string;
  role: string;            // e.g., "EMPLOYEE"
  isLogin: boolean;
  isVerified: boolean;
  payroll: any | null;     // specify if you know the shape or keep as any/null
  educations: any[];       // array, specify type if known
  experience: any[];       // array, specify type if known
  profile: Profile;
};