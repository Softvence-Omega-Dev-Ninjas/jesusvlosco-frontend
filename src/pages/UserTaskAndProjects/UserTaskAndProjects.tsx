import { useState } from "react";

import { DateRange } from "@/components/TimeOffRequest/EmployeeDetailModal";
import { FaSpinner } from "react-icons/fa";
import { FilterControls } from "../TasksAndProjects/FilterControls";
import { UserProjectSection } from "./UserProjectSection";
import { useGetallTasksByUsersQuery } from "@/store/api/admin/task-and-projects";
import { UserTaskOverview } from "./UserTaskOverview";

export function UserTaskAndProjects() {
  const [groupBy, setGroupBy] = useState("title");
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  // Handle date range selection from ShiftCalendar
  const handleDateRangeSelect = (selectedRange: DateRange): void => {
    setDateRange(selectedRange);
    setIsCalendarOpen(false);
  };

  //Handle Search Input state
  const [searchQuery, setSearchQuery] = useState("");

  //Task Status
  const [taskStatus, setTaskStatus] = useState<"" | "OPEN" | "DONE">("");
  console.log({ start: dateRange.startDate?.toISOString(), end: dateRange.endDate?.toISOString() });

  const { data: tasks, isLoading } = useGetallTasksByUsersQuery({
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
        {/* <TaskHeader /> */}

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

        <UserTaskOverview setTaskStatus={setTaskStatus} taskStatus={taskStatus} analytics={tasks?.data?.analytics} />

        <div className="space-y-6">
          {tasks?.data?.grouped && Object.keys(tasks.data.grouped).length > 0 ? (
            Object.entries(tasks.data.grouped).map(([groupName, taskList], idx) => (
              <UserProjectSection key={idx} groupName={groupName} tasks={taskList} groupBy={groupBy} />
            ))
          ) : (
            <p className="text-center text-gray-500 py-10">No tasks available</p>
          )}
        </div>
      </div>
    </div>
  );
}
