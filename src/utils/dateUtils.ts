import { formatWeekdayShort } from './formatDateToMDY';

export interface WeekDay {
  day?: string; // For WeeklySchedule compatibility
  short?: string; // For UserShiftScheduling compatibility
  date: string;
  fullDate: Date | string; // Can be Date or string depending on usage
  isoDate?: string;
}

export interface WeekRange {
  startDate: Date;
  endDate: Date;
  formatted: string;
}

/**
 * Generate week dates for UserShiftScheduling (returns fullDate as string)
 * @param startDate - The date to start generating the week from
 * @returns Array of week days with formatted information
 */
export const generateWeekDatesForUserScheduling = () => {
  const week = [];
  const start = new Date();

  // Start from Monday (getDay() returns 0 for Sunday, so we adjust)
  const dayOfWeek = start.getDay();
  const diff = start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  start.setDate(diff);

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);

    week.push({
      short: formatWeekdayShort(date.toISOString()),
      day: date.toLocaleString("default", { weekday: "short" }),
      date: formatDate(date),
      fullDate: date.toISOString().split('T')[0]
    });
  }

  return week;
};

/**
 * Generate week dates for WeeklySchedule (returns fullDate as Date)
 * @param currentDate - The current date to base the week on
 * @returns Array of week days
 */
export const generateWeekDatesForWeeklySchedule = () => {
  const days = [];
  const startDate = new Date();
  const dayOfWeek = startDate.getDay();
  const diff = startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  startDate.setDate(diff);

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startDate);
    currentDay.setDate(startDate.getDate() + i);
    days.push({
      day: currentDay.toLocaleString("default", { weekday: "short" }),
      date: formatDate(currentDay),
      fullDate: new Date(currentDay)
    });
  }

  return days;
};

/**
 * Format date to MM/DD format
 * @param date - Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

/**
 * Format date to short format (DD-MM-YYYY)
 * @param date - Date to format
 * @returns Formatted date string
 */
export const formatDateShortLocal = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

/**
 * Get short weekday name from date
 * @param date - Date to get weekday from
 * @returns Short weekday name
 */
export const formatWeekdayShortLocal = (date: Date): string => {
  const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return weekdayNames[date.getDay()];
};

/**
 * Format date range for the current week
 * @param currentDate - Current date to base the week on
 * @returns Formatted date range string
 */
export const formatDateRange = (currentDate: Date): string => {
  const startDate = new Date(currentDate);
  const dayOfWeek = startDate.getDay();
  const diff = startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  startDate.setDate(diff);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  return `${startDate.toLocaleString("default", {
    month: "short",
  })} ${startDate.getDate()} - ${endDate.toLocaleString("default", {
    month: "short",
  })} ${endDate.getDate()}`;
};

/**
 * Get the week range object
 * @param currentDate - Current date to base the week on
 * @returns Week range object
 */
export const getWeekRange = (currentDate: Date): WeekRange => {
  const startDate = new Date(currentDate);
  const dayOfWeek = startDate.getDay();
  const diff = startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  startDate.setDate(diff);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  return {
    startDate,
    endDate,
    formatted: formatDateRange(currentDate)
  };
};

/**
 * Navigate to previous week
 * @param currentDate - Current date
 * @returns New date for previous week
 */
export const goToPreviousWeek = (currentDate: Date): Date => {
  const newDate = new Date(currentDate);
  newDate.setDate(newDate.getDate() - 7);
  return newDate;
};

/**
 * Navigate to next week
 * @param currentDate - Current date
 * @returns New date for next week
 */
export const goToNextWeek = (currentDate: Date): Date => {
  const newDate = new Date(currentDate);
  newDate.setDate(newDate.getDate() + 7);
  return newDate;
};

/**
 * Check if two dates are the same day
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if same day
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  const date1Str = date1.toISOString().split("T")[0];
  const date2Str = date2.toISOString().split("T")[0];
  return date1Str === date2Str;
};

/**
 * Convert local date and time to UTC ISO format
 * @param date - Date in YYYY-MM-DD format
 * @param time - Time in HH:MM format
 * @returns ISO string
 */
export const convertToISOFormat = (date: string, time: string): string => {
  // date is in YYYY-MM-DD format, time is in HH:MM format (local)
  // Create a Date object interpreting date and time as UTC
  const localDateTime = new Date(`${date}T${time}:00Z`);
  // Convert to UTC ISO string
  return localDateTime.toISOString();
};

/**
 * Get start of week (Monday)
 * @param date - Date to get start of week for
 * @returns Date representing start of week
 */
export const getStartOfWeek = (date: Date): Date => {
  const start = new Date(date);
  const dayOfWeek = start.getDay();
  const diff = start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  start.setDate(diff);
  return start;
};

/**
 * Get end of week (Sunday)
 * @param date - Date to get end of week for
 * @returns Date representing end of week
 */
export const getEndOfWeek = (date: Date): Date => {
  const end = getStartOfWeek(date);
  end.setDate(end.getDate() + 6);
  return end;
};

/**
 * Check if date is within current week
 * @param date - Date to check
 * @param currentDate - Current date to base week on
 * @returns True if date is in current week
 */
export const isDateInCurrentWeek = (date: Date, currentDate: Date): boolean => {
  const weekStart = getStartOfWeek(currentDate);
  const weekEnd = getEndOfWeek(currentDate);
  return date >= weekStart && date <= weekEnd;
};

/**
 * Get day name from day index (0-6, Sunday-Saturday)
 * @param dayIndex - Day index
 * @returns Day name
 */
export const getDayName = (dayIndex: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex] || '';
};

/**
 * Get day name from ISO day string
 * @param isoDay - ISO day string (e.g., 'MONDAY')
 * @returns Day name
 */
export const getDayNameFromISO = (isoDay: string): string => {
  const dayMap: { [key: string]: string } = {
    'MONDAY': 'Mon',
    'TUESDAY': 'Tue',
    'WEDNESDAY': 'Wed',
    'THURSDAY': 'Thu',
    'FRIDAY': 'Fri',
    'SATURDAY': 'Sat',
    'SUNDAY': 'Sun'
  };
  return dayMap[isoDay.toUpperCase()] || isoDay;
};
