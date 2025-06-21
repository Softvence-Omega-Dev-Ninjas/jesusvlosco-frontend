import { ChevronDown } from "lucide-react";
import React from "react";

// Assuming these interfaces are defined in a shared types file or available globally
interface TimesheetEntry {
  id: number;
  date: string;
  project: string;
  start: string;
  end: string;
  totalHours: string;
  dailyTotal: string;
  weeklyTotal: string;
  regular: string;
  overtime1_5: string;
  notes: string;
}

interface WeeklyTimesheetGroup {
  weekRange: string;
  entries: TimesheetEntry[];
}

interface TimesheetTableProps {
  weeklyEntries: WeeklyTimesheetGroup[];
}

const TimesheetTable: React.FC<TimesheetTableProps> = ({ weeklyEntries }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full ">
        <thead className="bg-gray-50"> {/* Added a light background to the table header */}
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Project
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Start
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              End
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Total Hours
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Daily Total
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Weekly Total
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Regular
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Overtime x1.5
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Notes
            </th>
          </tr>
        </thead>
        <tbody className="bg-white ">
          {weeklyEntries.map((weekGroup) => (
            <React.Fragment key={weekGroup.weekRange}>
              {/* Changed bg-primary to bg-indigo-600 and added text-white */}
              <tr className="bg-primary text-white">
                <td colSpan={10} className=" py-2 text-md font-semibold text-center">
                  {weekGroup.weekRange}
                </td>
              </tr>
              {weekGroup.entries.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {entry.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {entry.project === "Select" ? (
                      <button className="px-3 py-1 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700 flex items-center gap-1 hover:bg-gray-200">
                        Select <ChevronDown size={14} />
                      </button>
                    ) : (
                      <span className="text-sm  text-green-500">
                        {entry.project}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.start}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.end}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.totalHours}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.dailyTotal}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.weeklyTotal}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.regular}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.overtime1_5}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary cursor-pointer hover:underline">
                    {entry.notes}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimesheetTable;