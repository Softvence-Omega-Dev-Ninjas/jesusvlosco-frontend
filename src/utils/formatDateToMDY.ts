type DateOverride = { year: number; month: number; day: number } | null;

export function formatDateToMDY(
  dateInput: string | number | Date,
  override: DateOverride = null
) {
  const original = new Date(dateInput);

  const finalDate = override
    ? new Date(
        Date.UTC(
          override.year,
          override.month - 1,
          override.day,
          original.getUTCHours(),
          original.getUTCMinutes(),
          original.getUTCSeconds()
        )
      )
    : original;

  const month = finalDate.getUTCMonth() + 1;
  const day = finalDate.getUTCDate();
  const year = String(finalDate.getUTCFullYear()).slice(-2);

  return `${month}/${day}/${year}`;
}

export const parseISODate = (isoString: string): Date | null => {
  try {
    const date = new Date(isoString);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};

export const formatTimeFromISO = (isoString: string): string => {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString; // fallback if invalid

  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // <-- ensures 12 hour format
  });
};

// Additional utility functions for consistent timezone handling
export const formatDateFromISO = (isoString: string): string => {
  const date = new Date(isoString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  if (!date) return isoString;

  return date;
};

export const formatWeekdayShort = (isoString: string): string => {
  const date = parseISODate(isoString);
  if (!date) return '';

  const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return weekdayNames[date.getUTCDay()];
};

export const formatDateShort = (isoString: string): string => {
  const date = parseISODate(isoString);
  if (!date) return '';

  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${day}-${month}-${year}`;
};

export const formatDateFull = (isoString: string): string => {
  const date = parseISODate(isoString);
  if (!date) return '';

  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${day}-${month}-${year}`;
};

export const formatDateWithWeekday = (isoString: string): string => {
  const date = parseISODate(isoString);
  if (!date) return '';

  const weekday = date.toLocaleString('en-US', { weekday: 'long', timeZone: 'UTC' });
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${weekday}, ${day}-${month}-${year}`;
};

export function toISODate(dateStr: string, timeStr: string): string {
  // dateStr is in dd/MM/yyyy format (e.g., "29/08/2025")
  const [day, month, year] = dateStr.split("/").map(Number);

  // timeStr is in HH:mm format (e.g., "16:28")
  const [hours, minutes] = timeStr.split(":").map(Number);

  // Construct JS Date (month is 0-indexed)
  const date = new Date(year, month - 1, day, hours, minutes);

  return date.toISOString(); // -> "2025-08-29T16:28:00.000Z"
}

// Used in Admin Shift Scheduling
export function formatShift(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);

  // Date formatter
  const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
  });

  // Time formatter
  const timeFormatter = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Duration in hours
  const durationMs = endDate.getTime() - startDate.getTime();
  const durationHours =
    Math.floor(durationMs / (1000 * 60 * 60))
      .toString()
      .padStart(2, "0") + ":00 hours";

  return `${dateFormatter.format(startDate)}\n${timeFormatter.format(
    startDate
  )}\n(${durationHours})\n\n→\n\n${dateFormatter.format(
    endDate
  )}\n${timeFormatter.format(endDate)}\n(${durationHours})`;
}
