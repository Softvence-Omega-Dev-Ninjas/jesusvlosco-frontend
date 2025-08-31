// src/components/Admin/UsersTable.tsx
import React from "react";

import { LoaderIcon, Settings2 } from "lucide-react"; // Assuming this icon is used
import { User } from "@/pages/Admin";
import { PiUserCircleLight } from "react-icons/pi";
import TableLoadingSpinner from "@/utils/TableLoadingSpinner";
import UserActionDropdown from "@/Layout/User/UserActionDropdown";

interface UsersTableProps {
  users: User[];
  isFetching: boolean;
  isLoading: boolean;
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
  currentUserRole?: string;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  isLoading,
  isFetching,
  selectedUserIds,
  handleHeaderCheckboxChange,
  handleUserCheckboxChange,
  isAnyModalOpen,
  toggleFilterColumnModal,
  filterColumnButtonRef, // Destructure the ref
  currentUserRole,
}) => {
  const allUsersSelected =
    selectedUserIds.length === users?.length && users?.length > 0;
  const indeterminate =
    selectedUserIds.length > 0 && selectedUserIds.length < users.length;
  type DateOverride = { year: number; month: number; day: number } | null;
  function formatDateToMDY(
    dateInput: string | number | Date,
    override: DateOverride = null
  ) {
    const original = new Date(dateInput);

    const finalDate = override
      ? new Date(
          Date.UTC(
            override.year,
            override.month - 1,
            override.day,
            original.getUTCHours(),
            original.getUTCMinutes(),
            original.getUTCSeconds()
          )
        )
      : original;

    const month = finalDate.getUTCMonth() + 1;
    const day = finalDate.getUTCDate();
    const year = String(finalDate.getUTCFullYear()).slice(-2);

    return `${month}/${day}/${year}`;
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
        isAnyModalOpen ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="bg-transparent min-h-[300px] w-full flex justify-center items-center">
            <LoaderIcon
              size={52}
              className="animate-spin text-blue-600 duration-1000"
            />
          </div>
        ) : (
          <>
            {users && users?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
                {/* Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 h-16 mb-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25m0 0L12 2.25 8.25 5.25m7.5 0h-7.5m7.5 0V9m-7.5 0V5.25M3 9.75h18M3 19.5h18"
                  />
                </svg>

                {/* Message */}
                <p className="text-lg font-medium">
                  No records match your search.
                </p>
                <span className="text-sm text-gray-400">
                  Try adjusting your filters or adding new data.
                </span>
              </div>
            ) : (
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
                      <div className="flex items-center justify-end gap-2">
                        {currentUserRole === "SUPER_ADMIN" && (
                          <span>Actions</span>
                        )}
                        <button
                          ref={filterColumnButtonRef} // Attach the ref to the settings button
                          onClick={toggleFilterColumnModal}
                          className="p-1 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          title="Filter columns"
                        >
                          <Settings2 className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y relative divide-gray-200">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {users?.map((user: any) => (
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
                        {user?.employeeID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {user?.profile?.profileUrl ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={user?.profile?.profileUrl}
                                alt={`Avatar of ${user?.profile?.firstName}`}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).onerror = null;
                                  (
                                    e.target as HTMLImageElement
                                  ).src = `https://placehold.co/40x40/cccccc/000000?text=${user.name
                                    .charAt(0)
                                    .toUpperCase()}`;
                                }}
                              />
                            ) : (
                              <PiUserCircleLight size={36} />
                            )}
                          </div>
                          <div className="ml-3 ">
                            <div className="text-sm flex items-center gap-2 font-medium text-gray-900">
                              <p>{user?.profile?.firstName}</p>
                              <p> {user?.profile?.lastName}</p>
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
                        {user?.profile?.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateToMDY(user?.lastLoginAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {currentUserRole === "SUPER_ADMIN" && (
                          <UserActionDropdown
                            id={user?.id}
                            firstName={user?.profile?.firstName}
                            lastName={user?.profile?.lastName}
                            email={user?.email}
                            role={user?.role}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                {!isLoading && isFetching && <TableLoadingSpinner />}
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UsersTable;
