import React, { useState } from "react";
import { Clock, CheckCircle, XCircle, Plus } from "lucide-react";
import AddShiftModal from "./AddShiftModal";
import { TimeOffRequestModal } from "./AddTimeModal";

interface TimeEntry {
  clockIn: string;
  clockOut: string;
  hoursWorked: string;
  totalHours: string;
}

const TimeTrackingDashboard: React.FC = () => {
  const currentDate = "Wednesday, June 25, 2024";
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const timeEntry: TimeEntry = {
    clockIn: "07:00 AM",
    clockOut: "04:00 PM",
    hoursWorked: "0:36",
    totalHours: "8:00",
  };

  const [requests, setRequests] = useState([
    {
      id: 1,
      dateRange: "Jul 15 - Jul 19, 2024 (5 days)",
      type: "Annual vacation",
      status: "Pending",
      canCancel: true,
    },
    {
      id: 2,
      dateRange: "Jun 22, 2024",
      type: "Forgot to clock out - actual end time was 5:30 PM",
      status: "Approved",
      canCancel: false,
    },
  ]);

  const [activities] = useState([
    {
      id: 1,
      type: "Clocked in",
      message: "Your work has started",
      icon: "clock-in",
      color: "text-green-600",
    },
    {
      id: 2,
      type: "Timesheet approved",
      message: "Your timesheet for June 24 has been approved",
      icon: "check",
      color: "text-green-600",
    },
    {
      id: 3,
      type: "Clocked out",
      message: "Your work has ended",
      icon: "clock-out",
      color: "text-red-600",
    },
    {
      id: 4,
      type: "Clocked in",
      message: "Your work has started",
      icon: "clock-in",
      color: "text-green-600",
    },
  ]);

  const handleCancelRequest = (id: number) => {
    setRequests(requests.filter((request) => request.id !== id));
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    if (status === "Pending") {
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    } else if (status === "Approved") {
      return `${baseClasses} bg-green-100 text-green-800`;
    }
    return baseClasses;
  };

  const getActivityIcon = (iconType: string, color: string) => {
    const iconClasses = `w-5 h-5 ${color}`;
    switch (iconType) {
      case "clock-in":
        return <Clock className={iconClasses} />;
      case "check":
        return <CheckCircle className={iconClasses} />;
      case "clock-out":
        return <XCircle className={iconClasses} />;
      default:
        return <Clock className={iconClasses} />;
    }
  };

  return (
    <div className="max-w-8xl mx-auto bg-gray-50 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Current Status and Requests */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#4E53B1]">
                Current Status
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">{currentDate}</p>

            <div className="grid grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Clock In
                </h3>
                <p className="text-lg font-semibold text-gray-900">
                  {timeEntry.clockIn}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Clock Out
                </h3>
                <p className="text-lg font-semibold text-gray-900">
                  {timeEntry.clockOut}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Hours Today
                </h3>
                <p className="text-lg font-semibold text-gray-900">
                  {timeEntry.hoursWorked} / {timeEntry.totalHours}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white  lg:w-[152%] rounded-lg shadow-sm">
            <div className="grid  grid-cols-1 lg:grid-cols-2 gap-8">
              {/* My Requests */}
              <div className=" ">
                <div className="p-6  border-gray-200">
                  <h2 className="text-xl font-semibold text-[#4E53B1] flex items-center gap-2">
                    My Requests
                  </h2>
                </div>

                <div className="p-6 space-y-4 ">
                  {requests.map((request) => (
                    <div
                      key={request.id}
                      className="border  border-gray-200 rounded-lg p-4 py-11 bg-gray-50"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 mb-1">
                            {request.dateRange}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {request.type}
                          </p>
                        </div>
                        <span className={getStatusBadge(request.status)}>
                          {request.status}
                        </span>
                      </div>

                      {request.canCancel && (
                        <button
                          onClick={() => handleCancelRequest(request.id)}
                          className="px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-medium hover:bg-red-100 transition-colors"
                        >
                          Cancel request
                        </button>
                      )}

                      {request.status === "Approved" && (
                        <div className="px-4 py-2 bg-green-700 text-white rounded-full text-sm font-medium inline-block">
                          Approved
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <div className="p-6  border-gray-200">
                  <h2 className="text-xl font-semibold text-[#4E53B1] flex items-center gap-2">
                    Recent activity
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex-shrink-0 w-8 h-8 mt-2 bg-gray-100 rounded-full flex items-center justify-center">
                        {getActivityIcon(activity.icon, activity.color)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {activity.type}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {activity.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Request Actions and Recent Activity */}
        <div className="space-y-6">
          {/* Request Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Request
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => setIsShiftModalOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Add a shift request
                </span>
              </button>
              {isShiftModalOpen && (
                <AddShiftModal onClose={() => setIsShiftModalOpen(false)} />
              )}

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Add a time off request
                </span>
              </button>
              <TimeOffRequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTrackingDashboard;
