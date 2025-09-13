import { LocationPinIcon } from "@/components/TimeSheets/Icons";
import { TimeSheetEntry } from "@/pages/TimeSheets";

interface Props {
  filteredTimeSheetData: TimeSheetEntry[];
  formatTime: (timeString: string) => string;
}

const TimeSheetsTable: React.FC<Props> = ({
  filteredTimeSheetData,
  formatTime,
}) => {
  // Group entries by user
  const entriesByUser = filteredTimeSheetData.reduce<
    Record<string, TimeSheetEntry[]>
  >((acc, entry) => {
    const userId = entry.user?.id || "unknown";
    if (!acc[userId]) acc[userId] = [];
    acc[userId].push(entry);
    return acc;
  }, {});

  // Sort each user's entries by clockIn descending (latest first)
  Object.keys(entriesByUser).forEach((userId) => {
    entriesByUser[userId].sort(
      (a, b) => b.clockIn?.localeCompare(a.clockIn || "") || 0
    );
  });

  // Split into latest and previous
  const latestEntries: TimeSheetEntry[] = [];
  const previousEntries: TimeSheetEntry[] = [];

  Object.values(entriesByUser).forEach((userEntries) => {
    if (userEntries.length > 0) {
      latestEntries.push(userEntries[0]); // Latest clock-in
      if (userEntries.length > 1) previousEntries.push(...userEntries.slice(1)); // The rest
    }
  });

  const renderTableRows = (data: TimeSheetEntry[]) =>
    data.map((entry, index) => {
      const userName = entry?.user?.name || "Unknown User";
      const profileUrl =
        entry?.user?.profileUrl ||
        "https://randomuser.me/api/portraits/men/77.jpg";
      const shiftTitle = entry?.shift?.title || "No Shift Assigned";
      const shiftLocation = entry?.shift?.location || "No Location";
      const rowKey = entry.id || `${entry.user?.id}-${index}`;

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
    });

  return (
    <section className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-6">
      <div className="overflow-x-auto">
        <h3 className="px-6 py-3 text-gray-700 text-lg border-y border-gray-200 font-semibold py-4 text-center">
          Latest Clock-ins
        </h3>
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
            {latestEntries.length ? (
              renderTableRows(latestEntries)
            ) : (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                  No latest clock-in data found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <h3 className="px-6 py-3 text-gray-700 text-lg border-y border-gray-200 font-semibold py-4 text-center">
          Previous Clock-ins
        </h3>
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
            {previousEntries.length ? (
              renderTableRows(previousEntries)
            ) : (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                  No previous clock-in data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TimeSheetsTable;
