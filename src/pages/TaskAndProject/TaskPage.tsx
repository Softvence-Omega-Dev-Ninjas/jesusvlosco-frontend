import { IProject, ActiveTab, GroupByOption } from "../../types/taskTypes";
import TaskCard from "./TaskCard";
import { Plus } from "lucide-react";

interface TaskPageProps {
  projects: IProject[];
  activeTab: ActiveTab;
  groupBy: GroupByOption;
  selectedTasks: string[];
  toggleTask: (taskId: string) => void;
  isTaskSelected: (taskId: string) => boolean;
  onAddTask: () => void;
}

export default function TaskPage({ projects, activeTab, groupBy, toggleTask, isTaskSelected, onAddTask }: TaskPageProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-[#4E53B1] mb-6">
          {activeTab === "tasks" ? "All Tasks" : activeTab === "open" ? "Open Tasks" : "Done Tasks"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(
            (project) =>
              project.tasks.length > 0 && (
                <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="font-medium text-[#4E53B1]">{groupBy === "assignedTo" ? project.assignedTo?.name : project.name}</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    {project.tasks.map((task) => (
                      <TaskCard key={task.id} task={task} isSelected={isTaskSelected(task.id)} onToggleTask={toggleTask} />
                    ))}
                    <button
                      onClick={onAddTask}
                      className="flex items-center gap-2 text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors"
                    >
                      <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                        <Plus className="w-3 h-3 text-white" />
                      </div>
                      Add Task
                    </button>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}
