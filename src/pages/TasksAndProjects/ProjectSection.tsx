/* eslint-disable @typescript-eslint/no-explicit-any */
import { TaskRow } from "./TaskRow";

export interface ProjectSectionProps {
  groupName: string;
  tasks: any;
  groupBy: string;
}

export function ProjectSection({ groupName, groupBy, tasks }: ProjectSectionProps) {
  return (
    <div className="overflow-hidden">
      {/* Project Header */}
      <div className=" bg-gray-50">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            {groupBy === "assignedTo" ? (
              (() => {
                const [name, image] = groupName.split("#"); // extract
                return (
                  <div className="flex items-center gap-2">
                    <img src={image} alt={name} className="w-8 h-8 rounded-full object-cover" />
                    <h3 className="font-bold text-xl text-[#4E53B1]">{name}</h3>
                  </div>
                );
              })()
            ) : (
              <h3 className="font-bold text-xl text-[#4E53B1]">{groupName}</h3>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-200 border-t border-slate-300">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-[#4E53B1]  tracking-wide w-28">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-[#4E53B1]  tracking-wide">Status</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-[#4E53B1]  tracking-wide">Label</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-[#4E53B1]  tracking-wide">Start time</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-[#4E53B1]  tracking-wide">Due date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-[#4E53B1]  tracking-wide">Assigned to</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-[#4E53B1]  tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tasks.map((task: any) => (
              <TaskRow key={task?.id} task={task} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
