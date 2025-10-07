import { DateTime } from "luxon";

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

// --- Small helpers ---
export const formatDate = (iso?: string) =>
  iso ? DateTime.fromISO(iso).toFormat("dd/LL/yyyy") : "";

export const formatTimeRange = (startIso?: string, endIso?: string) => {
  if (!startIso && !endIso) return "";
  const s = startIso ? DateTime.fromISO(startIso).toFormat("h:mm a") : "";
  const e = endIso ? DateTime.fromISO(endIso).toFormat("h:mm a") : "";
  return s && e ? `${s.toLowerCase()} - ${e.toLowerCase()}` : s || e;
};
export const humanizeShiftType = (t?: string, startIso?: string) => {
  if (t)
    return t
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/(^| )\w/g, (c) => c.toUpperCase());
  if (startIso) return DateTime.fromISO(startIso).hour < 12 ? "AM" : "PM";
  return "Shift";
};
export const joinName = (p?: Profile) =>
  `${(p?.firstName ?? "").trim()} ${(p?.lastName ?? "").trim()}`.trim() ||
  "Unknown";
