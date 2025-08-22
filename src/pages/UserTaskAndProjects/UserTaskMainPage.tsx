import { useState } from "react";
import { UserTaskAndProjects } from "./UserTaskAndProjects";
import UserSubmittedTask from "./UserSubmittedTask";

function TaskAndProject() {
  const [activeTabMain, setActiveTabMain] = useState<"all" | "submitted">("all");

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl text-[#4E53B1] font-semibold">Task & Projects</h1>
        </div>
        {/* here add tab button  */}
        <div className="mb-10">
          <div className="flex space-x-3">
            <button
              onClick={() => setActiveTabMain("all")}
              className={`px-6 py-3 text-sm font-medium rounded-lg cursor-pointer  border-2 transition-colors ${
                activeTabMain === "all"
                  ? "bg-[#4E53B1] px-6 py-3 rounded-lg text-white"
                  : "border-[#C5C5C5] text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              All Tasks
            </button>
            <button
              onClick={() => setActiveTabMain("submitted")}
              className={`px-4 py-3 text-sm font-medium  cursor-pointer rounded-lg border-2 transition-colors ${
                activeTabMain === "submitted"
                  ? "bg-[#4E53B1]  text-white border-[#4E53B1]"
                  : "border-[#C5C5C5] text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Submitted Tasks
            </button>
          </div>
        </div>

        {activeTabMain === "all" && (
          <div>
            <UserTaskAndProjects />
          </div>
        )}
        {activeTabMain === "submitted" && (
          <div>
            <UserSubmittedTask />
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskAndProject;
