import React from "react";

export const ShiftNotifications: React.FC = () => {
  const notifications = [
    {
      id: "1",
      message: "New shift schedule has been published",
      time: "Yesterday",
    },
    {
      id: "2",
      message: "Robert Fox has been assigned to the closing shift",
      time: "1 hour ago",
    },
    {
      id: "3",
      message: "New shift schedule has been published",
      time: "Yesterday",
    },
  ];

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold mb-4">Shift Notification</h3>
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="text-sm hover:bg-gray-50 p-2 rounded transition-colors"
          >
            <div className="font-medium">{notification.message}</div>
            <div className="text-xs text-gray-500 mt-1">
              {notification.time}
            </div>
          </div>
        ))}
      </div>
      <button className="w-full text-center text-indigo-600 text-sm mt-4 hover:text-indigo-800 transition-colors">
        End of notification
      </button>
    </div>
  );
};
