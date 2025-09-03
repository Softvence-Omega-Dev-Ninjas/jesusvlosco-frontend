import React, { useRef, useState, useEffect } from "react";
import { Bell, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import UserDropdown from "./User/UserDropdown";

// Notification type definition
type NotificationType = {
  id: string;
  type: string;
  title: string;
  message: string;
  meta: Record<string, any>;
  createdAt: string;
  updatedAt: string;
};

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const location = useLocation();
  let pageTitle = "Dashboard";
  // Split the path after /user/ and use the last segment (if any)
  const userPath = location.pathname.split("/user/")[1];
  if (userPath) {
    const segments = userPath.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    if (lastSegment) {
      pageTitle = lastSegment
        .split("-")
        .map(
          (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        )
        .join(" ");
    }
  }

  // Notification data and dropdown logic
  const [showNotifications, setShowNotifications] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showNotifications) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  const notificationData: NotificationType[] = [
    {
      id: "c19ce5db-e62f-47a9-bc30-eff234de4232",
      type: "UrgentShiftChanged",
      title: "Urgent Shift Changed",
      message:
        "Shift Notification for New Test Shift on Fri Sep 05 2025 11:58:00 GMT+0000 (Coordinated Universal Time)",
      meta: {
        date: "2025-09-05T06:00:00.000Z",
        status: "URGENT_SHIFT_CHANGED",
        performedBy: "SYSTEM",
      },
      createdAt: "2025-09-02T11:59:20.468Z",
      updatedAt: "2025-09-02T11:59:20.469Z",
    },
    {
      id: "90decd72-b00e-447c-827a-c370d2c72a68",
      type: "Shift",
      title: "New Shift Assigned",
      message:
        "Shift Notification for New Test Shift on Fri Sep 05 2025 11:58:00 GMT+0000 (Coordinated Universal Time)",
      meta: {
        date: "2025-09-05T06:00:00.000Z",
        status: "ASSIGNED",
        performedBy: "SYSTEM",
      },
      createdAt: "2025-09-02T11:59:10.247Z",
      updatedAt: "2025-09-02T11:59:10.248Z",
    },
    {
      id: "336e76fd-de04-4aba-97d6-00f72064618a",
      type: "Shift",
      title: "New Shift Assigned",
      message:
        "Shift Notification for Testing Timezone on Sun Sep 07 2025 23:42:00 GMT+0000 (Coordinated Universal Time)",
      meta: {
        date: "2025-09-08T01:42:00.000Z",
        status: "ASSIGNED",
        performedBy: "SYSTEM",
      },
      createdAt: "2025-09-02T11:42:26.105Z",
      updatedAt: "2025-09-02T11:42:26.106Z",
    },
    {
      id: "03e3fe75-83eb-4da6-9a99-5aa428311501",
      type: "Announcement",
      title: "System Maintenance Notice",
      message: "We’ll be performing maintenance",
      meta: {
        performedBy: "fb57eb85-bc30-4b45-9834-bbf0b035f3e0",
        publishedAt: "2025-08-31T05:48:31.473Z",
        announcementId: "1769c363-a41a-47d3-9b14-d5297a97f107",
      },
      createdAt: "2025-08-31T05:50:14.198Z",
      updatedAt: "2025-08-31T05:50:14.198Z",
    },
  ];

  return (
    <header className="bg-white  border-b border-gray-200 px-6 py-4 rounded-2xl md:mx-2 br">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Page title */}
        <div className="flex-1 lg:flex-none">
          <h1 className="md:text-2xl font-semibold text-gray-900 md:ml-4 lg:ml-0">
            {pageTitle}
          </h1>
        </div>

        {/* Search and user section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              ref={bellRef}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 relative"
              onClick={() => setShowNotifications((v) => !v)}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            {showNotifications && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-80 max-w-xs bg-white border border-gray-200 rounded-lg shadow-lg z-50"
              >
                <div className="p-3 border-b font-semibold text-gray-700">
                  Notifications
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notificationData.length === 0 ? (
                    <div className="p-4 text-gray-400 text-center text-sm">
                      No notifications
                    </div>
                  ) : (
                    notificationData.map((notif) => (
                      <div
                        key={notif.id}
                        className="px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 transition"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-medium">
                            {notif.type}
                          </span>
                          <span className="text-xs text-gray-400 ml-auto">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="font-semibold text-gray-800 text-sm mt-1">
                          {notif.title}
                        </div>
                        <div className="text-xs text-gray-600 mt-0.5">
                          {notif.message}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User profile */}
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};
