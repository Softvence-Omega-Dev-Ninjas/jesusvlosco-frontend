
import React, { useState } from "react";
import { ColumnOption } from "./interfaces";

const initialColumnOptions: ColumnOption[] = [
  { label: "Name", checked: true },
  { label: "Employee ID", checked: false },
  { label: "Email", checked: true },
  { label: "Group/ Team", checked: false },
  { label: "Mobile number", checked: true },
  { label: "Gender", checked: false },
  { label: "User type", checked: false },
  { label: "Department", checked: true },
  { label: "Last login", checked: false },
  { label: "Roles", checked: false },
  { label: "Employment start date", checked: false },
];

const ColumnSelector: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [columnOptions, setColumnOptions] = useState<ColumnOption[]>(initialColumnOptions);

  const filteredColumns = columnOptions.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckboxChange = (label: string) => {
    setColumnOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.label === label ? { ...option, checked: !option.checked } : option
      )
    );
  };

  return (
    <div className="px-4 py-2">
      <div className="relative mb-2">
        <input
          type="text"
          placeholder="Search columns"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-8 pr-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {filteredColumns.map((option) => (
          <label key={option.label} className="flex items-center text-sm text-gray-700 py-1">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-indigo-600 rounded-sm mr-2"
              checked={option.checked}
              onChange={() => handleCheckboxChange(option.label)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default ColumnSelector;