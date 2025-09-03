import React, { useRef, useState, useEffect } from "react";
import { Bell, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import UserDropdown from "./User/UserDropdown";
import { useGetNotificationDataQuery } from "@/store/api/user/getUserDashboardData";

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
  // Split the path after /user/ and use the second segment if multiple exist
  const userPath = location.pathname.split("/user/")[1];
  if (userPath) {
    const segments = userPath.split("/").filter(Boolean);
    let targetSegment = "";
    if (segments.length >= 2) {
      targetSegment = segments[1];
    } else if (segments.length === 1) {
      targetSegment = segments[0];
    }
    if (targetSegment) {
      pageTitle = targetSegment
        .split("-")
        .map(
          (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        )
        .join(" ");
    }
  }

  const notification = useGetNotificationDataQuery({});

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

  const notificationData: NotificationType[] = notification?.data?.data || [];

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
