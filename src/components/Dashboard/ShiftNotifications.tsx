import React from "react";

export const ShiftNotifications: React.FC = () => {
  const notifications = [
    {
      id: "1",
      message: "New shift schedule has been published",
      time: "Yesterday",
      isHighlighted: true,
    },
    {
      id: "2",
      message: "Robert Fox has been assigned to the closing shift",
      time: "1 hour ago",
      isHighlighted: false,
    },
    {
      id: "3",
      message: "New shift schedule has been published",
      time: "Yesterday",
      isHighlighted: false,
    },
    // Add more notifications here to test scroll
    {
      id: "4",
      message: "Shift updated",
      time: "2 days ago",
      isHighlighted: false,
    },
    {
      id: "5",
      message: "Schedule finalized",
      time: "3 days ago",
      isHighlighted: false,
    },
    {
      id: "6",
      message: "New employee added",
      time: "4 days ago",
      isHighlighted: false,
    },
  ];

  const shouldScroll = notifications.length > 5;

  return (
    <div className="rounded-2xl border border-gray-200 w-full mx-auto">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-2xl font-bold text-primary">Shift Notification</h3>
      </div>

      <div
        className={`divide-y divide-gray-100 p-4 flex gap-2 flex-col ${
          shouldScroll ? "max-h-[400px] overflow-y-auto" : ""
        }`}
      >
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 hover:bg-gray-50 cursor-pointer rounded-xl transition-colors ${
              notification.isHighlighted ? "bg-[#E7F1FF]" : " bg-white"
            }`}
          >
            <div className="text-xl font-medium text-[#484848] leading-relaxed mb-2">
              {notification.message}
            </div>
            <div className="text-xs text-gray-500">{notification.time}</div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100">
        <button className="w-full text-center text-primary text-sm transition-colors font-medium">
          End of notification
        </button>
      </div>
    </div>
  );
};
