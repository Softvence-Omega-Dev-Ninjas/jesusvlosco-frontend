"use client";

import type React from "react";

import { useState } from "react";

export default function TimeOffComponent() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [allDayOff, setAllDayOff] = useState(true);
  const [timeOffType, setTimeOffType] = useState("sick-leave");
  const [note, setNote] = useState("");

  const timeOffPolicies = [
    { type: "Time off", days: 22 },
    { type: "Sick leave", days: 10 },
    { type: "Casual leave", days: 12 },
    { type: "Unpaid leave", days: 8 },
  ];

  const requestHistory = [
    {
      date: "12/07/25 Full day",
      policy: "Sick leave",
      requested: "12/07/25",
      total: "1 Days",
      status: "Added by admin",
      statusColor: "bg-green-100 text-green-700",
    },
    {
      date: "27/06/25 Full day",
      policy: "Time off",
      requested: "27/06/25",
      total: "1 Days",
      status: "Rejected",
      statusColor: "bg-red-100 text-red-700",
    },
    {
      date: "27/06/25 Full day",
      policy: "Time off",
      requested: "27/06/25",
      total: "1 Days",
      status: "Rejected",
      statusColor: "bg-red-100 text-red-700",
    },
    {
      date: "27/06/25 Full day",
      policy: "Time off",
      requested: "27/06/25",
      total: "1 Days",
      status: "Rejected",
      statusColor: "bg-red-100 text-red-700",
    },
    {
      date: "25/06/25 Full day",
      policy: "Sick leave",
      requested: "25/06/25",
      total: "1 Days",
      status: "Pending",
      statusColor: "bg-yellow-100 text-yellow-700",
    },
    {
      date: "25/06/25 Full day",
      policy: "Sick leave",
      requested: "25/06/25",
      total: "1 Days",
      status: "Pending",
      statusColor: "bg-yellow-100 text-yellow-700",
    },
    {
      date: "16/06/25 Full day",
      policy: "Sick leave",
      requested: "16/06/25",
      total: "1 Days",
      status: "Approved",
      statusColor: "bg-green-100 text-green-700",
    },
    {
      date: "16/06/25 Full day",
      policy: "Sick leave",
      requested: "16/06/25",
      total: "1 Days",
      status: "Approved",
      statusColor: "bg-green-100 text-green-700",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
    setIsPopupOpen(false);
  };

  return (
    <div className="mt-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-xl font-semibold text-primary">
          Time Off Requests
        </h1>
        <button
          onClick={() => setIsPopupOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
        >
          Request time off
        </button>
      </div>

      {/* Time Off Policies */}
      <div className="mb-8">
        <h2 className="text-base font-medium text-gray-900 mb-4">
          Time Off Policies
        </h2>
        <div className="flex flex-wrap gap-6">
          {timeOffPolicies.map((policy, index) => (
            <div key={index} className="bg-primary/10 p-5 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">{policy.type}</div>
              <div className="text-xl font-bold text-gray-900">
                {policy.days} Days
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Requests History */}
      <div>
        <div className="mb-8">
          <h2 className="text-base font-medium">Requests History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left *:min-w-max *:px-3">
                <th className="pb-3 text-sm font-medium text-primary">
                  Date of time off
                </th>
                <th className="pb-3 text-sm font-medium text-primary">
                  Policy
                </th>
                <th className="pb-3 text-sm font-medium text-primary">
                  Requested on
                </th>
                <th className="pb-3 text-sm font-medium text-primary">
                  Total requested
                </th>
                <th className="pb-3 text-sm font-medium text-primary">
                  Status
                </th>
                <th className="pb-3 text-sm font-medium text-primary">Notes</th>
              </tr>
            </thead>
            <tbody>
              {requestHistory.map((request, index) => (
                <tr key={index} className="border-t border-gray-200 *:px-3">
                  <td className="py-3 text-sm text-gray-900">{request.date}</td>
                  <td className="py-3 text-sm text-gray-900">
                    {request.policy}
                  </td>
                  <td className="py-3 text-sm text-gray-900">
                    {request.requested}
                  </td>
                  <td className="py-3 text-sm text-gray-900">
                    {request.total}
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex min-w-max justify-center px-2 py-1 text-xs font-medium rounded-full w-[60%] ${request.statusColor}`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <button className="text-blue-600 hover:text-blue-800 text-sm underline">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                New time off request
              </h3>
              <button
                onClick={() => setIsPopupOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Time off type */}
              <div>
                <label
                  htmlFor="time-off-type"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Time off type
                </label>
                <select
                  id="time-off-type"
                  value={timeOffType}
                  onChange={(e) => setTimeOffType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="sick-leave">Sick leave</option>
                  <option value="time-off">Time off</option>
                  <option value="casual-leave">Casual leave</option>
                  <option value="unpaid-leave">Unpaid leave</option>
                </select>
              </div>

              {/* All day toggle */}
              <div className="flex items-center justify-between">
                <label
                  htmlFor="all-day"
                  className="text-sm font-medium text-gray-700"
                >
                  All day time off
                </label>
                <button
                  type="button"
                  onClick={() => setAllDayOff(!allDayOff)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    allDayOff ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      allDayOff ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Date picker */}
              <div>
                <label
                  htmlFor="date-time"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Date and time of time off
                </label>
                <div className="flex">
                  <input
                    type="date"
                    id="date-time"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                  >
                    📅
                  </button>
                </div>
              </div>

              {/* Total days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total time off days
                </label>
                <div className="text-sm text-gray-600">1.00 work days</div>
              </div>

              {/* Note */}
              <div>
                <label
                  htmlFor="note"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Attach a note to your request
                </label>
                <textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
              >
                Send for approval
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
