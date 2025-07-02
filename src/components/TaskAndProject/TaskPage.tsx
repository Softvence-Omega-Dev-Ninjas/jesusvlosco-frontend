
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import NewTaskModal from './NewTaskModal';

interface Task {
      id: string;
      name: string;
      status: 'Open' | 'Draft' | 'Done';
      label: string;
      startTime: string;
      dueDate: string;
      assignedTo: {
            name: string;
            avatar: string;
      };
      title?: string;
}

interface Project {
      id: string;
      name: string;
      tasks: Task[];
      assignedTo?: {
            name: string;
            avatar: string;
      };
}

interface TaskPageProps {
      projects: Project[];
      activeTab: 'tasks' | 'open' | 'done';
      groupBy: 'title' | 'label' | 'assignedTo';
      selectedTasks: string[];
      toggleTask: (taskId: string) => void;
      isTaskSelected: (taskId: string) => boolean;
}

const TaskPage: React.FC<TaskPageProps> = ({
      projects,
      activeTab,
      groupBy,
      selectedTasks,
      toggleTask,
      isTaskSelected
}) => {
      const days = [
            { day: "Sun", date: "25", month: "May" },
            { day: "Mon", date: "26", month: "May" },
            { day: "Tue", date: "27", month: "May" },
            { day: "Wed", date: "28", month: "May" },
            { day: "Thu", date: "29", month: "May" },
            { day: "Fri", date: "30", month: "May" },
      ];

      const getStatusBadge = (status: string) => {
            switch (status) {
                  case 'Open':
                        return 'bg-blue-100 text-blue-700 border border-blue-200';
                  case 'Draft':
                        return 'bg-red-100 text-red-700 border border-red-200';
                  case 'Done':
                        return 'bg-green-100 text-green-700 border border-green-200';
                  default:
                        return 'bg-gray-100 text-gray-700 border border-gray-200';
            }
      };

      const toggleAllTasks = () => {
            const allTaskIds = projects.flatMap(project => project.tasks.map(task => task.id));
            if (selectedTasks.length === allTaskIds.length) {
                  // Deselect all
                  toggleTask(allTaskIds[0]); // This will trigger the parent to deselect all
            } else {
                  // Select all
                  allTaskIds.forEach(taskId => {
                        if (!isTaskSelected(taskId)) {
                              toggleTask(taskId);
                        }
                  });
            }
      };

      const handleTaskDetailsClick = () => {
            setShowTaskDetailsPanel(true);
            setShowNewTaskModal(false);
        };


 const [showNewTaskModal, setShowNewTaskModal] = useState(false);
      const [showTaskDetailsPanel, setShowTaskDetailsPanel] = useState(false);
      return (
            <div className="min-h-screen bg-gray-50">
                  {/* Top Section with Calendar Days */}
                  <div className="bg-white border-b border-gray-200">
                        <div className="flex">
                              {/* Calendar Days Section */}
                              <div className="w-64 border-r border-gray-200">
                                    <div className="py-4">
                                          {days.map((d, i) => (
                                                <div key={i} className="px-6 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors relative">
                                                      <div className="flex items-baseline gap-2">
                                                            <div className="text-xl font-bold text-[#4E53B1]">{d.date}</div>
                                                            <div className="text-2xl font-semibold text-[#4E53B1]">{d.day}</div>
                                                      </div>
                                                      <div className="text-sm text-gray-500">{d.month}</div>
                                                      <div className="absolute right-0 top-0 bottom-0 border-r border-dashed border-gray-300"></div>
                                                </div>
                                          ))}
                                    </div>
                              </div>

                              {/* Right side with Add Task button and dashed lines */}
                              <div className="flex-1 relative">
                                    {/* Add Task Button - positioned at the top right */}
                                    <div className="absolute left-6 top-3 z-10">
                                          <button
                                                onClick={() => setShowNewTaskModal(true)}
                                                className="bg-gray-50 border mt-3 text-[#4E53B1] border-[#9699c9] cursor-pointer px-4 py-2 rounded-2xl text-sm font-medium hover:bg-[#9194d6] transition-colors flex items-center gap-2 sm:ml-auto"
                                          >
                                                <Plus className="w-4 h-4 " />
                                                Add Task
                                          </button>
                                    </div>

                                   

                                    {/* Modals */}
                                    {showNewTaskModal && (
                                          <NewTaskModal
                                                onClose={() => setShowNewTaskModal(false)}
                                          />
                                    )}
                              </div>

                                    {/* Horizontal dashed lines for each day row */}
                                    {days.map((_, i) => (
                                          <div key={i} className="h-[73px] border-b border-dashed border-gray-300 flex items-center px-6">
                                                
                                          </div>
                                    ))}
                                    <div className="h-[73px] border-b border-dashed border-gray-300"></div>
                              </div>
                        </div>
               

                  {/* Main Task Table */}
                  <div className="bg-white">
                        <div className="p-6">
                              <div className="overflow-x-auto">
                                    <table className="w-full">
                                          <thead>
                                                <tr className="border-b border-gray-200">
                                                      <th className="text-left py-4 px-4 w-12">
                                                            <input
                                                                  type="checkbox"
                                                                  checked={projects.length > 0 &&
                                                                        projects.every(project =>
                                                                              project.tasks.every(task => isTaskSelected(task.id))
                                                                        )
                                                                  }
                                                                  onChange={toggleAllTasks}
                                                                  className="w-4 h-4 text-[#4E53B1] border-gray-300 rounded focus:ring-indigo-500"
                                                            />
                                                      </th>
                                                      <th className="text-left py-4 px-4 text-sm font-semibold text-[#4E53B1]">
                                                            {groupBy === 'title' ? 'Title' :
                                                                  groupBy === 'label' ? 'Label' : 'Assigned To'}
                                                      </th>
                                                      <th className="text-left py-4 px-4 text-sm font-semibold text-[#4E53B1]">Status</th>
                                                      <th className="text-left py-4 px-4 text-sm font-semibold text-[#4E53B1]">Label</th>
                                                      <th className="text-left py-4 px-4 text-sm font-semibold text-[#4E53B1]">Start time</th>
                                                      <th className="text-left py-4 px-4 text-sm font-semibold text-[#4E53B1]">Due date</th>
                                                      {groupBy !== 'assignedTo' && (
                                                            <th className="text-left py-4 px-4 text-sm font-semibold text-[#4E53B1]">Assigned to</th>
                                                      )}
                                                </tr>
                                          </thead>
                                          <tbody>
                                                {projects.map((project) => (
                                                      project.tasks.map((task, index) => (
                                                            <tr key={task.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index === 0 ? 'border-t' : ''}`}>
                                                                  <td className="py-4 px-4">
                                                                        <input
                                                                              type="checkbox"
                                                                              checked={isTaskSelected(task.id)}
                                                                              onChange={() => toggleTask(task.id)}
                                                                              className="w-4 h-4 text-[#4E53B1] border-gray-300 rounded focus:ring-indigo-500"
                                                                        />
                                                                  </td>
                                                                  <td className="py-4 px-4">
                                                                        <div className="flex items-center gap-2">
                                                                              <span className="text-sm text-gray-900 font-medium">
                                                                                    {groupBy === 'title' ? task.title || task.name :
                                                                                          groupBy === 'label' ? task.label :
                                                                                                task.assignedTo.name}
                                                                              </span>
                                                                        </div>
                                                                  </td>
                                                                  <td className="py-4 px-4">
                                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(task.status)}`}>
                                                                              {task.status}
                                                                        </span>
                                                                  </td>
                                                                  <td className="py-4 px-4">
                                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                                                                              {task.label}
                                                                        </span>
                                                                  </td>
                                                                  <td className="py-4 px-4">
                                                                        <span className={`text-xs ${task.status === 'Done' ? 'text-black' : 'text-red-500'}`}>
                                                                              {task.startTime}
                                                                        </span>
                                                                  </td>
                                                                  <td className="py-4 px-4">
                                                                        <span className={`text-xs ${task.status === 'Done' ? 'text-black' : 'text-red-500'}`}>
                                                                              {task.dueDate}
                                                                        </span>
                                                                  </td>
                                                                  {groupBy !== 'assignedTo' && (
                                                                        <td className="py-4 px-4">
                                                                              <div className="flex items-center gap-2">
                                                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                                                                                          {task.assignedTo.avatar ? (
                                                                                                <img
                                                                                                      src={task.assignedTo.avatar}
                                                                                                      alt={task.assignedTo.name}
                                                                                                      className="w-full h-full rounded-full object-cover"
                                                                                                />
                                                                                          ) : (
                                                                                                task.assignedTo.name.charAt(0)
                                                                                          )}
                                                                                    </div>
                                                                                    <span className="text-sm text-gray-700 font-medium">{task.assignedTo.name}</span>
                                                                              </div>
                                                                        </td>
                                                                  )}
                                                            </tr>
                                                      ))
                                                ))}
                                          </tbody>
                                    </table>
                              </div>
                        </div>
                  </div>
            </div>
      );
};

export default TaskPage;