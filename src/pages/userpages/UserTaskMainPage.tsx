
// export default function UserTaskMainPage() {
//     // note: i start work on the page 
//     return (
//         <div>UserTaskMainPage</div>
//     )
// }


// "use client"

"use client"

import { useState, useMemo } from "react"
import { Calendar, List, Search, Activity, MessageSquare } from "lucide-react"

interface Task {
  id: string
  name: string
  status: "Running" | "Open" | "Overdue" | "Done" | "Submitted"
  label: string
  startTime: string
  dueDate: string
  assignedTo: string
  projectId: string
  createdDate: Date
}

interface Project {
  id: string
  name: string
  tasks: Task[]
}

const mockData: Project[] = [
  {
    id: "project1",
    name: "Project 1",
    tasks: [
      {
        id: "task1-1",
        name: "Task 1",
        status: "Running",
        label: "General Tasks",
        startTime: "23/06/25 at 12:00 am",
        dueDate: "23/06/25 at 12:00 am",
        assignedTo: "John Doe",
        projectId: "project1",
        createdDate: new Date(2024, 4, 25),
      },
      {
        id: "task1-2",
        name: "Task 2",
        status: "Open",
        label: "Development",
        startTime: "24/06/25 at 12:00 am",
        dueDate: "24/06/25 at 12:00 am",
        assignedTo: "Jane Smith",
        projectId: "project1",
        createdDate: new Date(2024, 4, 26),
      },
      {
        id: "task1-3",
        name: "Task 3",
        status: "Overdue",
        label: "Testing",
        startTime: "25/06/25 at 12:00 am",
        dueDate: "25/06/25 at 12:00 am",
        assignedTo: "Bob Wilson",
        projectId: "project1",
        createdDate: new Date(2024, 4, 27),
      },
      {
        id: "task1-4",
        name: "Task 4",
        status: "Done",
        label: "Design",
        startTime: "26/06/25 at 12:00 am",
        dueDate: "26/06/25 at 12:00 am",
        assignedTo: "Alice Brown",
        projectId: "project1",
        createdDate: new Date(2024, 4, 28),
      },
    ],
  },
  {
    id: "project2",
    name: "Project 2",
    tasks: [
      {
        id: "task2-1",
        name: "Task 1",
        status: "Running",
        label: "General Tasks",
        startTime: "27/06/25 at 12:00 am",
        dueDate: "27/06/25 at 12:00 am",
        assignedTo: "John Doe",
        projectId: "project2",
        createdDate: new Date(2024, 4, 29),
      },
      {
        id: "task2-2",
        name: "Task 2",
        status: "Open",
        label: "Research",
        startTime: "28/06/25 at 12:00 am",
        dueDate: "28/06/25 at 12:00 am",
        assignedTo: "Jane Smith",
        projectId: "project2",
        createdDate: new Date(2024, 4, 30),
      },
      {
        id: "task2-3",
        name: "Task 3",
        status: "Overdue",
        label: "Development",
        startTime: "29/06/25 at 12:00 am",
        dueDate: "29/06/25 at 12:00 am",
        assignedTo: "Bob Wilson",
        projectId: "project2",
        createdDate: new Date(2024, 5, 1),
      },
    ],
  },
  {
    id: "project3",
    name: "Project 3",
    tasks: [
      {
        id: "task3-1",
        name: "Task 1",
        status: "Running",
        label: "General Tasks",
        startTime: "30/06/25 at 12:00 am",
        dueDate: "30/06/25 at 12:00 am",
        assignedTo: "Alice Brown",
        projectId: "project3",
        createdDate: new Date(2024, 5, 2),
      },
      {
        id: "task3-2",
        name: "Task 2",
        status: "Open",
        label: "Design",
        startTime: "01/07/25 at 12:00 am",
        dueDate: "01/07/25 at 12:00 am",
        assignedTo: "John Doe",
        projectId: "project3",
        createdDate: new Date(2024, 5, 3),
      },
      {
        id: "task3-3",
        name: "Task 3",
        status: "Overdue",
        label: "Testing",
        startTime: "02/07/25 at 12:00 am",
        dueDate: "02/07/25 at 12:00 am",
        assignedTo: "Jane Smith",
        projectId: "project3",
        createdDate: new Date(2024, 5, 4),
      },
      {
        id: "task3-4",
        name: "Task 4",
        status: "Done",
        label: "Development",
        startTime: "03/07/25 at 12:00 am",
        dueDate: "03/07/25 at 12:00 am",
        assignedTo: "Bob Wilson",
        projectId: "project3",
        createdDate: new Date(2024, 5, 5),
      },
      {
        id: "task3-5",
        name: "Task 5",
        status: "Submitted",
        label: "Research",
        startTime: "04/07/25 at 12:00 am",
        dueDate: "04/07/25 at 12:00 am",
        assignedTo: "Alice Brown",
        projectId: "project3",
        createdDate: new Date(2024, 5, 6),
      },
    ],
  },
  {
    id: "project4",
    name: "Project 4",
    tasks: [
      {
        id: "task4-1",
        name: "Task 1",
        status: "Open",
        label: "Planning",
        startTime: "05/07/25 at 12:00 am",
        dueDate: "05/07/25 at 12:00 am",
        assignedTo: "John Doe",
        projectId: "project4",
        createdDate: new Date(2024, 5, 7),
      },
      {
        id: "task4-2",
        name: "Task 2",
        status: "Running",
        label: "Development",
        startTime: "06/07/25 at 12:00 am",
        dueDate: "06/07/25 at 12:00 am",
        assignedTo: "Jane Smith",
        projectId: "project4",
        createdDate: new Date(2024, 5, 8),
      },
      {
        id: "task4-3",
        name: "Task 3",
        status: "Overdue",
        label: "Testing",
        startTime: "07/07/25 at 12:00 am",
        dueDate: "07/07/25 at 12:00 am",
        assignedTo: "Bob Wilson",
        projectId: "project4",
        createdDate: new Date(2024, 5, 9),
      },
      {
        id: "task4-4",
        name: "Task 4",
        status: "Done",
        label: "General Tasks",
        startTime: "08/07/25 at 12:00 am",
        dueDate: "08/07/25 at 12:00 am",
        assignedTo: "Alice Brown",
        projectId: "project4",
        createdDate: new Date(2024, 5, 10),
      },
    ],
  },
]

export default function UserTaskMainPage() {
  const [activeTab, setActiveTab] = useState<"all" | "submitted">("all")
  const [viewBy, setViewBy] = useState<"list" | "dates">("list")
  const [groupBy, setGroupBy] = useState("title")
  const [dateRange, setDateRange] = useState("All Time")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const allTasks = useMemo(() => {
    return mockData.flatMap((project) => project.tasks)
  }, [])

  // Filter tasks by date range and active tab
  const dateFilteredTasks = useMemo(() => {
    let filtered = allTasks

    // Apply date filtering only if a specific date range is selected
    if (dateRange !== "All Time") {
      let startDate: Date, endDate: Date

      switch (dateRange) {
        case "May 25 - May 30":
          startDate = new Date(2024, 4, 25)
          endDate = new Date(2024, 4, 30)
          break
        case "June 1 - June 7":
          startDate = new Date(2024, 5, 1)
          endDate = new Date(2024, 5, 7)
          break
        case "This Week":
          startDate = new Date(2024, 4, 25)
          endDate = new Date(2024, 5, 7)
          break
        case "This Month":
          startDate = new Date(2024, 4, 1)
          endDate = new Date(2024, 5, 30)
          break
        default:
          return allTasks
      }

      filtered = allTasks.filter((task) => task.createdDate >= startDate && task.createdDate <= endDate)
    }

    // Filter by active tab
    if (activeTab === "submitted") {
      filtered = filtered.filter((task) => task.status === "Submitted")
    } else {
      // "all" tab shows all tasks except submitted (unless specifically searching for submitted)
      filtered = filtered.filter((task) => task.status !== "Submitted")
    }

    return filtered
  }, [allTasks, dateRange, activeTab])

  // Filter by search query and status
  const searchFilteredTasks = useMemo(() => {
    let filtered = dateFilteredTasks

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (task) =>
          task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter) {
      if (statusFilter === "open") {
        filtered = filtered.filter((task) => task.status === "Open" || task.status === "Running")
      } else if (statusFilter === "done") {
        filtered = filtered.filter((task) => task.status === "Done")
      }
    }

    return filtered
  }, [dateFilteredTasks, searchQuery, statusFilter])

  // Group tasks
  const groupedData = useMemo(() => {
    const filteredTasks = searchFilteredTasks

    if (groupBy === "status") {
      const grouped = filteredTasks.reduce(
        (acc, task) => {
          if (!acc[task.status]) {
            acc[task.status] = []
          }
          acc[task.status].push(task)
          return acc
        },
        {} as Record<string, Task[]>,
      )

      return Object.entries(grouped).map(([status, tasks]) => ({
        id: status,
        name: `${status} Tasks`,
        tasks,
      }))
    } else if (groupBy === "assignee") {
      const grouped = filteredTasks.reduce(
        (acc, task) => {
          if (!acc[task.assignedTo]) {
            acc[task.assignedTo] = []
          }
          acc[task.assignedTo].push(task)
          return acc
        },
        {} as Record<string, Task[]>,
      )

      return Object.entries(grouped).map(([assignee, tasks]) => ({
        id: assignee,
        name: `Assigned to ${assignee}`,
        tasks,
      }))
    } else {
      // Group by title (projects)
      const projectsWithFilteredTasks = mockData
        .map((project) => ({
          ...project,
          tasks: project.tasks.filter((task) => filteredTasks.includes(task)),
        }))
        .filter((project) => project.tasks.length > 0)

      return projectsWithFilteredTasks
    }
  }, [searchFilteredTasks, groupBy])

  // Calculate stats from filtered tasks
  const taskStats = useMemo(() => {
    const totalTasks = searchFilteredTasks.length
    const openTasks = searchFilteredTasks.filter((task) => task.status === "Open" || task.status === "Running").length
    const doneTasks = searchFilteredTasks.filter((task) => task.status === "Done").length
    const submittedTasks = searchFilteredTasks.filter((task) => task.status === "Submitted").length

    return { totalTasks, openTasks, doneTasks, submittedTasks }
  }, [searchFilteredTasks])

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Running":
        return "bg-green-100 text-green-800"
      case "Open":
        return "bg-gray-100 text-gray-800"
      case "Overdue":
        return "bg-red-100 text-red-800"
      case "Done":
        return "bg-blue-100 text-blue-800"
      case "Submitted":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleTaskSelect = (taskId: string) => {
    setSelectedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
  }

  const handleProjectSelect = (projectId: string) => {
    const project = groupedData.find((p) => p.id === projectId)
    if (!project) return

    const projectTaskIds = project.tasks.map((task) => task.id)
    const allSelected = projectTaskIds.every((id) => selectedTasks.includes(id))

    if (allSelected) {
      setSelectedTasks((prev) => prev.filter((id) => !projectTaskIds.includes(id)))
    } else {
      setSelectedTasks((prev) => [...new Set([...prev, ...projectTaskIds])])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Task & Projects</h1>
          <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Activity className="w-4 h-4 mr-2" />
            Activity
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "all"
                ? "border-blue-600 text-blue-600 bg-blue-50"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            All Tasks
          </button>
          <button
            onClick={() => setActiveTab("submitted")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "submitted"
                ? "border-blue-600 text-blue-600 bg-blue-50"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Submitted Tasks
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">View by:</span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setViewBy("list")}
                  className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    viewBy === "list"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <List className="w-4 h-4 mr-1" />
                  List
                </button>
                <button
                  onClick={() => setViewBy("dates")}
                  className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    viewBy === "dates"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  Dates
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Group by:</span>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="title">Title</option>
                <option value="status">Status</option>
                <option value="assignee">Assignee</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All Time">All Time</option>
                <option value="May 25 - May 30">May 25 - May 30</option>
                <option value="June 1 - June 7">June 1 - June 7</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">The view contains</span>
          <button
            onClick={() => setStatusFilter(null)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              statusFilter === null ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {taskStats.totalTasks} tasks in total
          </button>
          <button
            onClick={() => setStatusFilter("open")}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
              statusFilter === "open"
                ? "bg-blue-50 text-blue-800 border-blue-200"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {taskStats.openTasks} open tasks
          </button>
          <button
            onClick={() => setStatusFilter("done")}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
              statusFilter === "done"
                ? "bg-blue-50 text-blue-800 border-blue-200"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {taskStats.doneTasks} done tasks
          </button>
          <button
            onClick={() => setStatusFilter("submitted")}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
              statusFilter === "submitted"
                ? "bg-blue-50 text-blue-800 border-blue-200"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {taskStats.submittedTasks} submitted tasks
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-blue-600">
              {groupBy === "title" ? "Project List" : groupBy === "status" ? "Tasks by Status" : "Tasks by Assignee"}
            </h2>
          </div>

          {/* Content */}
          <div className="bg-white">
            {groupedData.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No tasks found matching the current filters.</div>
            ) : (
              groupedData.map((group, groupIndex) => (
                <div key={group.id} className={groupIndex > 0 ? "border-t border-gray-200" : ""}>
                  {/* Project Header */}
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={group.tasks.every((task) => selectedTasks.includes(task.id))}
                          onChange={() => handleProjectSelect(group.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <h3 className="text-base font-medium text-blue-600">{group.name}</h3>
                      </div>
                      <div className="flex items-center space-x-24 text-sm font-medium text-blue-600">
                        <span>Status</span>
                        <span>Label</span>
                        <span>Start time</span>
                        <span>Due date</span>
                        <span>Assigned to</span>
                      </div>
                    </div>
                  </div>

                  {/* Tasks */}
                  <div className="bg-white">
                    {group.tasks.map((task, taskIndex) => (
                      <div
                        key={task.id}
                        className={`px-6 py-3 flex items-center justify-between hover:bg-gray-50 ${
                          taskIndex < group.tasks.length - 1 ? "border-b border-gray-100" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <input
                            type="checkbox"
                            checked={selectedTasks.includes(task.id)}
                            onChange={() => handleTaskSelect(task.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-900 min-w-[60px]">{task.name}</span>
                          <MessageSquare className="w-4 h-4 text-gray-400 ml-2" />
                        </div>

                        <div className="flex items-center space-x-24">
                          <div className="min-w-[80px] flex justify-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                                task.status,
                              )}`}
                            >
                              {task.status}
                            </span>
                          </div>
                          <div className="min-w-[120px] flex justify-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {task.label}
                            </span>
                          </div>
                          <div className="min-w-[140px] text-sm text-gray-600 text-center">{task.startTime}</div>
                          <div className="min-w-[140px] text-sm text-red-600 text-center">{task.dueDate}</div>
                          <div className="min-w-[100px] flex justify-center">
                            <button className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                              View Task
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
