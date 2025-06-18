// src/components/users/TableHeader.tsx
import { Columns3 } from "lucide-react";
import React from "react";

interface TableHeaderProps {
  onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAllSelected: boolean;
  isSomeSelected: boolean;
  onColumnToggle: () => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  onSelectAll,
  isAllSelected,
  isSomeSelected,
  onColumnToggle,
}) => {
  return (
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out rounded-sm"
            checked={isAllSelected}
            onChange={onSelectAll}
            ref={(input) => {
              if (input) input.indeterminate = isSomeSelected;
            }}
          />
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          ID
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Name
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Email
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Phone
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Department
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Last Login
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative">
          <button
            className="ml-2 flex items-center justify-center p-1 rounded-md hover:bg-gray-100 focus:outline-none cursor-pointer"
            onClick={onColumnToggle}
          >
            <Columns3 className="h-5 w-5" />
            <svg
              className="w-5 h-5 ml-1 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </th>
      </tr>
    </thead>
  );
};

export default TableHeader;
