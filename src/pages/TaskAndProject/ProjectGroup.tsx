import { Plus } from "lucide-react";
import { FaSortDown } from "react-icons/fa";

import TaskListItem from "./TaskListItem";
import { IProject } from "@/types/taskTypes";

interface ProjectGroupProps {
  project: IProject;
  groupBy: "title" | "label" | "assignedTo";
  isMobile: boolean;
  isExpanded: boolean;
  isTaskSelected: (taskId: string) => boolean;
  toggleTask: (taskId: string) => void;
  toggleProject: (projectId: string) => void;
  getProjectNameForTask: (taskId: string) => string;
}

export default function ProjectGroup({
  project,
  groupBy,
  isMobile,
  isExpanded,
  isTaskSelected,
  toggleTask,
  toggleProject,
  getProjectNameForTask,
}: ProjectGroupProps) {
  const getAvatarColor = (name: string) => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-yellow-500"];
    return colors[name.length % colors.length];
  };

  const allTasksSelected = project.tasks.every((t) => isTaskSelected(t.id));

  const handleToggleAllTasks = () => {
    if (allTasksSelected) {
      toggleTask(project.tasks[0].id); // Just toggle the first one to trigger deselection
    } else {
      project.tasks.forEach((task) => {
        if (!isTaskSelected(task.id)) {
          toggleTask(task.id);
        }
      });
    }
  };

  return (
    <div className="bg-white mt-4 rounded-lg border border-gray-200 overflow-hidden">
      {isMobile ? (
        <>
          <button onClick={() => toggleProject(project.id)} className="w-full px-4 py-3 bg-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={allTasksSelected}
                onChange={handleToggleAllTasks}
                className="w-4 h-4 text-indigo-600 rounded border-gray-300"
              />
              <div className="flex items-center gap-2">
                {groupBy === "assignedTo" && project.assignedTo && (
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white ${getAvatarColor(
                      project.assignedTo.name
                    )}`}
                  >
                    {project.assignedTo.avatar}
                  </div>
                )}
                <h3 className="text-lg font-medium text-[#4E53B1]">{groupBy === "assignedTo" ? project.tasks[0]?.assignedTo.name : project.name}</h3>
              </div>
            </div>
            <FaSortDown className={`w-4 h-4 text-[#4E53B1] transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </button>

          {isExpanded && (
            <div className="border-t border-gray-200">
              {project.tasks.map((task) => (
                <TaskListItem
                  key={task.id}
                  task={task}
                  groupBy={groupBy}
                  isMobile={true}
                  isSelected={isTaskSelected(task.id)}
                  onToggleTask={toggleTask}
                  getProjectNameForTask={getProjectNameForTask}
                />
              ))}
              <div className="p-4">
                <button className="flex items-center gap-2 text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors">
                  <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                    <Plus className="w-3 h-3 text-white" />
                  </div>
                  Add Task
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-13 gap-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-1">
                <input
                  type="checkbox"
                  checked={allTasksSelected}
                  onChange={handleToggleAllTasks}
                  className="w-4 h-4 text-indigo-600 rounded border-gray-300"
                />
              </div>
              <div className="col-span-2 text-[#4E53B1] text-lg -mt-2 lg:-ml-20 flex items-center gap-2">
                {groupBy === "assignedTo" && project.assignedTo && (
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white ${getAvatarColor(
                      project.assignedTo.name
                    )}`}
                  >
                    {project.assignedTo.avatar}
                  </div>
                )}
                {groupBy === "assignedTo" ? project.tasks[0]?.assignedTo.name : project.name}
              </div>
              <div className="col-span-2 text-[#4E53B1]">Status</div>
              <div className="col-span-2 text-[#4E53B1]">Label</div>
              <div className="col-span-2 text-[#4E53B1]">Start time</div>
              <div className="col-span-2 text-[#4E53B1]">Due date</div>
              {groupBy !== "assignedTo" && <div className="col-span-2 text-[#4E53B1] text-right">Assigned to</div>}
            </div>
          </div>
          <div className="">
            {project.tasks.map((task) => (
              <TaskListItem
                key={task.id}
                task={task}
                groupBy={groupBy}
                isMobile={false}
                isSelected={isTaskSelected(task.id)}
                onToggleTask={toggleTask}
                getProjectNameForTask={getProjectNameForTask}
              />
            ))}
          </div>
          <div className="px-6 py-4 border-t border-gray-200 mb-3">
            <button className="flex items-center gap-2 text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors">
              <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                <Plus className="w-3 h-3 text-white" />
              </div>
              Add Task
            </button>
          </div>
        </>
      )}
    </div>
  );
}
