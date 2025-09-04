import React from "react";
import { format } from "date-fns";
import { Clock, Calendar, User } from "lucide-react";

interface ShiftNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  meta: {
    date: string;
    status: string;
    performedBy: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ShiftNotificationsProps {
  shiftNotifications?: ShiftNotification[];
}

export const ShiftNotifications: React.FC<ShiftNotificationsProps> = ({ shiftNotifications = [] }) => {
  const shouldScroll = (shiftNotifications?.length || 0) > 5;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, HH:mm");
    } catch {
      return dateString;
    }
  };

  const formatMessage = (message: string) => {
    // Extract key information from verbose messages
    if (message.includes('Shift Notification for')) {
      const parts = message.split(' on ');
      if (parts.length > 0) {
        const subject = parts[0].replace('Shift Notification for ', '');
        return `${subject} shift scheduled`;
      }
    }
    // For other message types, try to keep them concise
    if (message.length > 100) {
      return message.substring(0, 100) + '...';
    }
    return message;
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ASSIGNED':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!shiftNotifications || shiftNotifications.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 w-full mx-auto">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-primary">Shift Notifications</h3>
        </div>
        <div className="p-8 text-center text-gray-500">
          <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No shift notifications available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 w-full mx-auto">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-2xl font-bold text-primary">Shift Notifications</h3>
      </div>

      <div
        className={`divide-y divide-gray-100 p-4 flex gap-2 flex-col ${
          shouldScroll ? "max-h-[400px] overflow-y-auto" : ""
        }`}
      >
        {shiftNotifications.map((notification) => (
          <div
            key={notification.id}
            className="p-4 hover:bg-gray-50 cursor-pointer rounded-xl transition-colors bg-white border border-gray-100"
          >
            {/* Header with title and status */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  {notification.title}
                </h4>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(notification.meta.status)}`}>
                    {notification.meta.status}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {notification.meta.performedBy}
                  </span>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="text-sm text-gray-700 leading-relaxed mb-3">
              {formatMessage(notification.message)}
            </div>

            {/* Meta information */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Shift Date: {formatDate(notification.meta.date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Created: {formatDate(notification.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100">
        <button className="w-full text-center text-primary text-sm transition-colors font-medium hover:text-primary/80">
          View All Notifications
        </button>
      </div>
    </div>
  );
};
