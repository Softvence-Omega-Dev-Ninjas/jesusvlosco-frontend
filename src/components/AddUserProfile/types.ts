export interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  gender: string;
  employeeID: string;
  jobTitle: string;
  department: string;
  address: string;
  city: string;
  state: string;
  dob: string;
  role: TRole
}

export interface Education {
  id: number;
  program: string;
  institution: string;
  year: number;
}

export interface Experience {
  id: number;
  position: string;
  companyName: string;
  jobType: string;
  startDate: string;
  endDate: string;
  isCurrentlyWorking: boolean;
  description: string;
}

export interface PayrollData {
  payRateRegular: string;
  payRateOvertime: string;
  payRateRegularPeriod: string;
  payRateOvertimePeriod: string;
  casualLeave: string;
  sickLeave: string;
  numberOfDays: string;
  selectOffDay: string;
  breakTime: string;
}

export interface Tab {
  id: string;
  label: string;
}

export type TRole = "SUPER_ADMIN" | "ADMIN" | "USER" | "EMPLOYEE" | "MANAGER";