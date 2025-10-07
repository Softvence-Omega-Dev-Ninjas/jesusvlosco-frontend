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

// --- Small helpers (timezone-aware) ---
export const formatDate = (iso?: string, zone = "UTC") => {
  if (!iso) return "";
  const dt = DateTime.fromISO(iso).setZone(zone);
  return dt.isValid ? dt.toFormat("dd/LL/yyyy") : "";
};

export const formatTimeRange = (
  startIso?: string,
  endIso?: string,
  zone = "UTC"
) => {
  if (!startIso && !endIso) return "";
  const s = startIso
    ? DateTime.fromISO(startIso).setZone(zone).toFormat("h:mm a")
    : "";
  const e = endIso
    ? DateTime.fromISO(endIso).setZone(zone).toFormat("h:mm a")
    : "";
  return s && e ? `${s.toLowerCase()} - ${e.toLowerCase()}` : s || e;
};

export const joinName = (p?: Profile) =>
  `${(p?.firstName ?? "").trim()} ${(p?.lastName ?? "").trim()}`.trim() ||
  "Unknown";
