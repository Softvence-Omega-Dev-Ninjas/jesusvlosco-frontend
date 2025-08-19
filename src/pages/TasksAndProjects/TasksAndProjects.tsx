import { useState } from "react";
import { TaskHeader } from "./TaskHeader";
import { FilterControls } from "./FilterControls";
import { TaskOverview } from "./TaskOverview";
import { ProjectSection } from "./ProjectSection";
import { DateRange } from "@/components/TimeOffRequest/EmployeeDetailModal";
import { useGetTasksQuery } from "@/store/api/admin/task-and-projects";
import { FaSpinner } from "react-icons/fa";

// Mock data matching the screenshot
// const mockProjects = [
//   {
//     id: "metro-shopping",
//     name: "Metro Shopping Center",
//     tasks: [
//       {
//         id: "1",
//         name: "Metro Shopping Center",
//         status: "open",
//         label: "General Tasks",
//         startTime: "23/06/25 at 12:00 am",
//         dueDate: "23/06/25 at 12:00 am",
//         assignedTo: { name: "Alex Cooper", avatar: "/diverse-group.png" },
//       },
//       {
//         id: "2",
//         name: "Metro Shopping Center",
//         status: "draft",
//         label: "General Tasks",
//         startTime: "23/06/25 at 12:00 am",
//         dueDate: "23/06/25 at 12:00 am",
//         assignedTo: { name: "Alex Cooper", avatar: "/diverse-group.png" },
//       },
//       {
//         id: "3",
//         name: "Metro Shopping Center",
//         status: "done",
//         label: "General Tasks",
//         startTime: "23/06/25 at 12:00 am",
//         dueDate: "23/06/25 at 12:00 am",
//         assignedTo: { name: "Alex Cooper", avatar: "/diverse-group.png" },
//       },
//     ],
//   },
//   {
//     id: "riverside-apartments",
//     name: "Riverside Apartments",
//     tasks: [
//       {
//         id: "4",
//         name: "Riverside Apartments",
//         status: "open",
//         label: "General Tasks",
//         startTime: "23/06/25 at 12:00 am",
//         dueDate: "23/06/25 at 12:00 am",
//         assignedTo: { name: "Alex Cooper", avatar: "/diverse-group.png" },
//       },
//       {
//         id: "5",
//         name: "Riverside Apartments",
//         status: "done",
//         label: "General Tasks",
//         startTime: "23/06/25 at 12:00 am",
//         dueDate: "23/06/25 at 12:00 am",
//         assignedTo: { name: "Mike Werner", avatar: "/diverse-group.png" },
//       },
//       {
//         id: "6",
//         name: "Riverside Apartments",
//         status: "done",
//         label: "General Tasks",
//         startTime: "23/06/25 at 12:00 am",
//         dueDate: "23/06/25 at 12:00 am",
//         assignedTo: { name: "Alex Cooper", avatar: "/diverse-group.png" },
//       },
//     ],
//   },
//   {
//     id: "tech-campus",
//     name: "Tech Campus Phase 2",
//     tasks: [
//       {
//         id: "7",
//         name: "Tech Campus Phase 2",
//         status: "open",
//         label: "General Tasks",
//         startTime: "23/06/25 at 19:00 am",
//         dueDate: "23/06/25 at 12:00 am",
//         assignedTo: { name: "Alex Cooper", avatar: "/diverse-group.png" },
//       },
//       {
//         id: "8",
//         name: "Tech Campus Phase 2",
//         status: "open",
//         label: "General Tasks",
//         startTime: "23/06/25 at 19:00 am",
//         dueDate: "23/06/25 at 12:00 am",
//         assignedTo: { name: "Alex Cooper", avatar: "/diverse-group.png" },
//       },
//       {
//         id: "9",
//         name: "Tech Campus Phase 2",
//         status: "done",
//         label: "General Tasks",
//         startTime: "23/06/25 at 12:00 am",
//         dueDate: "23/06/25 at 12:00 am",
//         assignedTo: { name: "Alex Chen", avatar: "/diverse-group.png" },
//       },
//     ],
//   },
// ];

export function TasksAndProjects() {
  // const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [groupBy, setGroupBy] = useState("title");
  // const [dateRange, setDateRange] = useState("May 25 - May 30")

  //Manage Calender State.
  // State to manage calendar visibility
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  // State to store selected date range
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null, // Default: 01/01/2025
    endDate: null, // Default: 31/12/2025
  });

  // Handle date range selection from ShiftCalendar
  const handleDateRangeSelect = (selectedRange: DateRange): void => {
    setDateRange(selectedRange);
    setIsCalendarOpen(false); // Close calendar after selection
  };

  //Handle Search Input state
  const [searchQuery, setSearchQuery] = useState("");

  //Task Status
  const [taskStatus, setTaskStatus] = useState<"" | "OPEN" | "DONE">("");
  console.log({ start: dateRange.startDate?.toISOString(), end: dateRange.endDate?.toISOString() });

  // const handleTaskSelect = (taskId: string) => {
  //   setSelectedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]));
  // };

  // const handleAddTask = (projectId: string) => {
  //   console.log("Add task to project:", projectId);
  // };

  const { data: tasks, isLoading } = useGetTasksQuery({
    taskStatus,
    searchQuery,
    groupBy,
    start: dateRange?.startDate?.toISOString(),
    end: dateRange?.endDate?.toISOString(),
  });
  console.log(tasks);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 w-full">
        <FaSpinner className="animate-spin text-4xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto space-y-6">
        <TaskHeader />

        <FilterControls
          groupBy={groupBy}
          setGroupBy={setGroupBy}
          isCalendarOpen={isCalendarOpen}
          setIsCalendarOpen={setIsCalendarOpen}
          handleDateRangeSelect={handleDateRangeSelect}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          dateRange={dateRange}
        />

        <TaskOverview
          setTaskStatus={setTaskStatus}
          taskStatus={taskStatus}
          analytics={tasks?.data?.analytics}
          overDueTasks={tasks?.data?.overdueTasks}
        />

        <div className="space-y-6">
          {tasks?.data?.grouped && Object.keys(tasks.data.grouped).length > 0 ? (
            Object.entries(tasks.data.grouped).map(([groupName, taskList], idx) => (
              <ProjectSection key={idx} groupName={groupName} tasks={taskList} groupBy={groupBy} />
            ))
          ) : (
            <p className="text-center text-gray-500 py-10">No tasks available</p>
          )}
        </div>
      </div>
    </div>
  );
}
