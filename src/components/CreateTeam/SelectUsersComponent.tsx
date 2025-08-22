import React from "react";
import { TUser } from "@/types/usertype";

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
  return (
    <div className="border-l border-gray-200 px-5 min-w-sm w-full">
      <>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-indigo-700">Select Team Members</h2>
          <p className="text-sm text-gray-500">Pick users to add to the team — scroll the list if needed.</p>
        </div>

        <style>{`
          /* make the users list have a minimum height and be scrollable with a sensible max height */
          .border-l > .max-h-max {
            min-height: 220px;
            max-height: 48vh;
            overflow-y: auto;
          }
        `}</style>
      </>
      <div className="max-h-max overflow-y-auto pt-5">
        <div className="flex flex-wrap gap-3">
          {userList.map((user: TUser) => (
            <div
              key={user.id}
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
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
                    <p className="text-sm font-medium text-gray-900">
                      {user.profile?.firstName} {user.profile?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <p className="text-xs text-indigo-600">
                      {user.profile?.jobTitle}
                    </p>
                  </div>
                  <div className="xl:text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      {user.profile?.department}
                    </span>
                  </div>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {teamMembers.length > 0 && (
        <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
          <p className="text-sm text-indigo-700">
            <span className="font-medium">{teamMembers.length}</span> team
            member{teamMembers.length > 1 ? "s" : ""} selected
          </p>
        </div>
      )}
    </div>
  );
};

export default SelectUsersComponent;
