export type TClockInRequest = {
  id: string;
  userId: string;
  shiftId: string;
  requestedClockInAt: string; // ISO 8601 date string
  requestedClockOutAt: string; // ISO 8601 date string
  location: string;
  locationLat: number;
  locationLng: number;
  reason: string;
  status: string;// Common status values
  reviewedBy: string | null;
  reviewedAt: string | null; // ISO 8601 date string
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  user: {
    id: string;
    phone: string;
    employeeID: number;
    email: string;
    role: string; // Common role values
    isLogin: boolean;
    lastLoginAt: string | null; // ISO 8601 date string
    password: string; // Hashed password
    otp: string | null;
    otpExpiresAt: string | null; // ISO 8601 date string
    isVerified: boolean;
    pinCode: string | null;
    createdAt: string; // ISO 8601 date string
    updatedAt: string; // ISO 8601 date string
    profile: {
      id: string;
      firstName: string;
      lastName: string;
      profileUrl: string | null;
      jobTitle: string;
      gender: string; // Common gender values
      department: string; // Could be made into union type if departments are fixed
      address: string;
      city: string;
      state: string;
      dob: string; // ISO 8601 date string
      country: string;
      nationality: string;
      createdAt: string; // ISO 8601 date string
      updatedAt: string; // ISO 8601 date string
      userId: string;
    };
  };
  shift: {
    id: string;
    startTime: string; // ISO 8601 date string
    endTime: string; // ISO 8601 date string
    location: string;
    locationLat: number;
    locationLng: number;
    date: string; // ISO 8601 date string
    allDay: boolean;
    shiftTitle: string;
    job: string;
    note: string;
    shiftType: string; // Common shift types
    shiftStatus: string; // Common shift statuses
    createdAt: string; // ISO 8601 date string
    updatedAt: string; // ISO 8601 date string
    projectId: string;
  };
};