import { useState } from "react";
import { useGetTimeSheetByTimeRangePerUserQuery } from "@/store/api/admin/time-clock/timeClockApi";
import { DateTime } from "luxon";
import { userDefaultTimeZone } from "@/utils/dateUtils";
import { toast } from "sonner";

const ExportSectionPerUser = () => {
  const [range, setRange] = useState({ start: "", end: "" });
  const [loading, setLoading] = useState(false);
  const timezone = userDefaultTimeZone();
  const [userId, setUserId] = useState<string>("");

  const convertToISO = (
    dateString: string,
    isStart: boolean = true
  ): string => {
    if (!dateString) {
      return "";
    }
    try {
      const date = DateTime.fromISO(dateString, { zone: timezone });
      // console.log("convertToISO: parsed date:", date.toString());
      if (isStart) {
        const result = date.startOf("day").toUTC().toISO() || "";
        // console.log("convertToISO: start result:", result);
        return result;
      } else {
        const result = date.endOf("day").toUTC().toISO() || "";
        // console.log("convertToISO: end result:", result);
        return result;
      }
    } catch (error) {
      console.error("convertToISO error:", error);
      return "";
    }
  };

  // Convert ISO string back to date input format for display
  const convertFromISO = (isoString: string): string => {
    if (!isoString) return "";
    return DateTime.fromISO(isoString).toISODate() || "";
  };

  const start = range.start ? range.start : "";
  const end = range.end ? range.end : "";
  const { data: timeSheetData, isLoading } =
    useGetTimeSheetByTimeRangePerUserQuery(
      {
        from: start,
        to: end,
        userId,
        timezone,
      },
      {
        skip: !range.start || !range.end, // Skip query when dates are empty
      }
    );

  console.log(timeSheetData, "timesheetData");
  // Quick range selection
  const setQuickRange = (
    type: "thisWeek" | "lastWeek" | "thisMonth" | "lastMonth"
  ) => {
    const now = DateTime.now().setZone(timezone);

    let start: DateTime;
    let end: DateTime;

    switch (type) {
      case "thisWeek":
        start = now.startOf("week");
        end = now.endOf("week");
        break;
      case "lastWeek":
        start = now.minus({ weeks: 1 }).startOf("week");
        end = now.minus({ weeks: 1 }).endOf("week");
        break;
      case "thisMonth":
        start = now.startOf("month");
        end = now.endOf("month");
        break;
      case "lastMonth":
        start = now.minus({ months: 1 }).startOf("month");
        end = now.minus({ months: 1 }).endOf("month");
        break;
    }

    setRange({
      start: start.startOf("day").toUTC().toISO() || "",
      end: end.endOf("day").toUTC().toISO() || "",
    });
  };

  const handleExport = async () => {
    if (!range.start || !range.end) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (!userId) {
      toast.error("Please select a user");
      return;
    }

    try {
      setLoading(true);

      // // Use the data from the query hook directly
      // const timeSheetEntries: TimeSheetEntry[] = timeSheetData?.data || [];

      // // Format dates for display in PDF
      // const displayRange = {
      //   start: convertFromISO(range.start),
      //   end: convertFromISO(range.end),
      // };
    } catch (error) {
      setLoading(false);
      console.error("Export failed:", error);
      toast.error("Failed to export timesheet data");
    }
  };

  return (
    <section className="bg-white border border-gray-200 rounded-lg p-6 mb-8 mt-4 flex flex-col sm:flex-row justify-between">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Export Timesheets as PDF Per User
        </h3>
        <div className="text-xs text-gray-500 mt-2">
          Select a week or month range (in your timezone: {timezone}) or pick
          custom dates.
        </div>
      </div>
      <div>
        <div className="flex flex-col sm:flex-row items-end gap-4">
          {/* Manual dates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              className="border border-gray-300 rounded px-3 py-2"
              value={convertFromISO(range.start)}
              onChange={(e) => {
                console.log("Start date changed:", e.target.value);
                const converted = convertToISO(e.target.value, true);
                console.log("Start date converted:", converted);
                setRange((r) => ({ ...r, start: converted }));
              }}
              max={convertFromISO(range.end) || undefined}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              className="border border-gray-300 rounded px-3 py-2"
              value={convertFromISO(range.end)}
              onChange={(e) => {
                console.log("End date changed:", e.target.value);
                const converted = convertToISO(e.target.value, false);
                console.log("End date converted:", converted);
                setRange((r) => ({ ...r, end: converted }));
              }}
              min={convertFromISO(range.start) || undefined}
              // max={DateTime.now().toISODate()!}
            />
          </div>

          <button
            onClick={handleExport}
            disabled={!range.start || !range.end || isLoading || loading}
            className="bg-green-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-60"
          >
            {loading ? "Exporting..." : "Export PDF"}
          </button>
        </div>

        {/* Quick ranges */}
        <div className="flex gap-2 justify-end mt-4">
          <button
            onClick={() => setQuickRange("thisWeek")}
            className="text-xs bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
          >
            This Week
          </button>
          <button
            onClick={() => setQuickRange("lastWeek")}
            className="text-xs bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
          >
            Last Week
          </button>
          <button
            onClick={() => setQuickRange("thisMonth")}
            className="text-xs bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
          >
            This Month
          </button>
          <button
            onClick={() => setQuickRange("lastMonth")}
            className="text-xs bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
          >
            Last Month
          </button>
        </div>
      </div>
    </section>
  );
};

export default ExportSectionPerUser;
