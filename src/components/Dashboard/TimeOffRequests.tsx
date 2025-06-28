import React from "react";
import { Avatar } from "./Avatar";
import { TimeOffRequest } from "./dashboard";
import { StatusBadge } from "./StatusBadge";

export const TimeOffRequests: React.FC<{ requests: TimeOffRequest[] }> = ({
  requests,
}) => {
  const handleApprove = (id: string) => {
    console.log("Approved request:", id);
  };

  const handleDecline = (id: string) => {
    console.log("Declined request:", id);
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Time-off requests</h3>
        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="border rounded-lg p-3 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center gap-3 mb-2">
              <Avatar initials={request.avatar} />
              <div className="flex-1">
                <div className="font-medium text-sm">{request.name}</div>
                <StatusBadge status={request.status} />
              </div>
            </div>

            <div className="text-xs text-gray-600 mb-2">{request.date}</div>
            <div className="text-sm font-medium mb-3">{request.type}</div>

            {request.status === "pending" && (
              <div className="flex gap-2">
                <button className="flex-1 text-xs text-gray-600 border border-gray-200 rounded px-2 py-1 hover:bg-gray-50 transition-colors">
                  Deadline
                </button>
                <button
                  onClick={() => handleApprove(request.id)}
                  className="flex-1 text-xs bg-green-600 text-white rounded px-2 py-1 hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <button className="w-full text-center text-indigo-600 text-sm mt-4 hover:text-indigo-800 transition-colors">
        End of Requests
      </button>
    </div>
  );
};
