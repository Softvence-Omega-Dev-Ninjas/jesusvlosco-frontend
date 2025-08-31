/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react";
import { HiOutlineDownload } from "react-icons/hi";
import { FiSettings } from "react-icons/fi";
import { useGetSingleProjectQuery } from "@/store/api/admin/shift-sheduling/CreateProjectapi";
import { useParams } from "react-router-dom";

const ProjectHeader: FC = () => {
    const currentProjectId = useParams().id;
  const projectInformation = useGetSingleProjectQuery(
    currentProjectId as string
  );
  const projectData = (projectInformation as any).data?.data;
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-4 rounded-md">
      {/* Left section: title and description */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-3 text-indigo-700">Shift Scheduling Project <span className="capitalize font-bold">{projectData?.title}</span></h2>
        <p className="text-sm text-gray-500">Drag and drop employees to schedule shifts for the week</p>
      </div>

      {/* Right section: buttons */}
      <div className="flex items-center gap-2 mt-3 sm:mt-0">
        <button className="hidden  items-center gap-1 px-3 py-1.5 text-sm text-indigo-700 border border-indigo-300 rounded hover:bg-indigo-50 transition">
          <HiOutlineDownload className="w-4 h-4" />
          Export
        </button>
        <button className="hidden  items-center gap-1 px-3 py-1.5 text-sm text-indigo-700 border border-indigo-300 rounded hover:bg-indigo-50 transition">
          <FiSettings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </div>
  );
};

export default ProjectHeader;
