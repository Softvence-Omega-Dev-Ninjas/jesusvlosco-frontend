import { DateTime } from "luxon";
import { formatWeekdayShort } from "./formatDateToMDY";

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
      fullDate: date.toISOString().split("T")[0],
    });
  }

  return week;
};

/**
 * Generate week dates for WeeklySchedule (returns fullDate as Date)
 * @param currentDate - The current date to base the week on
 * @returns Array of week days
 */
export const generateWeekDatesForWeeklySchedule = (currentDate: Date) => {
  const days = [];
  const startDate = currentDate ? new Date(currentDate) : new Date();
  const dayOfWeek = startDate.getDay();
  const diff = startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  startDate.setDate(diff);

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startDate);
    currentDay.setDate(startDate.getDate() + i);
    days.push({
      day: currentDay.toLocaleString("default", { weekday: "short" }),
      date: formatDate(currentDay),
      fullDate: new Date(currentDay).toLocaleString("en-US"),
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
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

/**
 * Get short weekday name from date
 * @param date - Date to get weekday from
 * @returns Short weekday name
 */
export const formatWeekdayShortLocal = (date: Date): string => {
  const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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
    formatted: formatDateRange(currentDate),
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
 * Convert local date + time to proper UTC ISO string
 * @param date - "YYYY-MM-DD" local date
 * @param time - "HH:MM" local time
 * @returns correct ISO string in UTC
 */
export const convertToISOFormat = (date: string, time: string): string => {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  // Treat the values as local and convert to UTC
  const localDate = new Date(year, month - 1, day, hour, minute, 0);
  return localDate.toISOString();
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
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[dayIndex] || "";
};

/**
 * Get day name from ISO day string
 * @param isoDay - ISO day string (e.g., 'MONDAY')
 * @returns Day name
 */
export const getDayNameFromISO = (isoDay: string): string => {
  const dayMap: { [key: string]: string } = {
    MONDAY: "Mon",
    TUESDAY: "Tue",
    WEDNESDAY: "Wed",
    THURSDAY: "Thu",
    FRIDAY: "Fri",
    SATURDAY: "Sat",
    SUNDAY: "Sun",
  };
  return dayMap[isoDay.toUpperCase()] || isoDay;
};

export const userDefaultTimeZone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

/**
 * Convert a local date (YYYY-MM-DD) + time (HH:MM) in `timeZone` to UTC ISO string.
 * Example: convertLocalDateTimeToUTC("2025-09-02","08:28","America/Denver")
 * returns "2025-09-02T14:28:00.000Z" (MDT -> UTC)
 */
export const convertLocalDateTimeToUTC = (
  date: string,
  time: string,
  timeZone: string = userDefaultTimeZone()
): string => {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  // Treat input as if it's a UTC timestamp for those Y/M/D H:m values (reference point)
  const assumedUtcMs = Date.UTC(year, month - 1, day, hour, minute, 0);

  // Format that assumedUtc date into the target timeZone to extract its local parts
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = dtf.formatToParts(new Date(assumedUtcMs));
  const p = (type: string) => parts.find((x) => x.type === type)?.value || "00";

  const tzY = Number(p("year"));
  const tzM = Number(p("month"));
  const tzD = Number(p("day"));
  const tzH = Number(p("hour"));
  const tzMin = Number(p("minute"));
  const tzS = Number(p("second"));

  // millis for those extracted parts (interpreting them as UTC)
  const tzPartsAsUtcMs = Date.UTC(tzY, tzM - 1, tzD, tzH, tzMin, tzS);

  // offset between the assumedUtc and the representation in the target timezone
  const offsetMs = assumedUtcMs - tzPartsAsUtcMs;

  // The real UTC instant for the *input local* Y/M/D H:m is:
  const realUtcMs = Date.UTC(year, month - 1, day, hour, minute, 0) - offsetMs;

  return new Date(realUtcMs).toISOString();
};

/**
 * Convert UTC ISO string -> local { date: "YYYY-MM-DD", time: "HH:MM" } in `timeZone`.
 */
export const convertUTCToLocal = (
  utcISOString: string,
  timeZone: string = userDefaultTimeZone()
): { date: string; time: string } => {
  const d = new Date(utcISOString);
  const dtfDate = new Intl.DateTimeFormat("en", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const dtfTime = new Intl.DateTimeFormat("en", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const partsDate = dtfDate.formatToParts(d);
  const p = (type: string) =>
    partsDate.find((x) => x.type === type)?.value || "00";

  const yyyy = p("year");
  const mm = p("month");
  const dd = p("day");

  // time parts (using dtfTime)
  const partsTime = dtfTime.formatToParts(d);
  const get = (type: string) =>
    partsTime.find((x) => x.type === type)?.value || "00";
  const hh = get("hour");
  const min = get("minute");

  return {
    date: `${yyyy}-${mm}-${dd}`, // YYYY-MM-DD
    time: `${hh.padStart(2, "0")}:${min.padStart(2, "0")}`, // HH:MM (24h)
  };
};

/**
 * Convert UTC ISO string -> local { date: "Fri, Sep 20", time: "h:mm AM/PM" } in `timeZone`.
 */
// export const convertUTCToLocalPretty = (
//   utcISOString: string,
//   timeZone: string = userDefaultTimeZone()
// ): { date: string; time: string } => {
//   const d = new Date(utcISOString);

//   // Date (short weekday + short month + day)
//   const dtfDate = new Intl.DateTimeFormat("en", {
//     timeZone,
//     weekday: "short",
//     month: "short",
//     day: "numeric",
//   });

//   // Time (12-hour with AM/PM)
//   const dtfTime = new Intl.DateTimeFormat("en", {
//     timeZone,
//     hour: "numeric",
//     minute: "2-digit",
//     hour12: true,
//   });

//   return {
//     date: dtfDate.format(d), // e.g. "Fri, Sep 20"
//     time: dtfTime.format(d), // e.g. "4:19 AM"
//   };
// };

export const convertUTCToLocalPretty = (
  utcInput: string | Date | null | undefined,
  timeZone: string = userDefaultTimeZone()
): { date: string; time: string } => {
  if (!utcInput) return { date: "", time: "" };

  // accept ISO string or Date
  let dt =
    typeof utcInput === "string"
      ? DateTime.fromISO(utcInput, { zone: "utc" })
      : DateTime.fromJSDate(new Date(utcInput), { zone: "utc" });

  // Convert to user's timezone
  dt = dt.setZone(timeZone);

  if (!dt.isValid) {
    // fallback empty values on invalid input
    return { date: "", time: "" };
  }

  // Example formats:
  // date -> "Fri, Sep 20"
  // time -> "4:19 AM"
  const date = dt.toFormat("ccc, LLL dd");
  const time = dt.toFormat("h:mm a");

  return { date, time };
};

/**
 * Compare whether two dates represent the same calendar DAY in the provided timeZone.
 * Works with Date | string (ISO) inputs.
 */
export const isSameDayInTimeZone = (
  a: Date | string,
  b: Date | string,
  timeZone: string = userDefaultTimeZone()
): boolean => {
  const toYMD = (input: Date | string) => {
    const d = typeof input === "string" ? new Date(input) : input;
    const dtf = new Intl.DateTimeFormat("en", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const parts = dtf.formatToParts(d);
    const p = (type: string) =>
      parts.find((x) => x.type === type)?.value || "00";
    return `${p("year")}-${p("month")}-${p("day")}`;
  };

  return toYMD(a) === toYMD(b);
};

export function getShiftDateISOString() {
  const userTimeZone = userDefaultTimeZone();
  const dt = DateTime.now().setZone(userTimeZone); // ✅ normalize to start of day in user tz
  return dt.toUTC().toISO(); // send start of day in UTC
}
