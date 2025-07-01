/* eslint-disable @typescript-eslint/no-unused-vars */

// this is new code ............. for testing

import { useState } from "react";
import { Search, Calendar, List } from "lucide-react";
import { FaSortDown } from "react-icons/fa";
import arrowDropDown from "@/assets/arrow_drop_down.svg";

interface Task {
  id: string;
  name: string;
  status: "Open" | "Draft" | "Done" | "Running" | "Overdue";
  label: string;
  startTime: string;
  dueDate: string;
  assignedTo: {
    name: string;
    avatar: string;
  };
}

interface Project {
  id: string;
  name: string;
  tasks: Task[];
}

const projects: Project[] = [
  {
    id: "1",
    name: "project1",
    tasks: [
      {
        id: "1-1",
        name: "task 1",
        status: "Running",
        label: "General Tasks",
        startTime: "23/06/25 at 12:00 am",
        dueDate: "23/06/25 at 12:00 am",
        assignedTo: { name: "Jane Cooper", avatar: "JC" },
      },
      {
        id: "1-2",
        name: "task 2",
        status: "Open",
        label: "General Tasks",
        startTime: "23/06/25 at 12:00 am",
        dueDate: "23/06/25 at 12:00 am",
        assignedTo: { name: "Jane Cooper", avatar: "JC" },
      },
      {
        id: "1-3",
        name: "task 3",
        status: "Overdue",
        label: "General Tasks",
        startTime: "23/06/25 at 12:00 am",
        dueDate: "23/06/25 at 12:00 am",
        assignedTo: { name: "Jane Cooper", avatar: "JC" },
      },
    ],
  },
  {
    id: "2",
    name: "project2",
    tasks: [
      {
        id: "2-1",
        name: "Task 1",
        status: "Overdue",
        label: "General Tasks",
        startTime: "23/06/25 at 12:00 am",
        dueDate: "23/06/25 at 12:00 am",
        assignedTo: { name: "Jane Cooper", avatar: "JC" },
      },
      {
        id: "2-2",
        name: "task 2",
        status: "Open",
        label: "General Tasks",
        startTime: "23/06/25 at 12:00 am",
        dueDate: "23/06/25 at 12:00 am",
        assignedTo: { name: "Wade Warren", avatar: "WW" },
      },
      {
        id: "2-3",
        name: "Task 3",
        status: "Running",
        label: "General Tasks",
        startTime: "23/06/25 at 12:00 am",
        dueDate: "23/06/25 at 12:00 am",
        assignedTo: { name: "Jane Cooper", avatar: "JC" },
      },
    ],
  },
  {
    id: "3",
    name: "project1",
    tasks: [
      {
        id: "3-1",
        name: "Task 1 ",
        status: "Running",
        label: "General Tasks",
        startTime: "23/06/25 at 12:00 am",
        dueDate: "23/06/25 at 12:00 am",
        assignedTo: { name: "Jane Cooper", avatar: "JC" },
      },
      {
        id: "3-2",
        name: "Task 2",
        status: "Open",
        label: "General Tasks",
        startTime: "23/06/25 at 12:00 am",
        dueDate: "23/06/25 at 12:00 am",
        assignedTo: { name: "Jane Cooper", avatar: "JC" },
      },
      {
        id: "3-3",
        name: "Task 3",
        status: "Overdue",
        label: "General Tasks",
        startTime: "23/06/25 at 12:00 am",
        dueDate: "23/06/25 at 12:00 am",
        assignedTo: { name: "Mike Chen", avatar: "MC" },
      },
      {
        id: "3-4",
        name: "task 3",
        status: "Done", // 👈 Changed from "Overdue" to "Done"
        label: "General Tasks",
        startTime: "23/06/25 at 12:00 am",
        dueDate: "23/06/25 at 12:00 am",
        assignedTo: { name: "Jane Cooper", avatar: "JC" },
      },
    ],
  },
];

function TaskAndProject() {
  const [activeTabMain, setActiveTabMain] = useState<"all" | "submitted">(
    "all"
  );
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"tasks" | "open" | "done">(
    "tasks"
  );
  const [groupBy, setGroupBy] = useState<"title" | "label" | "assignedTo">(
    "title"
  );

  // Filter tasks based on active tab
  const filteredProjects = projects.map((project) => {
    const filteredTasks = project.tasks.filter((task) => {
      const statusMatch =
        activeTab === "open"
          ? task.status === "Open" || task.status === "Draft"
          : activeTab === "done"
          ? task.status === "Done"
          : true;

      const submittedMatch =
        activeTabMain === "submitted" ? task.status === "Done" : true;

      return statusMatch && submittedMatch;
    });

    return {
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
      tasks: filteredTasks,
    };
  });

  const totalTasks = projects.reduce(
    (acc, project) => acc + project.tasks.length,
    0
  );
  const openTasks = projects.reduce(
    (acc, project) =>
      acc +
      project.tasks.filter(
        (task) => task.status === "Open" || task.status === "Draft"
      ).length,
    0
  );
  const doneTasks = projects.reduce(
    (acc, project) =>
      acc + project.tasks.filter((task) => task.status === "Done").length,
    0
  );

  const isTaskSelected = (taskId: string) => selectedTasks.includes(taskId);

  const toggleTask = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const areAllSelected = filteredProjects
    .flatMap((p) => p.tasks)
    .every((task) => selectedTasks.includes(task.id));

  const toggleAll = () => {
    const allFilteredTaskIds = filteredProjects.flatMap((p) =>
      p.tasks.map((t) => t.id)
    );
    if (areAllSelected) {
      setSelectedTasks(
        selectedTasks.filter((id) => !allFilteredTaskIds.includes(id))
      );
    } else {
      setSelectedTasks([...new Set([...selectedTasks, ...allFilteredTaskIds])]);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Overdue":
        return "bg-red-100 text-red-800 border border-red-200";
      case "Running":
        return "bg-green-100 text-green-800 border border-green-200";
      case "Done":
        return "bg-green-100 text ";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-yellow-500",
    ];
    return colors[name.length % colors.length];
  };

  const toggleProject = (projectId: string) => {
    setActiveProject(activeProject === projectId ? null : projectId);
  };

  // Find the original project name for a task
  const getProjectNameForTask = (taskId: string) => {
    for (const project of projects) {
      const task = project.tasks.find((t) => t.id === taskId);
      if (task) return project.name;
    }
    return "";
  };

  return (
    <div className="bg-gray-50 p-4 sm:p-6">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl text-[#4E53B1] font-semibold">
            Task & Projects
          </h1>
          <button className="bg-[#4E53B1] text-white px-4 py-2 rounded-2xl text-sm font-medium hover:bg-indigo-700 transition-colors">
            <div className="flex gap-2 items-center">
              <img
                src="../src/assets/menu_open.png"
                alt=""
                className="w-4 h-4"
              />
              <div>Activity</div>
            </div>
          </button>
        </div>
        {/* here add tab button  */}
        <div className="  border-gray-200 ">
          <div className="flex space-x-3">
            <button
              onClick={() => setActiveTabMain("all")}
              className={`px-6 py-3 text-sm font-medium rounded-lg  border-2 transition-colors ${
                activeTabMain === "all"
                  ? "bg-[#4E53B1] px-6 py-3 rounded-lg text-white"
                  : "border-[#C5C5C5] text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              All Tasks
            </button>
            <button
              onClick={() => setActiveTabMain("submitted")}
              className={`px-4 py-3 text-sm font-medium  rounded-lg border-2 transition-colors ${
                activeTabMain === "submitted"
                  ? "bg-[#4E53B1]  text-white border-[#4E53B1]"
                  : "border-[#C5C5C5] text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Submitted Tasks
            </button>
          </div>
        </div>

        {/* Controls */}
        {activeTabMain === "all" && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 border-b border-gray-300 pb-4 sm:pb-0">
            <div className="flex mt-6 mb-6 flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <span className="text-sm text-gray-600">View by:</span>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 text-indigo-600 font-medium text-sm">
                    <List className="w-4 h-4" />
                    <span className="hidden sm:inline">List</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-600 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span className="hidden sm:inline">Dates</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 relative w-full sm:w-auto">
                <span className="text-sm text-gray-600">Group by:</span>
                <select
                  className="text-sm border p-2 rounded-lg border-gray-300 bg-transparent text-gray-900 font-medium focus:outline-none w-full sm:w-auto pr-8"
                  value={groupBy}
                  onChange={(e) =>
                    setGroupBy(
                      e.target.value as "title" | "label" | "assignedTo"
                    )
                  }
                >
                  <option value="title">Title</option>
                  <option value="label">Label</option>
                  <option value="assignedTo">assigned</option>
                </select>

                <img
                  src={arrowDropDown}
                  alt="dropdown icon"
                  className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-3 h-3"
                />
              </div>

              <div className="flex items-center border border-[#4E53B1] rounded-2xl py-1 px-2 gap-2 w-full sm:w-auto">
                <span className="text-sm font-medium text-[#4E53B1]">
                  May 25 - May 30
                </span>
                <FaSortDown className="w-4 h-4 -mt-2 text-[#4E53B1]" />
              </div>
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
            </div>
          </div>
        )}

        {activeTabMain === "all" && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <span className="text-black w-full sm:w-auto">
                The view contains
              </span>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveTab("tasks")}
                  className={`px-6 py-2 rounded-2xl border font-medium ${
                    activeTab === "tasks"
                      ? "bg-[#C8CAE7] text-[#4E53B1] border-[#4E53B1] border-2"
                      : "bg-white text-gray-600 border-gray-300"
                  }`}
                >
                  {totalTasks} Tasks
                </button>

                <button
                  onClick={() => setActiveTab("open")}
                  className={`px-6 py-2 rounded-2xl border font-medium ${
                    activeTab === "open"
                      ? "bg-[#C8CAE7] text-[#4E53B1] border-[#4E53B1] border-2"
                      : "bg-white text-gray-600 border-gray-300"
                  }`}
                >
                  {openTasks} Open tasks
                </button>

                <button
                  onClick={() => setActiveTab("done")}
                  className={`px-6 py-2 rounded-2xl border font-medium ${
                    activeTab === "done"
                      ? "bg-[#C8CAE7] text-[#4E53B1] border-[#4E53B1] border-2"
                      : "bg-white text-gray-600 border-gray-300"
                  }`}
                >
                  {doneTasks} Done tasks
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Projects - Mobile Accordion */}
        <div className="block sm:hidden ">
          {filteredProjects.map(
            (project) =>
              project.tasks.length > 0 && (
                <div
                  key={project.id}
                  className="bg-white mt-4 rounded-lg border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleProject(project.id)}
                    className="w-full px-4 py-3 bg-gray-50 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={project.tasks.every((t) =>
                          isTaskSelected(t.id)
                        )}
                        onChange={() => {
                          if (
                            project.tasks.every((t) => isTaskSelected(t.id))
                          ) {
                            setSelectedTasks(
                              selectedTasks.filter(
                                (id) => !project.tasks.some((t) => t.id === id)
                              )
                            );
                          } else {
                            setSelectedTasks([
                              ...selectedTasks,
                              ...project.tasks.map((t) => t.id),
                            ]);
                          }
                        }}
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
                        <h3 className="text-lg font-medium text-[#4E53B1]">
                          {groupBy === "assignedTo"
                            ? project.tasks[0]?.assignedTo.name
                            : project.name}
                        </h3>
                      </div>
                    </div>
                    <FaSortDown
                      className={`w-4 h-4 text-[#4E53B1] transition-transform ${
                        activeProject === project.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {activeProject === project.id && (
                    <div className="border-t border-gray-200">
                      {project.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-4 border-b border-gray-200"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <input
                              type="checkbox"
                              checked={isTaskSelected(task.id)}
                              onChange={() => toggleTask(task.id)}
                              className="w-4 h-4 text-indigo-600 rounded border-gray-300 mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-gray-900">
                                  {groupBy === "assignedTo"
                                    ? getProjectNameForTask(task.id)
                                    : task.name}
                                </h4>
                                <span
                                  className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                                    task.status
                                  )}`}
                                >
                                  {task.status === "Done"
                                    ? "Completed"
                                    : task.status}
                                </span>
                              </div>
                              <div className="mt-2 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">Label:</span>
                                  <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs">
                                    {task.label}
                                  </span>
                                </div>
                                <div className="mt-1">
                                  <span className="font-medium">Start:</span>{" "}
                                  <span
                                    className={
                                      task.status === "Done"
                                        ? "text-black"
                                        : "text-red-600"
                                    }
                                  >
                                    {task.startTime}
                                  </span>
                                </div>
                                <div className="mt-1">
                                  <span className="font-medium">Due:</span>{" "}
                                  <span
                                    className={
                                      task.status === "Done"
                                        ? "text-black"
                                        : "text-red-600"
                                    }
                                  >
                                    {task.dueDate}
                                  </span>
                                </div>
                                {groupBy !== "assignedTo" && (
                                  <div className="mt-2 flex items-center gap-2">
                                    <div>
                                      <button className="px-6 py-3 text-xs font-medium text-white bg-[#4E53B1] rounded-xl cursor-pointer hover:bg-[#30325e] ">
                                        View Task
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
          )}
        </div>

        {/* Projects - Desktop View */}
        <div>
         <h2 className="text-3xl text-[#4E53B1] py-4"> Project List</h2>
        </div>
        <div className="hidden sm:block">
          {filteredProjects.map(
            (project) =>
              project.tasks.length > 0 && (
                <div
                  key={project.id}
                  className="bg-gray-50 mt-4 rounded-lg border border-gray-200 overflow-hidden"
                >
                  <div className="px-6 bg-white py-6  shadow ">
                    <div className="grid  grid-cols-13 gap-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="col-span-1">
                        <input
                          type="checkbox"
                          checked={project.tasks.every((t) =>
                            isTaskSelected(t.id)
                          )}
                          onChange={() => {
                            if (
                              project.tasks.every((t) => isTaskSelected(t.id))
                            ) {
                              setSelectedTasks(
                                selectedTasks.filter(
                                  (id) =>
                                    !project.tasks.some((t) => t.id === id)
                                )
                              );
                            } else {
                              setSelectedTasks([
                                ...selectedTasks,
                                ...project.tasks.map((t) => t.id),
                              ]);
                            }
                          }}
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
                        {groupBy === "assignedTo"
                          ? project.tasks[0]?.assignedTo.name
                          : project.name}
                      </div>
                      <div className="col-span-2 text-[#4E53B1]">Status</div>
                      <div className="col-span-2 text-[#4E53B1]">Label</div>
                      <div className="col-span-2 text-[#4E53B1]">
                        Start time
                      </div>
                      <div className="col-span-2 text-[#4E53B1]">Due date</div>
                      {groupBy !== "assignedTo" && (
                        <div className="col-span-2 text-[#4E53B1] text-right">
                          Assigned to
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="">
                    {project.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="px-6 py-8 hover:bg-gray-50 border-b border-gray-300 transition-colors"
                      >
                        <div className="grid grid-cols-13 gap-6 items-center">
                          <div className="col-span-1">
                            <input
                              type="checkbox"
                              checked={isTaskSelected(task.id)}
                              onChange={() => toggleTask(task.id)}
                              className="w-4 h-4 text-indigo-600 rounded border-gray-300"
                            />
                          </div>
                          <div className="col-span-2 lg:-ml-20 text-sm font-medium text-gray-600">
                            {groupBy === "assignedTo"
                              ? getProjectNameForTask(task.id)
                              : task.name}
                          </div>
                          <div className="col-span-2 flex gap-2">
                            <img
                              className=""
                              src="../src/assets/forum.png"
                              alt=""
                            />
                            {/* <span
                              className={`inline-flex px-6 py-2 text-xs font-medium rounded-full ${getStatusBadge(
                                task.status
                              )}`}
                            >
                              {task.status}
                            </span> */}
                            <span
                              className={`inline-flex px-6 py-2 text-xs font-medium rounded-full ${getStatusBadge(
                                task.status
                              )}`}
                            >
                              {task.status === "Done"
                                ? "Completed"
                                : task.status}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="inline-flex px-8 py-2 text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 rounded-full">
                              {task.label}
                            </span>
                          </div>
                          <div
                            className={`col-span-2 text-sm ${
                              task.status === "Done"
                                ? "text-black"
                                : "text-red-600"
                            }`}
                          >
                            {task.startTime}
                          </div>
                          <div
                            className={`col-span-2 text-sm ${
                              task.status === "Done"
                                ? "text-black"
                                : "text-red-600"
                            }`}
                          >
                            {task.dueDate}
                          </div>
                          {groupBy !== "assignedTo" && (
                            <div className="col-span-2 flex justify-end items-center gap-2">
                              <div>
                                <button className="px-6 py-3 text-xs font-medium text-white bg-[#4E53B1] rounded-xl cursor-pointer hover:bg-[#30325e] ">
                                  View Task
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskAndProject;
