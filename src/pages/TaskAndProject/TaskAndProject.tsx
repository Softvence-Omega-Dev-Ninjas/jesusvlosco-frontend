import { useState } from "react";
import { List, Calendar, Plus, Search, X } from "lucide-react";
import { GroupByOption, ActiveTab, ViewMode } from "../../types/taskTypes";
import { projects } from "./taskData";
import ActivityLog from "./ActivityLog";
import CalendarDropdown from "./CalenderDropdown";
import OptionsDropdownButton from "./OptionsDropdownButton";
import OverdueTasks from "./OverdueTasks";
import TaskListView from "./TaskListView";
import TaskPage from "./TaskPage";

import TaskDetailsPanel from "./TaskDetailsPanel";
import NewTaskModal from "./NewTaskModal";

export default function TaskAndProject() {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("tasks");
  const [groupBy, setGroupBy] = useState<GroupByOption>("title");
  const [selectedDateRange, setSelectedDateRange] = useState("May 25 - May 30");
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showTaskDetailsPanel, setShowTaskDetailsPanel] = useState(false);
  const [showOverdueTasks, setShowOverdueTasks] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Filter tasks based on active tab
  const filteredProjects = projects.map((project) => ({
    ...project,
    name:
      groupBy === "title"
        ? project.name
        : groupBy === "label"
        ? project.id === "1"
          ? "Low Priority"
          : project.id === "2"
          ? "Medium Priority"
          : "High Priority"
        : project.tasks[0]?.assignedTo.name || project.name,
    assignedTo: project.tasks[0]?.assignedTo,
    tasks: project.tasks
      .filter((task) => {
        if (activeTab === "open") return task.status === "Open" || task.status === "Draft";
        if (activeTab === "done") return task.status === "Done";
        return true;
      })
      .map((task) => ({
        ...task,
        title: (task as any).title ?? task.name,
      })),
  }));

  const totalTasks = projects.reduce((acc, project) => acc + project.tasks.length, 0);
  const openTasks = projects.reduce(
    (acc, project) => acc + project.tasks.filter((task) => task.status === "Open" || task.status === "Draft").length,
    0
  );
  const doneTasks = projects.reduce((acc, project) => acc + project.tasks.filter((task) => task.status === "Done").length, 0);

  const isTaskSelected = (taskId: string) => selectedTasks.includes(taskId);

  const toggleTask = (taskId: string) => {
    setSelectedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]));
  };

  const toggleProject = (projectId: string) => {
    setActiveProject(activeProject === projectId ? null : projectId);
  };

  const getProjectNameForTask = (taskId: string) => {
    for (const project of projects) {
      const task = project.tasks.find((t) => t.id === taskId);
      if (task) return project.name;
    }
    return "";
  };

  const handleTaskDetailsClick = () => {
    setShowTaskDetailsPanel(true);
    setShowNewTaskModal(false);
  };

  return (
    <div className="bg-gray-50 p-4 sm:p-6">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl text-[#4E53B1] font-semibold">Task & Project Management</h1>
          <ActivityLog />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 border-b border-gray-300 pb-4 sm:pb-0">
          <div className="flex mt-6 mb-6 flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className="text-sm text-gray-600">View by:</span>
              <div className="flex gap-2">
                <button
                  className={`flex items-center gap-1 ${viewMode === "list" ? "text-indigo-600 font-medium" : "text-gray-600"} text-sm`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" /> <span className="hidden sm:inline">List</span>
                </button>

                <button
                  className={`flex items-center gap-1 ${viewMode === "dates" ? "text-indigo-600 font-medium" : "text-gray-600"} text-sm`}
                  onClick={() => setViewMode("dates")}
                >
                  <Calendar className="w-4 h-4" /> <span className="hidden sm:inline">Dates</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className="text-sm text-gray-600">Group by:</span>
              <select
                className="text-sm border rounded p-1 border-gray-300 bg-transparent text-gray-900 font-medium focus:outline-none w-full sm:w-auto"
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value as GroupByOption)}
              >
                <option value="title">Title</option>
                <option value="label">Label</option>
                <option value="assignedTo">Assigned to</option>
              </select>
            </div>

            <CalendarDropdown selectedRange={selectedDateRange} onSelectRange={setSelectedDateRange} />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto mt-3 sm:mt-0">
            <div className="relative w-full sm:w-auto">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full"
              />
            </div>
            <button className="bg-[#4E53B1] text-white cursor-pointer px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors w-full sm:w-auto">
              Export
            </button>
          </div>
        </div>

        {/* Summary Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span className="text-black w-full sm:w-auto">The view contains</span>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab("tasks")}
                className={`px-6 py-1 rounded-2xl border font-medium ${
                  activeTab === "tasks" ? "bg-indigo-100 text-indigo-800 border-indigo-300" : "bg-white text-gray-600 border-gray-300"
                }`}
              >
                {totalTasks} Tasks
              </button>

              <button
                onClick={() => setActiveTab("open")}
                className={`px-6 py-1 rounded-2xl border font-medium ${
                  activeTab === "open" ? "bg-indigo-100 text-indigo-800 border-indigo-300" : "bg-white text-gray-600 border-gray-300"
                }`}
              >
                {openTasks} Open tasks
              </button>

              <button
                onClick={() => setActiveTab("done")}
                className={`px-6 py-1 rounded-2xl border font-medium ${
                  activeTab === "done" ? "bg-indigo-100 text-indigo-800 border-indigo-300" : "bg-white text-gray-600 border-gray-300"
                }`}
              >
                {doneTasks} Done tasks
              </button>

              <button className="">
                <OptionsDropdownButton />
              </button>

              <button
                onClick={() => setShowOverdueTasks(true)}
                className="flex items-center gap-1 text-red-600 border bg-red-200 border-gray-300 rounded-2xl px-2 py-2"
              >
                <span>2</span>
                <span>Overdue tasks</span>
              </button>

              {showOverdueTasks && (
                <div className="fixed inset-0 bg-blur bg-opacity-10 flex items-center justify-center z-50 p-4">
                  <div className="relative bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <button onClick={() => setShowOverdueTasks(false)} className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                    <OverdueTasks />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Add Task */}
          <button
            onClick={() => setShowNewTaskModal(true)}
            className="bg-[#4E53B1] text-white cursor-pointer px-4 py-2 rounded-2xl text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 sm:ml-auto"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>

        {/* Content Area - Switches between list view and TaskPage */}
        {viewMode === "list" ? (
          <TaskListView
            projects={filteredProjects}
            groupBy={groupBy}
            activeProject={activeProject}
            isTaskSelected={isTaskSelected}
            toggleTask={toggleTask}
            toggleProject={toggleProject}
            getProjectNameForTask={getProjectNameForTask}
          />
        ) : (
          <TaskPage
            projects={filteredProjects}
            activeTab={activeTab}
            groupBy={groupBy}
            selectedTasks={selectedTasks}
            toggleTask={toggleTask}
            isTaskSelected={isTaskSelected}
            onAddTask={() => setShowNewTaskModal(true)}
          />
        )}

        {/* Modals */}
        {showNewTaskModal && <NewTaskModal onClose={() => setShowNewTaskModal(false)} onTaskDetailsClick={handleTaskDetailsClick} />}

        {showTaskDetailsPanel && <TaskDetailsPanel onClose={() => setShowTaskDetailsPanel(false)} />}
      </div>
    </div>
  );
}
