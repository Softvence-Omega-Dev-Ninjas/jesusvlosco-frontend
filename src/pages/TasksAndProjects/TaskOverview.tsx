/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { NewTaskModal } from "./NewTaskModal";
import { OverdueTasksModal } from "./OverdueTasksModal";

interface TaskOverviewProps {
  setTaskStatus: React.Dispatch<React.SetStateAction<"" | "OPEN" | "DONE">>;
  taskStatus: "" | "OPEN" | "DONE";
  analytics: { total: number; done: number; open: number };
  overDueTasks: any;
}

export function TaskOverview({ taskStatus, setTaskStatus, analytics, overDueTasks }: TaskOverviewProps) {
  const handleTabClick = (tab: "" | "OPEN" | "DONE") => {
    setTaskStatus(tab);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-gray-600 font-medium">The view contains</span>

        <button
          onClick={() => handleTabClick("")}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
            taskStatus === ""
              ? "bg-[#C8CAE7] border border-[#4E53B1] rounded-full px-3 py-2 text-[#4E53B1]"
              : "bg-transparent border border-slate-300 rounded-full px-3 py-2 text-slate-500"
          }`}
        >
          {analytics?.total} tasks in total
        </button>

        <button
          onClick={() => handleTabClick("OPEN")}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
            taskStatus === "OPEN"
              ? "bg-[#C8CAE7] border border-[#4E53B1] rounded-full px-3 py-2 text-[#4E53B1]"
              : "bg-transparent border border-slate-300 rounded-full px-3 py-2 text-slate-500"
          }`}
        >
          {analytics?.open} open tasks
        </button>

        <button
          onClick={() => handleTabClick("DONE")}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
            taskStatus === "DONE"
              ? "bg-[#C8CAE7] border border-[#4E53B1] rounded-full px-3 py-2 text-[#4E53B1]"
              : "bg-transparent border border-slate-300 rounded-full px-3 py-2 text-slate-500"
          }`}
        >
          {analytics?.done} done tasks
        </button>
      </div>

      <div className="flex items-center gap-2">
        <OverdueTasksModal overDueTasks={overDueTasks} />

        <NewTaskModal trigger={<Button className="bg-[#4E53B1] text-white w-fit cursor-pointer">+ Add Task</Button>} />
      </div>
    </div>
  );
}
