import { Task } from "./types";

interface TaskListProps {
  title: string;
  tasks: Task[];
  showViewAll?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ title, tasks }) => {
  return (
    <div className="bg-white rounded-2xl p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-[#484848]">{title}</h3>
        {/* {showViewAll && (
          <button className="text-primary cursor-pointer font-semibold flex items-center text-lg">
            View All
            <svg
              className="w-5 h-5 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )} */}
      </div>
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div key={index} className="bg-[#F9FAFB]  py-3 rounded-lg px-1">
            <div className="flex justify-between items-center px-4.5 py-3.5">
              <span className="text-[#484848] font-normal text-base">
                {task.title}
              </span>
              <span
                className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                  task.status === "OPEN"
                    ? "bg-[#FFE7DA] text-primary"
                    : "bg-[#E8E6FF] text-primary"
                }`}
              >
                {task.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
