import React, { useCallback, useMemo, useState } from "react";
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

// Small reusable empty state
const EmptyState: React.FC<{ message?: string }> = ({
  message = "No data available",
}) => (
  <tr>
    <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
      {message}
    </td>
  </tr>
);

// Table header — reused for both latest & previous tables
const TableHeader: React.FC<{ compact?: boolean }> = () => (
  <thead className="bg-white">
    <tr>
      <th className="px-3 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
        Name
      </th>
      <th className="px-3 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider max-w-[250px]">
        Shift
      </th>
      <th className="px-3 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
        Clock In
      </th>
      <th className="px-3 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
        Clock Out
      </th>
      <th className="px-3 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
        Regular
      </th>
      <th className="px-3 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
        Overtime
      </th>
      <th className="px-3 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
        Total Hours
      </th>
      <th className="px-3 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
        Payment
      </th>
      <th className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider">
        Actions
      </th>
    </tr>
  </thead>
);

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

  // memoized grouping and sorting
  const { latestEntries, previousEntries } = useMemo(() => {
    const byUser = filteredTimeSheetData.reduce<
      Record<string, TimeSheetEntry[]>
    >((acc, entry) => {
      const id = entry.user?.id ?? "unknown";
      if (!acc[id]) acc[id] = [];
      acc[id].push(entry);
      return acc;
    }, {});

    // sort each user's entries by clockIn desc
    Object.values(byUser).forEach((arr) =>
      arr.sort((a, b) => (b.clockIn ?? "").localeCompare(a.clockIn ?? ""))
    );

    const latest: TimeSheetEntry[] = [];
    const prev: TimeSheetEntry[] = [];

    Object.values(byUser).forEach((arr) => {
      if (arr.length) latest.push(arr[0]);
      if (arr.length > 1) prev.push(...arr.slice(1));
    });

    return { latestEntries: latest, previousEntries: prev };
  }, [filteredTimeSheetData]);

  const openEditModal = useCallback((entry: TimeSheetEntry) => {
    setSelectedEntry(entry);
    setIsEditOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsEditOpen(false);
    setSelectedEntry(null);
  }, []);

  const confirmAndDelete = useCallback(
    async (entry: TimeSheetEntry) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (!result.isConfirmed) return;

      try {
        await deleteTimeClockAdmin(entry.id).unwrap();
        await Swal.fire(
          "Deleted!",
          "The time sheet entry has been deleted.",
          "success"
        );
      } catch (err) {
        console.error("Delete error:", err);
        await Swal.fire(
          "Error!",
          "There was an error deleting the time sheet entry.",
          "error"
        );
      }
    },
    [deleteTimeClockAdmin]
  );

  // row renderer extracted for reuse
  const renderRow = useCallback(
    (entry: TimeSheetEntry, idx: number) => {
      const userName = entry?.user?.name ?? "Unknown User";
      const profileUrl =
        entry?.user?.profileUrl ??
        `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}`;
      const shiftTitle = entry?.shift?.title ?? "No Shift Assigned";
      const shiftLocation = entry?.shift?.location ?? "No Location";
      const rowKey = entry.id ?? `${entry.user?.id ?? "unknown"}-${idx}`;

      const formatHours = (val?: string | number) => `${val ?? 0} hours`;
      const formatPayment = (val?: string | number) =>
        `$${(parseFloat(String(val ?? 0)) || 0).toFixed(2)}`;

      return (
        <tr key={rowKey} className="hover:bg-gray-50">
          <td className="px-3 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10">
                <img
                  loading="lazy"
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
              <IoLocationOutline className="text-blue-700 flex-shrink-0 mt-1" />
              <p className="break-words">{shiftLocation}</p>
            </div>
          </td>

          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
            {formatTime(entry.clockIn ?? "")}
          </td>
          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
            {formatTime(entry.clockOut ?? "")}
          </td>
          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
            {formatHours(entry.regularHours)}
          </td>
          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
            {formatHours(entry.overtimeHours)}
          </td>
          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
            {formatHours(entry.totalHours)}
          </td>
          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
            {formatPayment(entry.totalPayment)}
          </td>

          <td className="px-3 py-4 whitespace-nowrap text-xl text-gray-500">
            <div className="flex items-center gap-5 justify-center">
              <button
                aria-label={`Edit ${userName} entry`}
                onClick={() => openEditModal(entry)}
              >
                <FaEdit className="text-blue-500 hover:text-blue-700 cursor-pointer" />
              </button>
              <button
                aria-label={`Delete ${userName} entry`}
                onClick={() => confirmAndDelete(entry)}
              >
                <FaTrashAlt className="text-red-500 hover:text-red-700 cursor-pointer" />
              </button>
            </div>
          </td>
        </tr>
      );
    },
    [formatTime, openEditModal, confirmAndDelete]
  );

  return (
    <section className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-6">
      <UpdateTimeClockModal
        isOpen={isEditOpen}
        onClose={closeModal}
        entry={selectedEntry}
      />

      <div className="overflow-x-auto">
        <h3 className="px-6 text-gray-700 text-lg border-y border-gray-200 font-semibold py-4 text-center">
          Latest Clock-ins
        </h3>
        <table className="min-w-full divide-y divide-gray-200">
          <TableHeader />
          <tbody className="bg-white divide-y divide-gray-200">
            {latestEntries.length ? (
              latestEntries.map((e, i) => renderRow(e, i))
            ) : (
              <EmptyState message="No latest clock-in data found" />
            )}
          </tbody>
        </table>

        <h3 className="px-6 text-gray-700 text-lg border-y border-gray-200 font-semibold py-4 text-center">
          Previous Clock-ins
        </h3>
        <table className="min-w-full divide-y divide-gray-200">
          <TableHeader />
          <tbody className="bg-white divide-y divide-gray-200">
            {previousEntries.length ? (
              previousEntries.map((e, i) => renderRow(e, i))
            ) : (
              <EmptyState message="No previous clock-in data found" />
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TimeSheetsTable;
