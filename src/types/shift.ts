export interface ShiftAPIData {
  currentUserId: string;
  currentProjectId: string;
  date: string; // "2025-08-07T08:00:00.000Z" format for API
  shiftStatus: "PUBLISHED" | "DRAFT" | "TEMPLATE";
  startTime: string; // "2025-08-07T08:00:00.000Z" format for API
  endTime: string; // "2025-08-07T16:00:00.000Z" format for API
  shiftTitle: string;
  allDay: boolean;
  job: string;
  userIds: string[];
  taskIds: string[];
  location: string;
  locationLng: number;
  locationLat: number;
  note: string;
  saveAsTemplate: boolean;
}

interface LocationCoordinates {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface ShiftFormData {
  currentUserId?: string;
  currentProjectId?: string;
  date: string; // Will be "YYYY-MM-DD" format from date input
  startTime: string; // Will be "HH:MM" format from time input
  endTime: string; // Will be "HH:MM" format from time input
  shiftTitle: string;
  job: string;
  location: string;
  locationLng: number;
  locationLat: number;
  locationCoordinates?: LocationCoordinates | null;
  note: string;
  allDay: boolean;
  userIds: string[];
  taskIds: string[];
  shiftStatus: "PUBLISHED" | "DRAFT" | "TEMPLATE";
  saveAsTemplate: boolean;
}