import { useState } from "react";
import { processTimeSheetData } from "@/components/TimeSheets/timeSheetsUtils";
import { TimeSheetEntry } from "@/pages/TimeSheets";
import { useLazyGetAllTimeSheetAdminQuery } from "@/store/api/admin/time-clock/timeClockApi";

interface ExportSectionProps {
  timezone: string;
}

function getDatesInRange(start: string, end: string): string[] {
  const dates: string[] = [];
  let current = new Date(start);
  const last = new Date(end);
  while (current <= last) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

const ExportSection: React.FC<ExportSectionProps> = ({ timezone }) => {
  const [range, setRange] = useState({ start: "", end: "" });
  const [loading, setLoading] = useState(false);

  // Lazy query hook
  const [fetchTimeSheet] = useLazyGetAllTimeSheetAdminQuery();

  const handleExport = async () => {
    if (!range.start || !range.end) return;
    setLoading(true);

    const dates = getDatesInRange(range.start, range.end);
    let allEntries: TimeSheetEntry[] = [];

    // Fetch all dates in parallel
    const results = await Promise.all(
      dates.map((date) =>
        fetchTimeSheet({
          date: processTimeSheetData.formatDateForAPI(date),
          timezone,
        }).unwrap()
      )
    );

    // Collect results
    results.forEach((res) => {
      const timeSheetEntries: TimeSheetEntry[] = res?.data || [];
      allEntries = allEntries.concat(timeSheetEntries);
    });

    console.log("allEntries", allEntries);

    // Export all entries
    processTimeSheetData.exportToPDF(
      allEntries,
      "",
      `${range.start}-${range.end}`,
      []
    );

    setLoading(false);
  };

  return (
    <section className="bg-white border border-gray-200 rounded-lg p-6 mb-8 mt-4 flex flex-col sm:flex-row justify-between">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Export Timesheets
        </h3>
        <div className="text-xs text-gray-500 mt-2">
          Select a week or month range to export all timesheets as PDF.
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-end gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            className="border border-gray-300 rounded px-3 py-2"
            value={range.start}
            onChange={(e) => setRange((r) => ({ ...r, start: e.target.value }))}
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
            max={new Date().toISOString().split("T")[0]}
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
    </section>
  );
};

export default ExportSection;
