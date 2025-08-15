import { ITask } from "../../types/taskTypes";

interface TaskCardProps {
  task: ITask;
  isSelected: boolean;
  onToggleTask: (taskId: string) => void;
}

export default function TaskCard({ task, isSelected, onToggleTask }: TaskCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Draft":
        return "bg-red-100 text-red-800 border border-red-200";
      case "Done":
        return "bg-green-100 text-green-800 border border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  return (
    <div className="border border-gray-200 rounded-md p-3 hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleTask(task.id)}
          className="w-4 h-4 text-indigo-600 rounded border-gray-300 mt-1"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-gray-900">{task.name}</h4>
            <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(task.status)}`}>{task.status}</span>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="font-medium">Label:</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs">{task.label}</span>
            </div>
            <div className="mt-1">
              <span className="font-medium">Start:</span>{" "}
              <span className={task.status === "Done" ? "text-black" : "text-red-600"}>{task.startTime}</span>
            </div>
            <div className="mt-1">
              <span className="font-medium">Due:</span> <span className={task.status === "Done" ? "text-black" : "text-red-600"}>{task.dueDate}</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white ${
                  colors[task.assignedTo.name.length % colors.length]
                }`}
              >
                {task.assignedTo.avatar}
              </div>
              <span className="text-sm text-gray-900">{task.assignedTo.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-yellow-500"];
