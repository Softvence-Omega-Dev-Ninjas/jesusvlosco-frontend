/* Shared/common types used across user and project types */
/* Keep these intentionally permissive to accommodate slightly different shapes
   used across the codebase without forcing a breaking change. */

import { TUser } from "./usertype";

export interface TProfile {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  department?: string | null;
  dob?: string | null;
  firstName?: string | null;
  gender?: string | null;
  jobTitle?: string | null;
  lastName?: string | null;
  nationality?: string | null;
  profileUrl?: string | null;
  state?: string | null;
  offDay?: string | null;
}

export interface TPayroll {
  id: string;
  offDay?: string[];
  numberOffDay?: number;
  breakTimePerDay?: string;
  regularPayRate?: number;
  regularPayRateType?: string;
  overTimePayRate?: number;
  overTimePayRateType?: string;
  timeOff?: number;
  unpaidLeave?: number;
  casualLeave?: number;
  sickLeave?: number;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  // additional optional fields to cover other usages
  numberOfDay?: number;
  offDayArr?: string[];
}

export interface TShift {
  id: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  shiftTitle?: string;
  title?: string;
  allDay?: boolean;
  job?: string;
  shiftStatus?: string;
  location?: string;
  note?: string | null;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface TProjectUser {
  id: string;
  projectId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: TUser;
}
