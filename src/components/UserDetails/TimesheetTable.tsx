import { ChevronDown } from "lucide-react";
import React, { useState } from "react"; // Import useState

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
  notes: string; // Ensure this is part of the interface
}

interface WeeklyTimesheetGroup {
  weekRange: string;
  entries: TimesheetEntry[];
}

interface TimesheetTableProps {
  weeklyEntries: WeeklyTimesheetGroup[];
}

// --- Note Modal Component ---
interface NoteModalProps {
  noteContent: string | null;
  onClose: () => void;
}

const NoteModal: React.FC<NoteModalProps> = ({ noteContent, onClose }) => {
  if (!noteContent) return null; // Don't render if no content

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 ">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-opacity-50 " onClick={onClose}></div>

      {/* Modal content */}
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm -right-1/4 relative z-50 mx-4">
        <h3 className=" text-xl mb-4">Manager Notes: <span>
          I need 1 day leave</span></h3>
        <p className="py-2 text-gray-700">Employee Notes: <span>Okay</span></p>
        {/* <div className="modal-action mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div> */}
      </div>
    </div>
  );
};


const TimesheetTable: React.FC<TimesheetTableProps> = ({ weeklyEntries }) => {
  const [currentNote, setCurrentNote] = useState<string | null>(null);

  const openNoteModal = (note: string) => {
    setCurrentNote(note);
  };

  const closeNoteModal = () => {
    setCurrentNote(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full ">
        <thead className="bg-gray-50">
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
              <tr className="bg-primary text-white"> {/* Assuming bg-primary is defined or use bg-indigo-600 */}
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
                    {/* Use a regular button and onClick to open the modal */}
                    <button
                      onClick={() => openNoteModal(entry.notes)}
                      className="text-indigo-600 hover:text-indigo-800" // Use a proper text color for links/buttons
                    >
                      {entry.notes ? "View Notes" : "Add Notes"}
                    </button>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Render the NoteModal conditionally based on currentNote state */}
      <NoteModal noteContent={currentNote} onClose={closeNoteModal} />
    </div>
  );
};

export default TimesheetTable;