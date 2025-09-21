import { useState, useRef } from "react";
import {
  useGetAllTimeClockAdminQuery,
  useGetAllTimeSheetAdminQuery,
} from "@/store/api/admin/time-clock/timeClockApi";
import PendingRequestModal from "@/components/TimeSheets/PendingRequestModal";
import TimeSheetsHeader from "@/components/TimeSheets/TimeSheetsHeader";
import {
  formatTime,
  getUniqueUserLocations,
  processTimeSheetData,
} from "@/components/TimeSheets/timeSheetsUtils";
import TimeSheetsTable from "@/components/TimeSheets/TimeSheetsTable";
import TimeSheetsMap from "@/components/TimeSheets/TimeSheetsMap";
import ExportSection from "@/components/TimeSheets/ExportSection";

export interface TimeSheetEntry {
  id?: string;
  user: {
    id: string;
    name: string;
    email: string;
    profileUrl?: string;
  };
  shift: {
    title: string;
    location: string;
  } | null;
  clockIn: string;
  clockOut: string;
  clockInLng: number;
  clockInLat: number;
  location: string;
  totalHours: string;
  regularHours: string;
  overTime: string;
  regularPayment: string;
  overTimePayment: string;
  totalPayment: string;
}

export default function TimeSheets() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const mapRef = useRef<L.Map | null>(null);

  const { data } = useGetAllTimeClockAdminQuery(null);
  const pendingTimeClockRequest = data?.data?.filter(
    (el: { shiftStatus: string }) => el.shiftStatus === "DRAFT"
  );

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toLocaleDateString('en-CA')
  );

  const { data: timeSheetData } = useGetAllTimeSheetAdminQuery({
    date: processTimeSheetData.formatDateForAPI(selectedDate, userTimezone),
    timezone: userTimezone,
  });
  const timeSheetEntries: TimeSheetEntry[] = timeSheetData?.data || [];
  const filteredTimeSheetData = processTimeSheetData.filterEntries(
    timeSheetEntries,
    searchQuery
  );
  const uniqueUserLocations = getUniqueUserLocations(filteredTimeSheetData);
  return (
    <div
      className={`py-4 bg-gray-50 min-h-screen ${
        isModalOpen ? "overflow-hidden" : ""
      }`}
    >
      <div
        className={`${
          isModalOpen ? "opacity-50 pointer-events-none" : ""
        } transition-all duration-300`}
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Time Clock</h2>
        <ExportSection search={searchQuery} timezone={userTimezone} />
        <TimeSheetsHeader
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onExport={() =>
            processTimeSheetData.exportToPDF(
              timeSheetEntries,
              searchQuery,
              selectedDate,
              uniqueUserLocations
            )
          }
          pendingCount={pendingTimeClockRequest?.length || 0}
          onPendingClick={() => setIsModalOpen(true)}
        />
        <TimeSheetsTable
          filteredTimeSheetData={filteredTimeSheetData}
          formatTime={formatTime}
        />
        <TimeSheetsMap
          uniqueUserLocations={uniqueUserLocations}
          mapRef={mapRef}
          formatTime={formatTime}
        />
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center ">
          <PendingRequestModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            activityData={pendingTimeClockRequest}
          />
        </div>
      )}
    </div>
  );
}
