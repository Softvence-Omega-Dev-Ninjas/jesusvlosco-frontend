// src/Layout/UserLayout/UserOffDetails.tsx
// REMOVED: import AddShiftFormModal from "@/components/UserDetails/AddShiftFormModal";
import TimesheetHeader from "@/components/UserDetails/TimesheetHeader";
import TimesheetSummary from "@/components/UserDetails/TimesheetSummary";
import TimesheetTable from "@/components/UserDetails/TimesheetTable";

import React, { useState } from "react";

// --- Backdrop Component (As you prefer - transparent or dimming) ---
interface BackdropProps {
  onClick: () => void;
}

const Backdrop: React.FC<BackdropProps> = ({ onClick }) => {
  return (
    <div
      className="fixed inset-0  bg-opacity-50 z-30" // Your current preference for transparent backdrop
      onClick={onClick}
    ></div>
  );
};

// --- Interfaces ---
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
  id: string; // ADDED: A unique ID for each weekly group
  weekRange: string;
  entries: TimesheetEntry[];
}

const UserOffDetails: React.FC = () => {
  // State for the "Add" dropdown modal (within TimesheetHeader)
  const [showAddOptions, setShowAddOptions] = useState(false);
  // REMOVED: const [showAddShiftForm, setShowAddShiftForm] = useState(false);

  // This function is passed to TimesheetHeader to control the dropdown
  const toggleAddOptions = () => {
    setShowAddOptions((prev) => !prev);
  };

  
  const isOverlayActive = showAddOptions; // || showAddShiftForm; // Removed showAddShiftForm

  // Mock data (with ADDED unique IDs for each weekly group) - UNCHANGED
  const timesheetData: WeeklyTimesheetGroup[] = [
    {
      id: "week-jun30", // Unique ID
      weekRange: "Jun 30",
      entries: [
        {
          id: 1,
          date: "Mon 30/6",
          project: "Select",
          start: "8:00 AM",
          end: "1:00 AM",
          totalHours: "5 Hours",
          dailyTotal: "10 Hours",
          weeklyTotal: "--",
          regular: "--",
          overtime1_5: "--",
          notes: "View Notes",
        },
        {
          id: 2,
          date: "Mon 30/6",
          project: "Select",
          start: "2:00 AM",
          end: "6:00 AM",
          totalHours: "4 Hours",
          dailyTotal: "10 Hours",
          weeklyTotal: "--",
          regular: "--",
          overtime1_5: "--",
          notes: "View Notes",
        },
      ],
    },
    {
      id: "week-jun23-29", // Unique ID
      weekRange: "Jun 23-Jun 29",
      entries: [
        {
          id: 3,
          date: "Sun 29/6",
          project: "Select",
          start: "8:00 AM",
          end: "6:00 AM",
          totalHours: "10 Hours",
          dailyTotal: "9 Hours",
          weeklyTotal: "--",
          regular: "--",
          overtime1_5: "--",
          notes: "View Notes",
        },
        {
          id: 4,
          date: "Sat 28/6",
          project: "Select",
          start: "8:00 AM",
          end: "6:00 AM",
          totalHours: "10 Hours",
          dailyTotal: "9 Hours",
          weeklyTotal: "--",
          regular: "--",
          overtime1_5: "--",
          notes: "View Notes",
        },
        {
          id: 5,
          date: "Fri 27/6",
          project: "Select",
          start: "8:00 AM",
          end: "6:00 AM",
          totalHours: "10 Hours",
          dailyTotal: "9 Hours",
          weeklyTotal: "--",
          regular: "--",
          overtime1_5: "--",
          notes: "View Notes",
        },
        {
          id: 6,
          date: "Thu 26/6",
          project: "Select",
          start: "8:00 AM",
          end: "6:00 AM",
          totalHours: "10 Hours",
          dailyTotal: "9 Hours",
          weeklyTotal: "08:03",
          regular: "--",
          overtime1_5: "--",
          notes: "View Notes",
        },
        {
          id: 7,
          date: "Wed 25/6",
          project: "Select",
          start: "8:00 AM",
          end: "6:00 AM",
          totalHours: "10 Hours",
          dailyTotal: "9 Hours",
          weeklyTotal: "--",
          regular: "--",
          overtime1_5: "--",
          notes: "View Notes",
        },
        {
          id: 8,
          date: "Tue 24/6",
          project: "Select",
          start: "8:00 AM",
          end: "6:00 AM",
          totalHours: "10 Hours",
          dailyTotal: "9 Hours",
          weeklyTotal: "--",
          regular: "--",
          overtime1_5: "--",
          notes: "View Notes",
        },
        {
          id: 9,
          date: "Mon 23/6",
          project: "Select",
          start: "8:00 AM",
          end: "6:00 AM",
          totalHours: "10 Hours",
          dailyTotal: "9 Hours",
          weeklyTotal: "--",
          regular: "--",
          overtime1_5: "--",
          notes: "View Notes",
        },
      ],
    },
    {
      id: "week-jun16-22", // Unique ID
      weekRange: "Jun 16-Jun 22",
      entries: [
        {
          id: 10,
          date: "Sun 22/6",
          project: "Select",
          start: "8:00 AM",
          end: "6:00 AM",
          totalHours: "10 Hours",
          dailyTotal: "9 Hours",
          weeklyTotal: "--",
          regular: "--",
          overtime1_5: "--",
          notes: "View Notes",
        },
        {
          id: 11,
          date: "Sat 21/6",
          project: "Select",
          start: "8:00 AM",
          end: "6:00 AM",
          totalHours: "10 Hours",
          dailyTotal: "9 Hours",
          weeklyTotal: "--",
          regular: "--",
          overtime1_5: "--",
          notes: "View Notes",
        },
        {
          id: 12,
          date: "Fri 20/6",
          project: "Select",
          start: "8:00 AM",
          end: "6:00 AM",
          totalHours: "10 Hours",
          dailyTotal: "9 Hours",
          weeklyTotal: "--",
          regular: "--",
          overtime1_5: "--",
          notes: "View Notes",
        },
        {
          id: 13,
          date: "Thu 19/6",
          project: "Select",
          start: "8:00 AM",
          end: "6:00 AM",
          totalHours: "10 Hours",
          dailyTotal: "9 Hours",
          weeklyTotal: "08:03",
          regular: "--",
          overtime1_5: "--",
          notes: "View Notes",
        },
        {
          id: 14,
          date: "Wed 18/6",
          project: "Select",
          start: "8:00 AM",
          end: "6:00 AM",
          totalHours: "10 Hours",
          dailyTotal: "9 Hours",
          weeklyTotal: "--",
          regular: "--",
          overtime1_5: "--",
          notes: "View Notes",
        },
        {
          id: 15,
          date: "Tue 17/6",
          project: "Select",
          start: "8:00 AM",
          end: "6:00 AM",
          totalHours: "10 Hours",
          dailyTotal: "9 Hours",
          weeklyTotal: "--",
          regular: "--",
          overtime1_5: "--",
          notes: "View Notes",
        },
        {
          id: 16,
          date: "Mon 16/6",
          project: "Select",
          start: "8:00 AM",
          end: "6:00 AM",
          totalHours: "10 Hours",
          dailyTotal: "9 Hours",
          weeklyTotal: "--",
          regular: "--",
          overtime1_5: "--",
          notes: "View Notes",
        },
      ],
    },
    {
      id: "week-jun9-22", // Unique ID
      weekRange: "Jun 9-Jun 22",
      entries: [
        {
          id: 21,
          date: "Sun 22/6",
          project: "sick leave",
          start: "--",
          end: "--",
          totalHours: "08:00 ",
          dailyTotal: "--",
          weeklyTotal: "--",
          regular: "--",
          overtime1_5: "--",
          notes: "View Notes",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen relative">
      {isOverlayActive && (
        <Backdrop
          onClick={() => {
            // MODIFIED: Only close showAddOptions if it's active
            if (showAddOptions) {
              toggleAddOptions();
            }
          }}
        />
      )}

      <div
        className={`shadow ${isOverlayActive ? "opacity-50  pointer-events-none" : ""}`}
        style={{ transition: "opacity 0.3s  ease-in-out" }}
      >
        {/* MODIFIED: Removed onOpenAddShiftForm prop */}
        <TimesheetHeader />
        <TimesheetSummary />
        <TimesheetTable weeklyEntries={timesheetData} />
      </div>

      {/* REMOVED: AddShiftFormModal component */}
      {/* {showAddShiftForm && <AddShiftFormModal onClose={handleCloseAddShiftForm} />} */}
    </div>
  );
};

export default UserOffDetails;