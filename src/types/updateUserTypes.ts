/* Types for updating user profile information */

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  gender?: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
  jobTitle?: "BACK_END_DEVELOPER" | "FRONT_END_DEVELOPER" | "FULL_STACK_DEVELOPER" | "MOBILE_DEVELOPER" | "UI_DEVELOPER" | "UX_DEVELOPER" | "SEALS_ENGINEER" | "DATA_SCIENTIST" | "DEVOPS_ENGINEER" | "QA_ENGINEER" | "PROJECT_MANAGER" | "PRODUCT_MANAGER";
  department?: string;
  dob?: string; // ISO date string
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  nationality?: string;
}

export interface UpdateExperienceData {
  id?: string; // For updating existing experience
  designation: string;
  companyName: string;
  jobType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN" | "TEMPORARY" | "FREELANCE";
  startDate: string; // ISO date string
  endDate?: string | null; // ISO date string
  description: string;
  isCurrentlyWorking: boolean;
}

export interface UpdateEducationData {
  id?: string; // For updating existing education
  program: string;
  institution: string;
  year: number;
}

export interface UpdatePayrollData {
  regularPayRate?: number;
  regularPayRateType?: "HOUR" | "DAY" | "MONTH";
  overTimePayRate?: number;
  overTimePayRateType?: "HOUR" | "DAY" | "MONTH";
  casualLeave?: number;
  sickLeave?: number;
  timeOff?: number;
  offDay?: string[]; // Array of days like ["SATURDAY", "SUNDAY"]
  breakTimePerDay?: "NONE" | "HALF_HOUR" | "ONE_HOUR" | "TWO_HOUR" | "THREE_HOUR";
}

export interface UpdateUserFormData {
  profile?: UpdateProfileData;
  experiences?: Partial<UpdateExperienceData>[];
  educations?: Partial<UpdateEducationData>[];
  payroll?: UpdatePayrollData;
}

// For form field tracking
export interface FormFieldState {
  isDirty: boolean;
  value: string | number | boolean | string[] | null;
}

export interface UpdateFormState {
  profile: { [key: string]: FormFieldState };
  experiences: { [index: number]: { [key: string]: FormFieldState } };
  educations: { [index: number]: { [key: string]: FormFieldState } };
  payroll: { [key: string]: FormFieldState };
}
