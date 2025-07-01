import React from 'react';
import { X, MessageCircle, User } from 'lucide-react';

interface Task {
      id: string;
      title: string;
      dueDate: string;
      category: string;
      assignee: {
            name: string;
            avatar: string;
      };
      comments: number;
      showAssign?: boolean;
}

interface User {
      name: string;
      avatar: string;
}

const OverdueTasks: React.FC = () => {
      const overdueTasks: Task[] = [
            {
                  id: '1',
                  title: 'Metro Shopping Center',
                  dueDate: 'Due Jun 22 at 11:00 am',
                  category: 'General...',
                  assignee: {
                        name: 'Jane Cooper',
                        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
                  },
                  comments: 0,
                  showAssign: true
            },
            {
                  id: '2',
                  title: 'Riverside Apartments',
                  dueDate: 'Due Jun 30 at 10:00 am',
                  category: 'General...',
                  assignee: {
                        name: 'Wade Warren',
                        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
                  },
                  comments: 0,
                  showAssign: true
            },
            {
                  id: '3',
                  title: 'Tech Campus Phase 2',
                  dueDate: 'Due Jun 26 at 09:45 am',
                  category: 'General...',
                  assignee: {
                        name: 'Jane Cooper',
                        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
                  },
                  comments: 0,
                  showAssign: true
            }
      ];

      const assignUsers: User[] = [
            {
                  name: 'Jane',
                  avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
            },
            {
                  name: 'Wade',
                  avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
            },
            {
                  name: 'John',
                  avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
            }
      ];

      return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden max-w-4xl mx-auto">
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                           
                              <h2 className="text-lg font-semibold text-[#4E53B1]">Overdue Tasks</h2>
                        </div>
                  </div>

                  {/* Tasks List */}
                  <div className="divide-y divide-gray-100">
                        {overdueTasks.map((task) => (
                              <div key={task.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                          <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-2">
                                                      <h3 className="font-medium text-gray-900 text-base">{task.title}</h3>
                                                </div>

                                                <div className="flex items-center mb-8 gap-4 text-sm">
                                                      <span className="text-red-500 min-w-max font-medium">{task.dueDate}</span>
                                                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                                            {task.category}
                                                      </span>
                                                      <div className="flex items-center gap-2">
                                                            <img
                                                                  src={task.assignee.avatar}
                                                                  alt={task.assignee.name}
                                                                  className="w-6 h-6 rounded-full object-cover"
                                                            />
                                                            <span className="text-gray-700 font-medium">{task.assignee.name}</span>
                                                      </div>
                                                      <div className="flex items-center gap-1 text-gray-500">
                                                            <MessageCircle className="w-4 h-4" />
                                                            <span>{task.comments} Comments</span>
                                                      </div>
                                                </div>
                                          </div>

                                          
                                    </div>
                              </div>
                        ))}
                  </div>

                 
            </div>
      );
};

export default OverdueTasks;