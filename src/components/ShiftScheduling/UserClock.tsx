/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Clock, CheckCircle, XCircle, Plus } from "lucide-react";
import AddShiftModal from "./AddShiftModal";
import { TimeOffRequestModal } from "./AddTimeModal";
import { useDeleteSchedulingRequestMutation, useGetAllUserTimeClockQuery } from "@/store/api/user/scheduling/schedulingApi";
import { formatDateRange } from "@/utils/formatDateRange";
import { toast } from "sonner";
import { useGetClockHistoryQuery, useGetClockInOutQuery } from "@/store/api/clockInOut/clockinoutapi";
import { toLocalTimeString } from "@/utils/timeUtils";
import AddClockInRequestModal from "./AddClockInRequestModal/AddClockInRequestModal";
// import { is } from "date-fns/locale"; 

interface TimeEntry {
  clockIn: string;
  clockOut: string;
}

const TimeTrackingDashboard: React.FC = () => {
  // const currentDate = new Date().toLocaleDateString("en-US", {
  //   weekday: "long",
  //   year: "numeric",
  //   month: "long",
  //   day: "numeric",
  // });
  const { data } = useGetAllUserTimeClockQuery(null);
  const clockData = useGetClockInOutQuery({});
  console.log("Clock Data:", clockData);
  const clock = clockData?.data?.data?.clock;
  const shift = clockData?.data?.data?.shift;
  const isToday = new Date().toISOString().split("T")[0] === shift?.date.split("T")[0];
  const isUpcomming = new Date(shift?.date) > new Date();
  const shiftDate = shift && isToday ? new Date(shift.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }) : "";
  // console.log(" Clock Data:", clock);
  const timeClockRequest = data?.data?.data;
  // console.log({ timeClockRequest });
  const [deleteTimeCLock] = useDeleteSchedulingRequestMutation();
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const timeEntry: TimeEntry = {
    clockIn: toLocalTimeString(clock?.clockInAt),
    clockOut: toLocalTimeString(clock?.clockOutAt),
  };

  const clockHistory = useGetClockHistoryQuery({}).currentData?.data;
  // console.log("clockHistory", clockHistory);

  const handleCancelRequest = async (id: number) => {
    const toastId = toast.loading("loading.....");
    try {
      const result = await deleteTimeCLock(id).unwrap();
      if (result?.success) {
        toast.error("Time clock cencelled", { id: toastId });
      }
    } catch (error: any) {
      toast.error(error?.data?.message, { id: toastId });
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    if (status === "pending") {
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    } else if (status === "approved") {
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
    <div className="max-w-8xl  mx-auto bg-gray-50 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Current Status and Requests */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#4E53B1]">{isToday ? "Current Status" : (isUpcomming ? "Upcoming Shift" : "Previous Shift")}</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">{shiftDate ? shiftDate : "No Upcoming/Previous Shift Recorded"}</p>

            <div className="grid grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Clock In</h3>
                <p className="text-lg font-semibold text-gray-900">{timeEntry.clockIn || "Not clocked in yet"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Clock Out</h3>
                <p className="text-lg font-semibold text-gray-900">{timeEntry.clockOut || "Not clocked out yet"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                <p className="text-lg font-semibold text-gray-900">{clock?.status || "Not clocked in"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white  lg:w-[152%] rounded-lg shadow-sm">
            <div className="grid  grid-cols-1 lg:grid-cols-2 gap-8">
              {/* My Requests */}
              <div className=" ">
                <div className="p-6  border-gray-200">
                  <h2 className="text-xl font-semibold text-[#4E53B1] flex items-center gap-2">My Requests</h2>
                </div>

                <div className="p-6 space-y-4 ">
                  {timeClockRequest?.map((request: any) => (
                    <div key={request.id} className="border  border-gray-200 rounded-lg p-4 py-11 bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 mb-1">{formatDateRange(request?.startTime, request?.endTime)}</p>
                          {/* <p className="text-gray-600 text-sm">
                            {request.type}
                          </p> */}
                        </div>
                        <span className={getStatusBadge(request.status === "DRAFT" ? "pending" : "approved")}>{request?.status}</span>
                      </div>

                      {request.status === "DRAFT" ? (
                        <button
                          onClick={() => handleCancelRequest(request.id)}
                          className="px-4 py-2 cursor-pointer bg-red-100 text-red-600 rounded-full text-sm font-medium hover:bg-red-100 transition-colors"
                        >
                          Cancel request
                        </button>
                      ) : (
                        <div className="px-4 py-2 bg-green-700 text-white rounded-full text-sm font-medium inline-block">Approved</div>
                      )}
                      {/* 
                      {request.status === "Approved" && (
                        <div className="px-4 py-2 bg-green-700 text-white rounded-full text-sm font-medium inline-block">
                          Approved
                        </div>
                      )} */}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <div className="p-6  border-gray-200">
                  <h2 className="text-xl font-semibold text-[#4E53B1] flex items-center gap-2">Clock History</h2>
                </div>

                <div className="p-6 space-y-4">
                  {clockHistory?.length > 0 ? (
                    clockHistory.slice(0, 4).map((activity: any, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 mt-2 bg-gray-100 rounded-full flex items-center justify-center">
                          {getActivityIcon(
                            activity.type === "CLOCK_IN" ? "clock-in" : "clock-out",
                            activity.type === "CLOCK_IN" ? "text-green-600" : "text-red-600"
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {activity.title} at {toLocalTimeString(activity.time)}
                          </h3>
                          {/* <p className="text-sm text-gray-600">
                            Date: {activity.date}
                          </p> */}
                          <p className="text-sm text-gray-500">Location: {activity.location}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No clock history found</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Request Actions and Recent Activity */}
        <div className="space-y-6">
          {/* Request Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request</h3>
            <div className="space-y-3">
              <button
                onClick={() => setIsShiftModalOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Add a shift request</span>
              </button>
              {/* <button
                onClick={() => setIsShiftModalOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Add Clock In Request</span>
              </button> */}
              <AddClockInRequestModal />
              {isShiftModalOpen && <AddShiftModal onClose={() => setIsShiftModalOpen(false)} />}

              <TimeOffRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTrackingDashboard;
