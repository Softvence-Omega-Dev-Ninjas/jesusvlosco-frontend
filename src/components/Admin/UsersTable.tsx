// src/components/Admin/UsersTable.tsx
import React from "react";

import { Settings2 } from "lucide-react"; // Assuming this icon is used
import { User } from "@/pages/Admin";

interface UsersTableProps {
  users: User[];
  selectedUserIds: string[];
  handleHeaderCheckboxChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleUserCheckboxChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    userId: string
  ) => void;
  isAnyModalOpen: boolean;
  toggleFilterColumnModal: () => void;
  // FIX: Allow null for the ref's current property for the filter button
  filterColumnButtonRef: React.RefObject<HTMLButtonElement | null>;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  selectedUserIds,
  handleHeaderCheckboxChange,
  handleUserCheckboxChange,
  isAnyModalOpen,
  toggleFilterColumnModal,
  filterColumnButtonRef, // Destructure the ref
}) => {
  const allUsersSelected =
    selectedUserIds.length === users.length && users.length > 0;
  const indeterminate =
    selectedUserIds.length > 0 && selectedUserIds.length < users.length;

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
        isAnyModalOpen ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out rounded"
                  checked={allUsersSelected}
                  onChange={handleHeaderCheckboxChange}
                  ref={(input) => {
                    if (input) input.indeterminate = indeterminate;
                  }}
                />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                User
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Phone No
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Department
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Last Login
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <button
                  ref={filterColumnButtonRef} // Attach the ref to the settings button
                  onClick={toggleFilterColumnModal}
                  className="p-1 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  title="Filter columns"
                >
                  <Settings2 className="w-5 h-5 text-gray-500" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr
                key={user.id}
                className={
                  selectedUserIds.includes(user.id) ? "bg-indigo-50" : ""
                }
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out rounded"
                    checked={selectedUserIds.includes(user.id)}
                    onChange={(e) => handleUserCheckboxChange(e, user.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={user.avatar}
                        alt={`${user.name}'s avatar`}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastLogin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {/* Action button for individual user if needed */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
