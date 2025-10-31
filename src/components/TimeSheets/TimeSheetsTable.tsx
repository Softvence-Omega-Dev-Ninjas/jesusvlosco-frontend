import { useState } from "react";
import { TimeSheetEntry } from "@/pages/TimeSheets";
import { useDeleteTimeClockAdminMutation } from "@/store/api/admin/time-clock/timeClockApi";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import Swal from "sweetalert2";
import UpdateTimeClockModal from "./UpdateTimeClockModal";

interface Props {
  filteredTimeSheetData: TimeSheetEntry[];
  formatTime: (timeString: string) => string;
}

const TimeSheetsTable: React.FC<Props> = ({
  filteredTimeSheetData,
  formatTime,
}) => {
  const [deleteTimeClockAdmin] = useDeleteTimeClockAdminMutation();

  // modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<TimeSheetEntry | null>(
    null
  );

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

  const handleEdit = (entry: TimeSheetEntry) => {
    setSelectedEntry(entry);
    setIsEditOpen(true);
  };

  const onModalClose = () => {
    setIsEditOpen(false);
    setSelectedEntry(null);
  };

  const handleDelete = async (entry: TimeSheetEntry) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteTimeClockAdmin(entry.id).unwrap();
        Swal.fire(
          "Deleted!",
          "The time sheet entry has been deleted.",
          "success"
        );
      } catch (error) {
        console.error("Error deleting time sheet entry:", error);
        Swal.fire(
          "Error!",
          "There was an error deleting the time sheet entry.",
          "error"
        );
      }
    }
  };

  const renderTableRows = (data: TimeSheetEntry[]) =>
    data.map((entry, index) => {
      const userName = entry?.user?.name || "Unknown User";
      const profileUrl =
        entry?.user?.profileUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}`;
      const shiftTitle = entry?.shift?.title || "No Shift Assigned";
      const shiftLocation = entry?.shift?.location || "No Location";
      const rowKey = entry.id || `${entry.user?.id}-${index}`;

      return (
        <tr key={rowKey} className="hover:bg-gray-50">
          <td className="px-3 py-4 whitespace-nowrap">
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
          <td className="px-3 py-4 space-y-2 max-w-[250px]">
            <div className="text-sm font-semibold text-gray-900 break-words">
              {shiftTitle}
            </div>
            <div className="text-sm text-gray-500 flex items-start gap-1">
              <IoLocationOutline className=" text-blue-700 flex-shrink-0 mt-1" />
              <p className="break-words">{shiftLocation}</p>
            </div>
          </td>
          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
            {formatTime(entry.clockIn || "")}
          </td>
          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
            {formatTime(entry.clockOut || "")}
          </td>
          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
            {entry.regularHours || "0"} hours
          </td>
          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
            {entry.overtimeHours || "0"} hours
          </td>
          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
            {entry.totalHours || "0"} hours
          </td>
          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
            ${parseFloat(entry.regularPayment || "0").toFixed(2)}
          </td>
          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
            ${parseFloat(entry.regularPayment || "0").toFixed(2)}
          </td>
          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
            ${parseFloat(entry.totalPayment || "0").toFixed(2)}
          </td>
          <td className="px-3 py-4 whitespace-nowrap  text-xl text-gray-500">
            <div className="flex items-center gap-5 justify-center">
              <FaEdit
                onClick={() => handleEdit(entry)}
                className="text-blue-500 hover:text-blue-700 cursor-pointer"
              />
              <FaTrashAlt
                onClick={() => handleDelete(entry)}
                className="text-red-500 hover:text-red-700 cursor-pointer"
              />
            </div>
          </td>
        </tr>
      );
    });

  return (
    <section className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-6">
      <UpdateTimeClockModal
        isOpen={isEditOpen}
        onClose={onModalClose}
        entry={selectedEntry}
      />

      <div className="overflow-x-auto">
        <h3 className="px-6 text-gray-700 text-lg border-y border-gray-200 font-semibold py-4 text-center">
          Latest Clock-ins
        </h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white text-black">
            <tr>
              <th className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider ">
                Name
              </th>
              <th className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider max-w-[250px]">
                Shift
              </th>
              <th className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider ">
                Clock In
              </th>
              <th className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider ">
                Clock Out
              </th>
              <th className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider ">
                Regular
              </th>
              <th className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider ">
                Overtime
              </th>
              <th className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider ">
                Total Hours
              </th>
              <th className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider ">
                Reg Pay
              </th>
              <th className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider ">
                Over Pay
              </th>
              <th className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider ">
                Total Pay
              </th>
              <th className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider ">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {latestEntries.length ? (
              renderTableRows(latestEntries)
            ) : (
              <tr>
                <td
                  colSpan={10}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No latest clock-in data found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <h3 className="px-6  text-gray-700 text-lg border-y border-gray-200 font-semibold py-4 text-center">
          Previous Clock-ins
        </h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider ">
                Name
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider max-w-[250px]">
                Shift
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Clock In
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Clock Out
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Regular
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Overtime
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Total Hours
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Reg Pay
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Over Pay
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Total Pay
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {previousEntries.length ? (
              renderTableRows(previousEntries)
            ) : (
              <tr>
                <td
                  colSpan={10}
                  className="px-6 py-8 text-center text-gray-500"
                >
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
