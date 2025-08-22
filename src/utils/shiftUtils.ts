/**
 * Shift Data Utilities
 * 
 * Helper functions for working with shift data from the API
 */

// API Shift Data Interface (matches your API response)
export interface ApiShiftData {
  id: string;
  startTime: string; // ISO string like "2025-08-22T00:00:00.000Z"
  endTime: string;   // ISO string like "2025-08-22T23:00:00.000Z"
  location: string;  // e.g., "Q9GX+QVP, Dhaka 1212, Bangladesh"
  locationLat: number; // e.g., 23.7768882
  locationLng: number; // e.g., 90.3995698
  date: string;      // ISO string like "2025-08-22T00:00:00.000Z"
  allDay: boolean;
  shiftTitle: string; // e.g., "Evening Shift"
  job: string;       // e.g., "Do Full Stack"
  note: string;      // e.g., "gdssgsdgsdg"
  shiftType: "MORNING" | "AFTERNOON" | "EVENING" | "NIGHT";
  shiftStatus: "PUBLISHED" | "DRAFT" | "TEMPLATE";
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// UI Shift Interface (used by components)
export interface UIShift {
  startTime: string; // Formatted like "9:00 AM"
  endTime: string;   // Formatted like "11:00 PM"
  date: string;      // Formatted like "Thursday, August 22"
  location: string;
  team: string[];
}

/**
 * Check if a shift is scheduled for today
 */
export const isShiftToday = (shift: ApiShiftData): boolean => {
  const today = new Date().toISOString().slice(0, 10);
  const shiftDate = new Date(shift.date).toISOString().slice(0, 10);
  return today === shiftDate;
};

/**
 * Check if a shift is currently active (between start and end time)
 */
export const isShiftActive = (shift: ApiShiftData): boolean => {
  const now = new Date();
  const startTime = new Date(shift.startTime);
  const endTime = new Date(shift.endTime);
  return now >= startTime && now <= endTime;
};

/**
 * Get the duration of a shift in hours
 */
export const getShiftDuration = (shift: ApiShiftData): number => {
  const startTime = new Date(shift.startTime);
  const endTime = new Date(shift.endTime);
  const diffInMs = endTime.getTime() - startTime.getTime();
  return diffInMs / (1000 * 60 * 60); // Convert to hours
};

/**
 * Format shift duration as human-readable string
 */
export const formatShiftDuration = (shift: ApiShiftData): string => {
  const hours = getShiftDuration(shift);
  if (hours === 1) return "1 hour";
  if (hours < 24) return `${hours} hours`;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  if (remainingHours === 0) return `${days} ${days === 1 ? 'day' : 'days'}`;
  return `${days} ${days === 1 ? 'day' : 'days'} ${remainingHours} ${remainingHours === 1 ? 'hour' : 'hours'}`;
};

/**
 * Get shift status with human-readable labels
 */
export const getShiftStatusLabel = (status: ApiShiftData['shiftStatus']): string => {
  const labels = {
    PUBLISHED: "Published",
    DRAFT: "Draft",
    TEMPLATE: "Template"
  };
  return labels[status] || status;
};

/**
 * Get shift type with human-readable labels
 */
export const getShiftTypeLabel = (type: ApiShiftData['shiftType']): string => {
  const labels = {
    MORNING: "Morning Shift",
    AFTERNOON: "Afternoon Shift", 
    EVENING: "Evening Shift",
    NIGHT: "Night Shift"
  };
  return labels[type] || type;
};

/**
 * Find the most recent shift from a list
 */
export const getMostRecentShift = (shifts: ApiShiftData[]): ApiShiftData | undefined => {
  if (!shifts.length) return undefined;
  
  return shifts.reduce((latest, current) => 
    new Date(current.createdAt).getTime() > new Date(latest.createdAt).getTime() 
      ? current 
      : latest
  );
};

/**
 * Filter shifts for today
 */
export const getTodayShifts = (shifts: ApiShiftData[]): ApiShiftData[] => {
  return shifts.filter(isShiftToday);
};

/**
 * Get current active shift (if any)
 */
export const getCurrentActiveShift = (shifts: ApiShiftData[]): ApiShiftData | undefined => {
  return shifts.find(isShiftActive);
};

/**
 * Check if shift location has coordinates
 */
export const hasShiftLocation = (shift: ApiShiftData): boolean => {
  return shift.locationLat !== 0 && shift.locationLng !== 0;
};

/**
 * Format location coordinates as string
 */
export const formatShiftCoordinates = (shift: ApiShiftData): string => {
  if (!hasShiftLocation(shift)) return "No coordinates";
  return `${shift.locationLat.toFixed(6)}, ${shift.locationLng.toFixed(6)}`;
};

export default {
  isShiftToday,
  isShiftActive,
  getShiftDuration,
  formatShiftDuration,
  getShiftStatusLabel,
  getShiftTypeLabel,
  getMostRecentShift,
  getTodayShifts,
  getCurrentActiveShift,
  hasShiftLocation,
  formatShiftCoordinates
};
