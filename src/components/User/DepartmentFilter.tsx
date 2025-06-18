// src/components/modals/DepartmentFilter.tsx
import React, { useState } from "react";

const departmentOptions: string[] = [
  "Sales",
  "Marketing",
  "Field operation",
  "Project management",
  "Design",
  "Medical",
  "Trainer",
];

const DepartmentFilter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  const filteredDepartments = departmentOptions.filter((dept) =>
    dept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckboxChange = (dept: string) => {
    setSelectedDepartments((prevSelected) =>
      prevSelected.includes(dept)
        ? prevSelected.filter((d) => d !== dept)
        : [...prevSelected, dept]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedDepartments(departmentOptions);
    } else {
      setSelectedDepartments([]);
    }
  };

  return (
    <div className="px-4">
      <h3 className="text-base font-semibold text-gray-900 mb-3">Department</h3>

      <select className="block w-full px-3 py-2 mb-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-400">
        <option>Select department</option>
        {departmentOptions.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>

      <div className="relative mb-3">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
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

      <div className="max-h-48 overflow-y-auto">
        <label className="flex items-center text-sm text-gray-700 py-1">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-indigo-600 rounded-sm mr-2"
            checked={selectedDepartments.length === departmentOptions.length}
            onChange={handleSelectAll}
          />
          Select all
        </label>
        {filteredDepartments.map((dept) => (
          <label
            key={dept}
            className="flex items-center text-sm text-gray-700 py-1"
          >
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-indigo-600 rounded-sm mr-2"
              checked={selectedDepartments.includes(dept)}
              onChange={() => handleCheckboxChange(dept)}
            />
            {dept}
          </label>
        ))}
      </div>
    </div>
  );
};

export default DepartmentFilter;
