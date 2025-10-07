// --- Types (match backend response shape) ---
export type Project = {
  id: string;
  title: string;
  location?: string;
};

export type Shift = {
  id: string;
  startTime?: string; // ISO
  endTime?: string; // ISO
  shiftType?: string; // e.g. AFTERNOON
  allDay?: boolean;
  location?: string;
  lat?: number;
  lng?: number;
  note?: string;
};

export type Profile = {
  id: string;
  firstName?: string;
  lastName?: string;
  profileUrl?: string;
  email?: string;
  jobTitle?: string;
};

export type AssignedUserItem = {
  date: string; // ISO date
  project: Project;
  shift: Shift;
  profile: Profile;
};

export type ApiMetadata = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type AssignedUsersResponse = {
  success: boolean;
  message?: string;
  data: AssignedUserItem[];
  metadata?: ApiMetadata;
};
