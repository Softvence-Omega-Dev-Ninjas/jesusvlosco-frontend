/**
 * Time formatting utilities for consistent local time display across the application
 */

export interface TimeFormatOptions {
  hour12?: boolean;
  showSeconds?: boolean;
  locale?: string;
}

/**
 * Helper function to robustly parse ISO / time-only strings and produce a local Date
 */
export const parseISOToLocalDate = (iso?: string): Date | undefined => {
  if (!iso) return undefined;
  const s = iso.trim();
  try {
    // time-only like "09:00" or "9:00:00" -> attach today's date (local)
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(s)) {
      const [hh, mm, ss = "00"] = s.split(":");
      const d = new Date();
      d.setHours(Number(hh), Number(mm), Number(ss), 0);
      return d;
    }

    // Normalize space to T for "YYYY-MM-DD HH:mm:ss"
    const normalized = s.replace(" ", "T");

    // If string has explicit timezone (Z or +HH:MM / -HH:MM), let Date parse it (will convert to local)
    if (/[zZ]$|[+-]\d{2}:\d{2}$/.test(normalized)) {
      const d = new Date(normalized);
      if (!isNaN(d.getTime())) return d;
    }

    // If ISO string is date+time but no timezone (e.g. "YYYY-MM-DDTHH:mm:ss"), treat as local:
    // parse components and construct with local Date(year, monthIndex, day, hour, minute, second)
    const localMatch = normalized.match(
      /^(\d{4})-(\d{2})-(\d{2})T(\d{1,2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?$/
    );
    if (localMatch) {
      const [, Y, M, D, h, m, s2 = "0"] = localMatch;
      const d = new Date(
        Number(Y),
        Number(M) - 1,
        Number(D),
        Number(h),
        Number(m),
        Number(s2),
        0
      );
      if (!isNaN(d.getTime())) return d;
    }

    // Fallback: try Date constructor on original string
    const fallback = new Date(s);
    if (!isNaN(fallback.getTime())) return fallback;
  } catch {
    // ignore
  }
  return undefined;
};

/**
 * Convert ISO time string to local time string with 12-hour format
 * @param iso - ISO time string (e.g., "2025-08-22T09:00:00.000Z" or "09:00")
 * @param options - Formatting options
 * @returns Formatted time string (e.g., "9:00 AM")
 */
export const toLocalTimeString = (
  iso?: string, 
  options: TimeFormatOptions = {}
): string => {
  const { hour12 = true, showSeconds = false, locale } = options;
  
  const d = parseISOToLocalDate(iso);
  return d
    ? d.toLocaleTimeString(locale, { 
        hour: "numeric", 
        minute: "2-digit", 
        ...(showSeconds && { second: "2-digit" }),
        hour12 
      })
    : (iso || "");
};

/**
 * Convert ISO time string to local time string with 24-hour format
 * @param iso - ISO time string
 * @returns Formatted time string (e.g., "09:00")
 */
export const toLocal24HourString = (iso?: string): string => {
  return toLocalTimeString(iso, { hour12: false });
};

/**
 * Format start and end times as a range string
 * @param startTime - Start time ISO string
 * @param endTime - End time ISO string
 * @param options - Formatting options
 * @returns Formatted time range (e.g., "9:00 AM - 5:00 PM")
 */
export const formatTimeRange = (
  startTime?: string, 
  endTime?: string,
  options: TimeFormatOptions = {}
): string => {
  const start = toLocalTimeString(startTime, options);
  const end = toLocalTimeString(endTime, options);
  
  if (!start && !end) return "";
  if (!start) return end;
  if (!end) return start;
  
  return `${start} - ${end}`;
};

/**
 * Format time for dashboard display (lowercase AM/PM)
 * @param iso - ISO time string
 * @returns Formatted time string (e.g., "9:00 am")
 */
export const toDashboardTimeString = (iso?: string): string => {
  return toLocalTimeString(iso, { hour12: true }).toLowerCase();
};

/**
 * Get current local time as formatted string
 * @param options - Formatting options
 * @returns Current time as formatted string
 */
export const getCurrentLocalTimeString = (options: TimeFormatOptions = {}): string => {
  const now = new Date();
  const { hour12 = true, showSeconds = false, locale } = options;
  
  return now.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
    ...(showSeconds && { second: "2-digit" }),
    hour12
  });
};

export default {
  parseISOToLocalDate,
  toLocalTimeString,
  toLocal24HourString,
  formatTimeRange,
  toDashboardTimeString,
  getCurrentLocalTimeString
};
