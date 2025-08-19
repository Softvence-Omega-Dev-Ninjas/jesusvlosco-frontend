import { Button } from "@/components/ui/button";
import { NewTaskModal } from "./NewTaskModal";

interface TaskOverviewProps {
  setTaskStatus: React.Dispatch<React.SetStateAction<"" | "OPEN" | "DONE">>;
  taskStatus: "" | "OPEN" | "DONE";
  analytics: { total: number; done: number; open: number };
  overDueTasks: any;
}

export function TaskOverview({ taskStatus, setTaskStatus, analytics, overDueTasks }: TaskOverviewProps) {
  // const [activeTab, setActiveTab] = useState<"" | "OPEN" | "DONE">("");

  const handleTabClick = (tab: "" | "OPEN" | "DONE") => {
    setTaskStatus(tab);
    // onFilterChange?.(tab);
  };
  // console.log("änalytics=========>", analytics);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-gray-600 font-medium">The view contains</span>

        <button
          onClick={() => handleTabClick("")}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
            taskStatus === ""
              ? "bg-[#C8CAE7] border border-[#4E53B1] rounded-full px-3 py-2 text-[#4E53B1]"
              : "bg-transparent border border-slate-300 rounded-full px-3 py-2 text-slate-500"
          }`}
        >
          {analytics?.total} tasks in total
        </button>

        <button
          onClick={() => handleTabClick("OPEN")}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
            taskStatus === "OPEN"
              ? "bg-[#C8CAE7] border border-[#4E53B1] rounded-full px-3 py-2 text-[#4E53B1]"
              : "bg-transparent border border-slate-300 rounded-full px-3 py-2 text-slate-500"
          }`}
        >
          {analytics?.open} open tasks
        </button>

        <button
          onClick={() => handleTabClick("DONE")}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
            taskStatus === "DONE"
              ? "bg-[#C8CAE7] border border-[#4E53B1] rounded-full px-3 py-2 text-[#4E53B1]"
              : "bg-transparent border border-slate-300 rounded-full px-3 py-2 text-slate-500"
          }`}
        >
          {analytics?.done} done tasks
        </button>
      </div>

      <div className="flex items-center gap-2">
        <p className="text-red-500 px-3 py-2 rounded-full bg-[#FFE6E7] flex items-center gap-1">
          <span className="bg-red-500 rounded-full w-4 h-4 text-white flex items-center justify-center text-sm font-medium">
            {overDueTasks?.length}
          </span>
          <span className="text-sm font-medium">Overdue tasks</span>
        </p>
        {/* <Button className="bg-indigo-600 hover:bg-indigo-700 w-fit">➕ Add Task</Button> */}
        <NewTaskModal trigger={<Button className="bg-[#4E53B1] text-white w-fit">+ Add Task</Button>} />
      </div>
    </div>
  );
}
