
import { useState } from "react";


interface ActivityItem {
      id: string;
      time: string;
      user: {
            name: string;
            avatar: string;
            initials: string;
            color: string;
      };
      action: string;
      type: 'completed' | 'viewed' | 'edited' | 'created';
}

const activityData: ActivityItem[] = [
      {
            id: '1',
            time: '12:37 am',
            user: {
                  name: 'Jane Cooper',
                  avatar: '',
                  initials: 'JC',
                  color: 'bg-blue-500'
            },
            action: 'has completed a task',
            type: 'completed'
      },
      {
            id: '2',
            time: '12:32 am',
            user: {
                  name: 'Robert Fox',
                  avatar: '',
                  initials: 'RF',
                  color: 'bg-green-500'
            },
            action: 'has viewed the task',
            type: 'viewed'
      },
      {
            id: '3',
            time: '11:38 am',
            user: {
                  name: 'Admin',
                  avatar: '',
                  initials: 'AD',
                  color: 'bg-purple-500'
            },
            action: 'edited a task',
            type: 'edited'
      },
      {
            id: '4',
            time: '12:30 am',
            user: {
                  name: 'Admin',
                  avatar: '',
                  initials: 'AD',
                  color: 'bg-purple-500'
            },
            action: 'created a task',
            type: 'created'
      },
      {
            id: '5',
            time: '12:00 am',
            user: {
                  name: 'Admin',
                  avatar: '',
                  initials: 'AD',
                  color: 'bg-purple-500'
            },
            action: 'completed a task',
            type: 'completed'
      }
];

export default function ActivityLog() {
      const [showActivity, setShowActivity] = useState(false);
      const [selectedDate, setSelectedDate] = useState('19/06');

      const toggleActivity = () => {
            setShowActivity(!showActivity);
      };

      return (
            <div className="relative">
                  <button
                        onClick={toggleActivity}
                        className="bg-[#4E53B1] cursor-pointer text-white px-4 py-2 rounded-2xl text-sm font-medium hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                        <div className="flex gap-2 items-center">
                              <img src="../src/assets/menu_open.png" alt="" className="w-4 h-4" />
                              <div>Activity</div>
                        </div>
                  </button>

                  {showActivity && (
                        <>
                              {/* Backdrop */}
                              <div
                                    className="fixed inset-0  z-40"
                                    onClick={toggleActivity}
                              />

                              {/* Activity Panel */}
                              <div className=" sm:absolute right-0 left-0 sm:left-auto bottom-0 sm:bottom-auto sm:top-full mt-2 sm:mt-0 w-full sm:w-96 lg:w-110 bg-white border border-gray-200 rounded-t-xl sm:rounded-xl shadow-xl z-50 overflow-hidden">
                                    {/* Header */}
                                    <div className="p-4 sm:p-6 border-b border-gray-100">
                                          <div className="flex items-center justify-between mb-4">
                                                <div className="flex gap-2 items-center">
                                                      <button onClick={toggleActivity} className="sm:hidden">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                      </button>
                                                      <h1 className="text-lg font-semibold text-gray-900">Activity log</h1>
                                                </div>
                                                <button
                                                      onClick={toggleActivity}
                                                      className="hidden sm:block text-gray-400 hover:text-gray-600 transition-colors"
                                                >
                                                      ×
                                                </button>
                                          </div>

                                          {/* Date Filter */}
                                          <div className="flex items-center gap-2">
                                                <button className="flex border items-center gap-2 px-3 sm:px-4 py-1 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-[#4E53B1] transition-colors">
                                                      <span>{selectedDate}</span>
                                                </button>
                                                <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                                                      <img className="h-6 sm:h-8" src="../src/assets/activity.png" alt="" />
                                                </button>
                                          </div>
                                    </div>

                                    {/* Activity Timeline */}
                                    <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto">
                                          <div className="p-4 sm:p-6 space-y-4">
                                                {activityData.map((activity) => (
                                                      <div key={activity.id} className="flex items-start gap-3 group">
                                                            {/* Time */}
                                                            <div className="w-12 sm:w-16 mt-1 flex-shrink-0">
                                                                  <div className="text-xs font-medium text-gray-900">
                                                                        {activity.time}
                                                                  </div>
                                                            </div>


                                                            <div className="w-8 h-8 mt-1  bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                                                                  {/* <FileText className="w-3.5 h-3.5 text-gray-400" /> */}
                                                                  <img src="../src/assets/nest.png" alt="" />
                                                            </div>

                                                            {/* Avatar */}
                                                            <div className="flex-shrink-0 mt-1">
                                                                  <div className={`w-6 h-6 sm:w-8 sm:h-8 ${activity.user.color} rounded-full flex items-center justify-center text-white text-xs font-medium shadow-sm`}>
                                                                        {activity.user.initials}
                                                                  </div>
                                                            </div>

                                                            {/* Activity Description */}
                                                            <div className="flex-1 pt-1 min-w-max  overflow-hidden">
                                                                  <div className="text-sm text-gray-900 truncate">
                                                                        <span className="font-medium">{activity.user.name}</span>
                                                                        <span className="text-gray-600 ml-1">{activity.action}</span>
                                                                  </div>
                                                            </div>
                                                      </div>
                                                ))}
                                          </div>
                                    </div>
                              </div>
                        </>
                  )}
            </div>
      );
}