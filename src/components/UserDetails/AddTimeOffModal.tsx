// src/components/UserDetails/AddTimeOffModal.tsx
import React, { useState } from "react";
import { X, Calendar, ChevronDown } from "lucide-react";

// Import your avatar images
import robertFoxAvatar from "../../assets/user2.png";
import estherHowardAvatar from "../../assets/user.png";
import janeCooperAvatar from "../../assets/user.png"; // Make sure this path is correct
import UserDropdown, { UserOption } from "./UserDropdown";

interface AddTimeOffModalProps {
  onClose: () => void;
}

const AddTimeOffModal: React.FC<AddTimeOffModalProps> = ({ onClose }) => {
  // Initialize isAllDay to true to match the screenshot where it's on by default
  const [isAllDay, setIsAllDay] = useState(true);
  const [selectedUser, setSelectedUser] = useState("Esther Howard");
  const [timeOffType, setTimeOffType] = useState("Sick leave");

  // Define your user options with names and avatar paths
  const userOptions: UserOption[] = [
    { name: "Esther Howard", avatar: estherHowardAvatar },
    { name: "Jane Cooper", avatar: janeCooperAvatar },
    { name: "Robert Fox", avatar: robertFoxAvatar },
    { name: "Desirae Botosh", avatar: estherHowardAvatar }, // Placeholder
    { name: "Marley Stanton", avatar: estherHowardAvatar }, // Placeholder
    { name: "Kaylynn Stanton", avatar: estherHowardAvatar }, // Placeholder
    { name: "Brandon Vaccaro", avatar: estherHowardAvatar }, // Placeholder
  ];

  const timeOffTypes = [
    "Sick leave",
    "Vacation",
    "Personal leave",
    "Bereavement leave",
    "Jury Duty",
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>

      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative z-50 mx-4 sm:mx-0">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Add time off</h2>

        {/* Select User - Using UserDropdown component */}
        <div className="mb-4">
          <UserDropdown
            label="Select User"
            options={userOptions}
            initialValue={selectedUser}
            onSelect={setSelectedUser}
          />
        </div>

        {/* Time off type */}
        <div className="mb-4">
          <label htmlFor="time-off-type" className="block text-sm font-medium text-gray-700 mb-1">Time off type</label>
          <div className="relative">
            <select
              id="time-off-type"
              className="appearance-none w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
              value={timeOffType}
              onChange={(e) => setTimeOffType(e.target.value)}
            >
              {timeOffTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* All day time off toggle */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700">All day time off</span>
          <label htmlFor="all-day-toggle" className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="all-day-toggle"
              className="sr-only peer"
              checked={isAllDay}
              onChange={() => setIsAllDay(!isAllDay)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* Date and time of time off */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Date and time of time off</label>
          <div className="flex items-center space-x-2">
            {/* Date input with Calendar icon and dropdown chevron */}
            <div className="relative flex-grow">
              <input
                type="date"
                defaultValue="2025-06-19" // Date as per screenshot
                className="w-full p-2 pl-9 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              {/* This ChevronDown is for the date dropdown, as per the screenshot */}
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>

            {/* Conditional time inputs (not shown when isAllDay is true, as per screenshot) */}
            {!isAllDay && (
              <>
                <span className="text-gray-700">From:</span>
                <input
                  type="time"
                  defaultValue="12:00"
                  className="w-24 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <span className="text-gray-700">To:</span>
                <input
                  type="time"
                  defaultValue="12:00"
                  className="w-24 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </>
            )}
          </div>
        </div>

        {/* Total time off days */}
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md mb-4">
          <span className="text-sm font-medium text-gray-700">Total time off days</span>
          <span className="text-base font-semibold text-gray-900">1.00 work days</span>
        </div>

        {/* Add manager note */}
        <div className="mb-6">
          <textarea
            id="timeOffManagerNote"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm resize-y min-h-[80px] focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Add manager note"
          ></textarea>
        </div>

        {/* Add and Cancel buttons (kept as they are typical for modals, even if not fully visible in the partial screenshot) */}
        <div className="flex justify-start space-x-3">
          <button className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors shadow-md">
            Add
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors shadow-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTimeOffModal;