import { useState } from "react";
import { processTimeSheetData } from "@/components/TimeSheets/timeSheetsUtils";
import { TimeSheetEntry } from "@/pages/TimeSheets";
import { useLazyGetAllTimeSheetAdminQuery } from "@/store/api/admin/time-clock/timeClockApi";
import { exportDateRangeToPDF } from "./exportSheet";
import { DateTime } from "luxon";

interface ExportSectionProps {
  timezone: string;
}

function getDatesInRange(start: string, end: string): string[] {
  const dates: string[] = [];
  let current = DateTime.fromISO(start);
  const last = DateTime.fromISO(end);

  while (current <= last) {
    dates.push(current.toISODate()!);
    current = current.plus({ days: 1 });
  }
  return dates;
}

const ExportSection: React.FC<ExportSectionProps> = ({ timezone }) => {
  const [range, setRange] = useState({ start: "", end: "" });
  const [loading, setLoading] = useState(false);

  const [fetchTimeSheet] = useLazyGetAllTimeSheetAdminQuery();

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
      start: start.toISODate()!,
      end: end.toISODate()!,
    });
  };

  const handleExport = async () => {
    if (!range.start || !range.end) return;
    setLoading(true);

    const dates = getDatesInRange(range.start, range.end);
    let allEntries: TimeSheetEntry[] = [];

    const results = await Promise.all(
      dates.map((date) =>
        fetchTimeSheet({
          date: processTimeSheetData.formatDateForAPI(date),
          timezone,
        }).unwrap()
      )
    );

    results.forEach((res) => {
      const timeSheetEntries: TimeSheetEntry[] = res?.data || [];
      allEntries = allEntries.concat(timeSheetEntries);
    });

    exportDateRangeToPDF(allEntries, range);
    setLoading(false);
  };

  return (
    <section className="bg-white border border-gray-200 rounded-lg p-6 mb-8 mt-4 flex flex-col sm:flex-row justify-between">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Export Timesheets
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
              value={range.start}
              onChange={(e) =>
                setRange((r) => ({ ...r, start: e.target.value }))
              }
              max={range.end || undefined}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              className="border border-gray-300 rounded px-3 py-2"
              value={range.end}
              onChange={(e) => setRange((r) => ({ ...r, end: e.target.value }))}
              min={range.start || undefined}
              max={DateTime.now().toISODate()!}
            />
          </div>

          <button
            onClick={handleExport}
            disabled={!range.start || !range.end || loading}
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

export default ExportSection;
