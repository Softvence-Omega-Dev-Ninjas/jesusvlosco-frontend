/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Time Formatting Usage Examples
 * 
 * This file demonstrates how to use the timeUtils functions for consistent
 * local time formatting across your application.
 */

import { 
  toLocalTimeString, 
  toLocal24HourString, 
  formatTimeRange, 
  toDashboardTimeString,
  getCurrentLocalTimeString 
} from '@/utils/timeUtils';

// Example API response times (these are typical formats you might receive)
const exampleTimes = {
  isoWithTimezone: "2025-08-22T09:00:00.000Z",
  isoWithoutTimezone: "2025-08-22T09:00:00",
  timeOnly: "09:00",
  timeOnlyWithSeconds: "09:00:00",
  startTime: "2025-08-22T09:00:00.000Z",
  endTime: "2025-08-22T17:00:00.000Z"
};

// ✅ BASIC TIME FORMATTING EXAMPLES
export const basicTimeFormatting = () => {
  console.log("=== BASIC TIME FORMATTING ===");

  // Convert to 12-hour format with AM/PM
  console.log("12-hour format:", toLocalTimeString(exampleTimes.isoWithTimezone));
  // Output: "9:00 AM"

  // Convert to 24-hour format
  console.log("24-hour format:", toLocal24HourString(exampleTimes.isoWithTimezone));
  // Output: "09:00"

  // Dashboard style (lowercase am/pm)
  console.log("Dashboard style:", toDashboardTimeString(exampleTimes.isoWithTimezone));
  // Output: "9:00 am"
};

// ✅ TIME RANGE FORMATTING EXAMPLES
export const timeRangeFormatting = () => {
  console.log("=== TIME RANGE FORMATTING ===");

  // Format start and end times as range
  console.log("Time range:", formatTimeRange(exampleTimes.startTime, exampleTimes.endTime));
  // Output: "9:00 AM - 5:00 PM"

  // 24-hour time range
  console.log("24-hour range:", formatTimeRange(exampleTimes.startTime, exampleTimes.endTime, { hour12: false }));
  // Output: "09:00 - 17:00"
};

// ✅ CURRENT TIME EXAMPLES
export const currentTimeExamples = () => {
  console.log("=== CURRENT TIME ===");

  // Get current time in different formats
  console.log("Current time (12-hour):", getCurrentLocalTimeString());
  console.log("Current time (24-hour):", getCurrentLocalTimeString({ hour12: false }));
  console.log("Current time with seconds:", getCurrentLocalTimeString({ showSeconds: true }));
};

// ✅ PRACTICAL USAGE FUNCTIONS
export const practicalUsageExamples = {
  
  // Example: Format shift time for display
  formatShiftTime: (startTime: string, endTime: string) => {
    return formatTimeRange(startTime, endTime);
    // Usage: formatShiftTime("2025-08-22T09:00:00.000Z", "2025-08-22T17:00:00.000Z")
    // Returns: "9:00 AM - 5:00 PM"
  },

  // Example: Format time for dashboard (lowercase)
  formatDashboardTime: (startTime: string, endTime: string) => {
    return formatTimeRange(startTime, endTime, { hour12: true }).toLowerCase();
    // Usage: formatDashboardTime("2025-08-22T09:00:00.000Z", "2025-08-22T17:00:00.000Z")
    // Returns: "9:00 am - 5:00 pm"
  },

  // Example: Format time for form input (24-hour)
  formatTimeForInput: (isoTime: string) => {
    return toLocal24HourString(isoTime);
    // Usage: formatTimeForInput("2025-08-22T09:00:00.000Z")
    // Returns: "09:00"
  },

  // Example: Format time for API submission
  formatTimeForAPI: (dateTime: Date) => {
    return dateTime.toISOString();
    // Usage: formatTimeForAPI(new Date())
    // Returns: "2025-08-22T09:00:00.000Z"
  }
};

// ✅ COMPONENT INTEGRATION EXAMPLES (as functions)
export const componentIntegrationExamples = {

  // Example: Shift card data processing
  processShiftData: (apiShiftData: any) => {
    return {
      ...apiShiftData,
      displayTime: formatTimeRange(apiShiftData.startTime, apiShiftData.endTime),
      startTimeFormatted: toLocalTimeString(apiShiftData.startTime),
      endTimeFormatted: toLocalTimeString(apiShiftData.endTime)
    };
  },

  // Example: Employee dashboard data processing
  processEmployeeData: (employees: any[]) => {
    return employees.map(employee => ({
      ...employee,
      workTime: employee.shift 
        ? formatTimeRange(employee.shift.startTime, employee.shift.endTime, { hour12: true }).toLowerCase()
        : "No shift assigned"
    }));
  },

  // Example: Task form time preparation
  prepareTaskFormTime: (taskData: any) => {
    return {
      startTime24: taskData.startTime ? toLocal24HourString(taskData.startTime) : "",
      endTime24: taskData.endTime ? toLocal24HourString(taskData.endTime) : "",
      startTimeDisplay: taskData.startTime ? toLocalTimeString(taskData.startTime) : "",
      endTimeDisplay: taskData.endTime ? toLocalTimeString(taskData.endTime) : ""
    };
  }
};

// ✅ USAGE SUMMARY
export const usageSummary = {
  // For user-friendly display (12-hour with AM/PM)
  userDisplay: (time: string) => toLocalTimeString(time),
  
  // For form inputs (24-hour format)
  formInput: (time: string) => toLocal24HourString(time),
  
  // For time ranges
  timeRange: (start: string, end: string) => formatTimeRange(start, end),
  
  // For dashboard (lowercase)
  dashboard: (time: string) => toDashboardTimeString(time),
  
  // For current time
  now: () => getCurrentLocalTimeString()
};

export default {
  basicTimeFormatting,
  timeRangeFormatting,
  currentTimeExamples,
  practicalUsageExamples,
  componentIntegrationExamples,
  usageSummary
};
