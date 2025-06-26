export interface FormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailId: string;
  gender: string;
  employeeId: string;
  jobTitle: string;
  department: string;
  address: string;
  city: string;
  state: string;
  dateOfBirth: string;
}

export interface Education {
  id: number;
  program: string;
  institution: string;
  year: string;
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
