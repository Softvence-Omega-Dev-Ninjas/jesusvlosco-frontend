import { FaSpinner } from "react-icons/fa";
import { useGetallTasksByUsersQuery } from "@/store/api/admin/task-and-projects";
import { SubmittedTaskRow } from "./SubmittedTaskRow";

const UserSubmittedTask = () => {
  const {
    data: tasks,
    isLoading,
    isFetching,
  } = useGetallTasksByUsersQuery({
    taskStatus: "DONE",
    // searchQuery,
    // groupBy: "title",
    // start: dateRange?.startDate?.toISOString(),
    // end: dateRange?.endDate?.toISOString(),
  });
  console.log("=============>", tasks);
  return (
    <div>
      {isLoading || isFetching ? (
        <div className="flex items-center justify-center h-96 w-full">
          <FaSpinner className="animate-spin text-4xl" />
        </div>
      ) : (
        <>
          {/* <TaskOverview
            setTaskStatus={setTaskStatus}
            taskStatus={taskStatus}
            analytics={tasks?.data?.analytics}
            overDueTasks={tasks?.data?.overdueTasks}
          /> */}
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-200 border-t border-slate-300">
                  <tr>
                    <th className="px-4 py-2 text-left text-md font-medium text-[#4E53B1]  tracking-wide w-28">Task List</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-[#4E53B1]  tracking-wide">Status</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-[#4E53B1]  tracking-wide">Label</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-[#4E53B1]  tracking-wide">Start time</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-[#4E53B1]  tracking-wide">Due date</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-[#4E53B1]  tracking-wide">Assigned to</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tasks?.data?.data?.map((task: any) => (
                    <SubmittedTaskRow key={task?.id} task={task} />
                  ))}
                </tbody>
              </table>
            </div>
            {/* {tasks?.data?.data?.map((task, idx) => (
                <UserSubmittedProjectTask key={idx} groupName={groupName} tasks={taskList} />
              ))
            ) : (
              <p className="text-center text-gray-500 py-10">No tasks available</p>
            )} */}
          </div>
        </>
      )}
    </div>
  );
};

export default UserSubmittedTask;
