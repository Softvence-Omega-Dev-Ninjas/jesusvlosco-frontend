import React from "react";
import { Search } from "lucide-react"; // Assuming Search icon is used within UniversalModal

// Interface for Survey data structure (needed for quickView modal type)
interface Survey {
  id: string;
  title: string;
  createdBy: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Completed" | "Pending";
  assignTo: string;
}

// Interface for Column options (needed for columns modal type)
interface ColumnOption {
  id: string;
  label: string;
  isVisible: boolean;
}

// UniversalModalProps interface defines all possible props for the modal
interface UniversalModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalType: "filter" | "calendar" | "columns" | "quickView";
  // Props specific to filter modal
  filterOptions?: string[];
  selectedFilters?: string[];
  onFilterChange?: (filter: string) => void;
  // Props specific to calendar modal
  selectedDate?: string;
  onDateChange?: (date: string) => void;
  // Props specific to columns modal
  columnOptions?: ColumnOption[];
  onColumnToggle?: (columnId: string) => void;
  // Props specific to quick view modal
  surveyData?: Survey | null; // Changed to allow null, resolving the TypeScript error
}

const UniversalModal: React.FC<UniversalModalProps> = ({
  isOpen,
  onClose,
  modalType,
  filterOptions,
  selectedFilters,
  onFilterChange,
  selectedDate,
  onDateChange,
  columnOptions,
  onColumnToggle,
  surveyData,
}) => {
  // If the modal is not open, return null to render nothing
  if (!isOpen) return null;

  // Helper function to get Tailwind classes for status badges
  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "Active":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "Completed":
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case "Pending":
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Renders content based on the modalType prop
  const renderContent = () => {
    switch (modalType) {
      case "calendar":
        return (
          <>
            <div className="py-2 px-3 font-semibold text-gray-700 border-b border-gray-200">Select Date</div>
            <div className="p-3">
              <p className="text-gray-500 text-sm">
                {selectedDate ? `Selected: ${selectedDate}` : "Click to select a date"}
              </p>
              <input
                type="date"
                className="mt-2 w-full border border-gray-300 rounded-md p-1 text-sm"
                onChange={(e) => onDateChange && onDateChange(e.target.value)}
              />
              <button
                className="mt-3 w-full bg-primary text-white py-1.5 rounded-md text-sm"
                onClick={onClose}
              >
                Apply Date
              </button>
            </div>
          </>
        );
      case "filter":
        return (
          <>
            <div className="py-2 px-3 font-semibold text-gray-700">Filter Options</div>
            {filterOptions?.map((filter) => (
              <label
                key={filter}
                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-primary rounded border-gray-300"
                  checked={selectedFilters?.includes(filter)}
                  onChange={() => onFilterChange && onFilterChange(filter)}
                />
                <span className="ml-2 text-gray-700">{filter}</span>
              </label>
            ))}
            <div className="p-3 border-t border-gray-200">
                <button
                  className="w-full bg-primary text-white py-1.5 rounded-md text-sm"
                  onClick={onClose}
                >
                  Apply Filters
                </button>
              </div>
          </>
        );
      case "columns":
        return (
          <>
            <div className="py-2 px-3 font-semibold text-gray-700 border-b border-gray-200">
              <div className="relative">
                <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search members"
                  className="w-full pl-8 pr-2 py-1 text-sm border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {/* Filter out 'checkbox' and 'action' from column options as they are special */}
              {columnOptions?.filter(col => col.id !== 'checkbox' && col.id !== 'action').map((column) => (
                <label
                  key={column.id}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-primary rounded border-gray-300"
                    checked={column.isVisible}
                    onChange={() => onColumnToggle && onColumnToggle(column.id)}
                  />
                  <span className="ml-2 text-gray-700">{column.label}</span>
                </label>
              ))}
            </div>
            <div className="p-3 border-t border-gray-200">
              <button
                className="w-full bg-primary text-white py-1.5 rounded-md text-sm"
                onClick={onClose}
              >
                Apply
              </button>
            </div>
          </>
        );
      case "quickView":
        // Display a message if surveyData is not provided for quickView
        if (!surveyData) return <div className="p-4 text-red-500">No survey data available.</div>;
        return (
          <>
            <div className="py-2 px-3 font-semibold text-gray-700 border-b border-gray-200">Survey Quick View</div>
            <div className="p-4 text-sm text-gray-700">
              <p className="mb-2"><strong>Title:</strong> {surveyData.title}</p>
              <p className="mb-2">
                <strong>Status:</strong> <span className={`${getStatusBadge(surveyData.status)}`}>{surveyData.status}</span>
              </p>
              <p className="mb-2"><strong>Duration:</strong> {surveyData.startDate} - {surveyData.endDate.replace('04/20/2025', 'May 15,2025')}</p>
              <p className="mb-2"><strong>Top Departments by response rate:</strong></p>
              <ul className="list-disc list-inside ml-4">
                <li>Sales (40%)</li>
                <li>HR (30%)</li>
                <li>IT (20%)</li>
              </ul>
              <p className="mt-2 mb-2"><strong>Creator:</strong> {surveyData.createdBy.replace('HR Manager', 'HR Department')}</p>
              <p className="mb-2"><strong>Category:</strong> Employee Engagement</p>
              <p className="mb-2"><strong>Time remaining:</strong> 2 days</p>
              <p className="mt-4"><strong>Description:</strong> This survey gathers feedback on employee satisfaction and workplace environment.</p>
            </div>
            <div className="p-3 border-t border-gray-200 flex justify-end gap-2">
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium">
                View detail
              </button>
              <button
                className="border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    // Fixed position with background overlay, centered content
    <div className="fixed inset-0 bg-black/25 z-40 flex items-center justify-center">
      <div className="bg-white rounded-md shadow-lg py-1 w-64 md:w-80 lg:w-96">
        {renderContent()}
      </div>
    </div>
  );
};

export default UniversalModal;
