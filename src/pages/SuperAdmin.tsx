/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";
import { useGetAllUserQuery } from "@/store/api/admin/user/userApi";
import { PiUserCircleLight } from "react-icons/pi";
import { formatDateToMDY } from "@/utils/formatDateToMDY";
import TableLoadingSpinner from "@/utils/TableLoadingSpinner";
import Pagination from "@/utils/Pagination";
import UserActionDropdown from "@/Layout/User/UserActionDropdown";

const SuperAdmin: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Use RTK Query to fetch super admin users - filter by SUPER_ADMIN role
  const {
    data: allUsersResponse,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllUserQuery({
    role: "SUPER_ADMIN",
    page: currentPage,
    limit: usersPerPage,
    searchTerm: searchTerm,
  });

  const filterModalRef = useRef<HTMLDivElement>(null);

  // Filter users to show only SUPER_ADMIN role
  const superAdminUsers = allUsersResponse?.data || [];

  console.log("Super Admin Users:", superAdminUsers);

  // Handle checkbox selection
  const handleCheckboxChange = (userId: string) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    if (selectedUsers.length === superAdminUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(superAdminUsers.map((user: any) => user.id));
    }
  };

  // Close filter modal when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (
      filterModalRef.current &&
      !filterModalRef.current.contains(event.target as Node)
    ) {
      setShowFilterModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate pagination info
  const totalUsers = allUsersResponse?.totalUsers || 0;
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        {/* Title and count */}
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-800">
            Super Admin List
          </h2>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {superAdminUsers.length} Super Admins
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search input */}
          <div className="relative flex-1 md:flex-initial">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search super admins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Add User button */}
          <Link
            to="/admin/add-user?role=SUPER_ADMIN"
            className="flex items-center gap-2 px-4 py-2 bg-[#4E53B1] text-white rounded-lg hover:bg-[#3d4396] transition-colors"
          >
            <span className="text-lg">+</span>
            <span className="hidden sm:inline">Add User</span>
          </Link>
        </div>
      </div>

      {/* Table section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading || isFetching ? (
          <TableLoadingSpinner />
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600">Error loading super admin users</p>
            <button
              onClick={() => refetch()}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : superAdminUsers.length === 0 ? (
          <div className="p-8 text-center">
            <PiUserCircleLight className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No super admin users found</p>
            <p className="text-gray-500 text-sm mt-1">
              {searchTerm
                ? `No results for "${searchTerm}"`
                : "No super admin users available"}
            </p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-8 gap-4 items-center">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={
                      superAdminUsers.length > 0 &&
                      selectedUsers.length === superAdminUsers.length
                    }
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                <div className="text-left">
                  <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">ID</span>
                </div>
                <div className="text-left">
                  <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Name</span>
                </div>
                <div className="text-left">
                  <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Email</span>
                </div>
                <div className="text-left">
                  <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Phone</span>
                </div>
                <div className="text-left">
                  <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Last Login</span>
                </div>
                <div className="text-left">
                  <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Role</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</span>
                </div>
              </div>
            </div>

            {/* Table content */}
            <div className="divide-y divide-gray-200">
              {superAdminUsers.map((user: any) => (
                <div
                  key={user.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="grid grid-cols-8 gap-4 items-center">
                    {/* Checkbox */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleCheckboxChange(user.id)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>

                    {/* ID */}
                    <div className="text-sm">
                      <span className="text-gray-600 font-mono">{user?.employeeID}</span>
                    </div>

                    {/* Name with Avatar */}
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        {user.profile?.profilePicture ? (
                          <img
                            src={user.profile.profilePicture}
                            alt={`${user.profile?.firstName} ${user.profile?.lastName}`}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <PiUserCircleLight className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {user.profile?.firstName} {user.profile?.lastName}
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="text-sm">
                      <div className="text-gray-900 truncate">{user.email}</div>
                    </div>

                    {/* Phone */}
                    <div className="text-sm">
                      <div className="text-gray-900">{user.phone || "N/A"}</div>
                    </div>

                    {/* Last Login */}
                    <div className="text-sm">
                      <div className="text-gray-900">
                        {user.lastLoginAt 
                          ? formatDateToMDY(user.lastLoginAt)
                          : "Never"
                        }
                      </div>
                    </div>

                    {/* Role */}
                    <div className="text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        SUPER_ADMIN
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="text-right">
                      <UserActionDropdown 
                        id={user.id}
                        role={user.role}
                        firstName={user.profile?.firstName}
                        lastName={user.profile?.lastName}
                        email={user.email}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={filterModalRef}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold mb-4">Filter Super Admins</h3>
            <p className="text-gray-600 mb-4">
              Filter options for super admin users will be available here.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowFilterModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="px-4 py-2 bg-[#4E53B1] text-white rounded-lg hover:bg-[#3d4396]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdmin;
