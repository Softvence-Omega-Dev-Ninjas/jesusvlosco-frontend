// src/components/Admin/ActionDropdown.tsx
import React, { JSX } from "react";
import { SlOptionsVertical } from "react-icons/sl"; // Assuming you use this icon

// Define the interface for a single action option
interface ActionOption {
  label: string;
  icon: JSX.Element; // React element for the SVG icon
}

// Define the array of action options with their icons
const actionOptions: ActionOption[] = [
  {
    label: "Update user details",
    icon: (
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        ></path>
      </svg>
    ),
  },
  {
    label: "Create team chat",
    icon: (
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M17 20h2a2 2 0 002-2V8a2 2 0 00-2-2h-2M5 20h2a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2zm12-7l-4 4m0 0l-4-4m4 4V7"
        ></path>
      </svg>
    ),
  },
  {
    label: "Send chat message",
    icon: (
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.105A9.702 9.702 0 0112 4c4.97 0 9 3.582 9 8z"
        ></path>
      </svg>
    ),
  },
  {
    label: "Send text message",
    icon: (
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586L6 15.414V12H4a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v2z"
        ></path>
      </svg>
    ),
  },
  {
    label: "Create task",
    icon: (
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M17 12h.01"
        ></path>
      </svg>
    ),
  },
  {
    label: "Delete",
    icon: (
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        ></path>
      </svg>
    ),
  },
];

interface ActionDropdownProps {
  showActionDropdown: boolean;
  toggleActionDropdown: () => void;
  // FIX: Allow null for the ref's current property for the dropdown container
  actionDropdownRef: React.RefObject<HTMLDivElement | null>;
  // FIX: Allow null for the ref's current property for the button
  actionDropdownButtonRef: React.RefObject<HTMLButtonElement | null>;
  // No need to pass actionOptions as a prop anymore, as it's defined internally
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({
  showActionDropdown,
  toggleActionDropdown,
  actionDropdownRef,
  actionDropdownButtonRef,
}) => {
  return (
    <div className="relative">
      <button
        ref={actionDropdownButtonRef}
        onClick={toggleActionDropdown}
        className="flex items-center  px-3 py-2 text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none"
      >
        <SlOptionsVertical className="text-xl" />
      </button>

      {showActionDropdown && (
        <div
          ref={actionDropdownRef}
          className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-200"
        >
          <div className="px-1 py-1">
            {actionOptions.map((option) => (
              <button
                key={option.label}
                className="flex items-center w-full gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => {
                  /* Add your click handler here, e.g., handleAction(option.label) */
                  console.log(`Action clicked: ${option.label}`);
                  // You might want to close the dropdown after an action is clicked
                  toggleActionDropdown();
                }}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionDropdown;
