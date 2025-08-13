import React from "react";
import { Link } from "react-router-dom";
import { AssignIcon, PeopleIcon, TaskIcon, UpdateIcon } from "./icons";

export const QuickActions: React.FC = () => {
  return (
    <div className="rounded-2xl border border-gray-200 p-5">
      <h2 className="text-lg font-medium text-[#4E53B1] mb-4">Quick Action</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Add users button */}
        <Link
          to={"/admin/add-user"}
          className="flex items-center justify-center gap-3 px-6 py-4 cursor-pointer bg-white border border-gray-200 whitespace-nowrap rounded-lg transition-colors duration-200"
        >
          <PeopleIcon />
          <span className="text-[#4E53B1] font-medium">Add users</span>
        </Link>

        {/* Add a task button */}
        <Link
          to={"/admin/schedule/shiftschedule"}
          className="flex items-center justify-center gap-3 px-6 py-4 cursor-pointer bg-white border border-gray-200 whitespace-nowrap rounded-lg transition-colors duration-200"
        >
          <TaskIcon />
          <span className="text-[#4E53B1] font-medium">Add a task</span>
        </Link>

        {/* Send an update button */}
        <Link
          to={"/admin/communication/chat"}
          className="flex items-center justify-center gap-3 px-6 py-4 cursor-pointer bg-white border border-gray-200 whitespace-nowrap rounded-lg transition-colors duration-200"
        >
          <UpdateIcon />
          <span className="text-[#4E53B1] font-medium">Send an update</span>
        </Link>

        {/* Assign button - highlighted */}
        <Link
          to={"/admin/schedule/shiftschedule"}
          className="flex items-center justify-center gap-3 px-6 py-4 cursor-pointer bg-[#4E53B1] text-white whitespace-nowrap rounded-lg transition-colors duration-200"
        >
          <AssignIcon />
          <span className="font-medium">Assign</span>
        </Link>
      </div>
    </div>
  );
};
