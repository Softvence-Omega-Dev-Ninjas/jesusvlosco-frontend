import { LocationPinIcon } from "@/components/TimeSheets/Icons";
import { TimeSheetEntry } from "@/pages/TimeSheets";

interface Props {
  filteredTimeSheetData: TimeSheetEntry[];
  formatTime: (timeString: string) => string;
}

const TimeSheetsTable: React.FC<Props> = ({
  filteredTimeSheetData,
  formatTime,
}) => (
  <section className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-6">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white">
          <tr>
            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[150px]">
              Name
            </th>
            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[200px]">
              Shift
            </th>
            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Clock In
            </th>
            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Clock Out
            </th>
            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Total Hours
            </th>
            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Regular
            </th>
            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Total Overtime
            </th>
            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Paid Time-off
            </th>
            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[150px]">
              Regular Payment
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredTimeSheetData.length > 0 ? (
            filteredTimeSheetData.map((entry, index) => {
              const userName = entry?.user?.name || "Unknown User";
              const profileUrl =
                entry?.user?.profileUrl ||
                "https://randomuser.me/api/portraits/men/77.jpg";
              const shiftTitle = entry?.shift?.title || "No Shift Assigned";
              const shiftLocation = entry?.shift?.location || "No Location";
              const rowKey = entry.id || `${entry.user.id}-${index}`;
              return (
                <tr key={rowKey} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={profileUrl}
                          alt={userName}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {userName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{shiftTitle}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <LocationPinIcon className="w-4 h-4 mr-1" />
                      {shiftLocation}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTime(entry.clockIn || "")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTime(entry.clockOut || "")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.totalHours || "0"} hours
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.regularHours || "0"} hours
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.overTime || "0"} hours
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    N/A
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${parseFloat(entry.regularPayment || "0").toFixed(2)}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                <div className="flex flex-col items-center">
                  <div className="text-lg font-medium mb-2">
                    No timesheet data found
                  </div>
                  <div className="text-sm">
                    Please select a different date or check if there are any
                    entries for the selected period.
                  </div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </section>
);

export default TimeSheetsTable;
