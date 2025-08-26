import React, { useState } from "react";
import { TUser } from "@/types/usertype";
import { FiSearch } from "react-icons/fi";

type SelectUsersProps = {
  userList: TUser[];
  teamMembers: string[];
  handleUserSelection: (userId: string, isSelected: boolean) => void;
};

const SelectUsersComponent: React.FC<SelectUsersProps> = ({
  userList,
  teamMembers,
  handleUserSelection,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter users based on search term
  const filteredUserList = userList.filter((user) => {
    if (!searchTerm) return true; // If no search term, show all users
    const firstName = user.profile?.firstName?.toLowerCase() || "";
    const lastName = user.profile?.lastName?.toLowerCase() || "";
    const jobTitle = user.profile?.jobTitle?.toLowerCase() || "";
    const email = user.email?.toLowerCase() || "";
    const searchLower = searchTerm.toLowerCase();
    return firstName.includes(searchLower) || 
           lastName.includes(searchLower) || 
           jobTitle.includes(searchLower) || 
           email.includes(searchLower);
  });
  return (
    <div className="border-l border-gray-200 px-5 min-w-sm w-full">
      <>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-indigo-700">Select Team Members</h2>
          <p className="text-sm text-gray-500">Pick users to add to the team — scroll the list if needed.</p>
        </div>

        {/* Search Input */}
        <div className="relative mt-4 mb-4">
          <input
            type="text"
            placeholder="Search by name, job title, or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
        </div>

        <style>{`
          /* make the users list have a minimum height and be scrollable with a sensible max height */
          .border-l > .max-h-max {
            min-height: 250px;
            max-height: 68vh;
            overflow-y: auto;
          }
        `}</style>
      </>
      <div className="max-h-max overflow-y-auto pt-5">
        {filteredUserList.length === 0 && searchTerm ? (
          <div className="text-center py-8 text-gray-500">
            <p>No employees found matching "{searchTerm}"</p>
            <p className="text-sm mt-1">
              Try searching by name, job title, or email
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 px-2">
            {filteredUserList.map((user: TUser) => (
              <div
                key={user.id}
                className="relative flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  id={`user-${user.id}`}
                  checked={teamMembers.includes(user.id)}
                  onChange={(e) => handleUserSelection(user.id, e.target.checked)}
                  className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                />
                <label
                  htmlFor={`user-${user.id}`}
                  className="ml-3 flex-1 cursor-pointer"
                >
                  <div className="flex flex-col items-start justify-start gap-2">
                    <div className="space-y-2">
                      <p className="text-base font-medium text-gray-900 mt-4">
                        {user.profile?.firstName} {user.profile?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <p className="text-xs text-indigo-600">
                        {user.profile?.jobTitle}
                      </p>
                    </div>
                    <div className="absolute top-1 right-1 xl:text-right">
                      <span className="inline-flex items-center px-2 py-1 rounded-full font-semibold text-xs bg-blue-600 text-white">
                        {user.profile?.department}
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {teamMembers.length > 0 && (
        <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
          <p className="text-sm text-indigo-700">
            <span className="font-medium">{teamMembers.length}</span> team
            member{teamMembers.length > 1 ? "s" : ""} selected
          </p>
        </div>
      )}

      {/* Show filtered results count */}
      {searchTerm && (
        <div className="mt-2 p-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            Showing <span className="font-medium">{filteredUserList.length}</span> of <span className="font-medium">{userList.length}</span> users
          </p>
        </div>
      )}
    </div>
  );
};

export default SelectUsersComponent;
