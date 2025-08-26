/* eslint-disable @typescript-eslint/no-explicit-any */
// Base types
type UUID = string;
type ISODateString = string;
import { TProfile, TPayroll, TShift } from './shared';

// Enums for better type safety
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER"
}

export enum Role {
  EMPLOYEE = "EMPLOYEE",
  MANAGER = "MANAGER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN"
}

export enum JobType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
  INTERN = "INTERN"
}

export enum PayRateType {
  HOUR = "HOUR",
  SALARY = "SALARY",
  DAILY = "DAILY"
}

export enum BreakTimeType {
  ONE_HOUR = "ONE_HOUR",
  THIRTY_MINUTES = "THIRTY_MINUTES",
  NONE = "NONE"
}

export enum DayOfWeek {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY"
}

export enum ShiftStatus {
  PUBLISHED = "PUBLISHED",
  DRAFT = "DRAFT",
  CANCELLED = "CANCELLED"
}
// Education related types
export interface TEducation {
  id: UUID;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  userId: UUID;
  institution: string;
  program: string;
  year: number;
}

// Experience related types
export interface TExperience {
  id: UUID;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  userId: UUID;
  companyName: string;
  description: string;
  designation: string;
  endDate: ISODateString | null;
  isCurrentlyWorking: boolean;
  jobType: JobType;
  startDate: ISODateString;
}

// Use shared types for profile, payroll, shift and project user
type TShiftStatus = 'PUBLISHED' | 'DRAFT' | 'CANCELLED' | 'COMPLETED';
export interface TShiftDTO {
  id: string;
  date: string; // ISO date string
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  shiftTitle: string;
  allDay: boolean;
  job: string;
  shiftStatus: TShiftStatus;
  location: string;
  note: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
// Main User/Employee type
export interface TUser {
  id: UUID;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  email: string;
  employeeID: number;
  isLogin: boolean;
  isVerified: boolean;
  lastLoginAt: ISODateString | null;
  role: Role;
  phone: string;
  educations: TEducation[];
  experience: TExperience[];
  payroll: TPayroll;
  profile: TProfile;
  projects: any[]; // You can define Project type if needed
  shift: TShift[]; // You can define Shift type if needed
  defaultShifts: any[]; // You can define DefaultShift type if needed
}

// API Response types
export interface TEmployeeListResponse {
  data: TUser[];
  total: number;
  page: number;
  limit: number;
}

export interface TEmployeeResponse {
  data: TUser;
  message: string;
  success: boolean;
}

// Create/Update request types
export interface TCreateEmployeeRequest {
  email: string;
  phone: string;
  role?: Role;
  profile: Omit<TProfile, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;
  payroll?: Omit<TPayroll, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;
  educations?: Omit<TEducation, 'id' | 'createdAt' | 'updatedAt' | 'userId'>[];
  experience?: Omit<TExperience, 'id' | 'createdAt' | 'updatedAt' | 'userId'>[];
}

export interface TUpdateEmployeeRequest extends Partial<TCreateEmployeeRequest> {
  id: UUID;
}

// Filter and search types
export interface TEmployeeFilters {
  role?: Role;
  department?: string;
  isVerified?: boolean;
  isLogin?: boolean;
  gender?: Gender;
  jobType?: JobType;
  search?: string; // for searching by name, email, etc.

}

export interface TEmployeeQueryParams extends TEmployeeFilters {
  page?: number;
  limit?: number;
  sortBy?: keyof TUser;
  sortOrder?: 'asc' | 'desc';
}

// Utility types
export type TEmployeeWithoutRelations = Omit<TUser, 'educations' | 'experience' | 'payroll' | 'profile' | 'projects' | 'shift' | 'defaultShifts'>;

export type TEmployeeBasicInfo = Pick<TUser, 'id' | 'email' | 'employeeID' | 'role' | 'phone'> & {
  profile: Pick<TProfile, 'firstName' | 'lastName' | 'department' | 'jobTitle'>;
};