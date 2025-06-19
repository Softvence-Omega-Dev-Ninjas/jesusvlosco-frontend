// src/components/Admin/FilterColumnModal.tsx
import React from "react";

// Define the interface for a single filter option
export interface FilterOption {
  label: string;
  checked: boolean;
}

// Define the array of filter options (columns to show/hide)
export const filterOptions: FilterOption[] = [
  { label: "ID", checked: true },
  { label: "User", checked: true },
  { label: "Email", checked: true },
  { label: "Phone No", checked: true },
  { label: "Department", checked: true },
  { label: "Last Login", checked: true },
  { label: "Employee ID", checked: false },
  { label: "Group/ Team", checked: false },
  { label: "Mobile number", checked: true }, // Already in initial, ensure consistency
  { label: "Gender", checked: false },
  { label: "User type", checked: false },
  { label: "Roles", checked: false },
  { label: "Employment start date", checked: false },
  // Add any other column options you have or want to add here
];

interface FilterColumnModalProps {
  showFilterColumnModal: boolean;
  filterModalPosition: { top: number; right: number } | null;
  filterColumnModalRef: React.RefObject<HTMLDivElement | null>;
  // We're no longer passing filterOptions as a prop as it's defined internally
  // But if you needed to customize it from the parent, you would add it here:
  // filterOptions: FilterOption[];
}

const FilterColumnModal: React.FC<FilterColumnModalProps> = ({
  showFilterColumnModal,
  filterModalPosition,
  filterColumnModalRef,
}) => {
  // If the modal is not meant to be shown or position is not set, don't render it.
  if (!showFilterColumnModal || !filterModalPosition) return null;

  return (
    <div
      ref={filterColumnModalRef}
      className="absolute bg-white w-72 rounded-lg shadow-lg py-2 z-20 border border-gray-200"
      style={{ top: filterModalPosition.top, right: filterModalPosition.right }}
    >
      <div className="px-4 py-2">
        <div className="relative mb-2">
          <input
            type="text"
            placeholder="Search members" // This implies searching columns, might need clarification
            className="w-full pl-8 pr-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto pr-2">
          {filterOptions.map((option: FilterOption) => (
            <label
              key={option.label}
              className="flex items-center text-sm text-gray-700 py-1"
            >
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-indigo-600 rounded-sm mr-2"
                defaultChecked={option.checked}
                // You'll likely want an onChange handler here to update visible columns
                // onChange={(e) => handleColumnToggle(option.label, e.target.checked)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterColumnModal;
