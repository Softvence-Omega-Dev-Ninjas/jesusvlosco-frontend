import { useGetAllPollQuery } from "@/store/api/admin/dashboard/getAllPollApi";
import { useGetAllSurveyQuery } from "@/store/api/admin/dashboard/getAllSurveyApi";
import React, { useState } from "react";
import { ProgressCircle } from "./ProgressCircle";
import { StatusBadge } from "./StatusBadge";
import { DownFillIcon } from "./icons";

export const SurveyPoll: React.FC = () => {
  const [type, setType] = useState<"survey" | "poll">("survey");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch based on type
  const surveyData = useGetAllSurveyQuery({
    page: 1,
    limit: 10,
    status: "DRAFT",
    orderBy: "asc",
  });

  const pollData = useGetAllPollQuery({
    page: 1,
    limit: 10,
    status: "DRAFT",
    orderBy: "asc",
  });

  const data = type === "survey" ? surveyData.data : pollData.data;

  return (
    <div className="rounded-2xl border border-gray-200 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative">
        <h2 className="text-2xl font-bold text-[#4E53B1]">Survey and Poll</h2>

        {/* Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="text-[#4E53B1] cursor-pointer flex items-center gap-1"
          >
            {type === "survey" ? "Survey" : "Poll"} <DownFillIcon />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white shadow-md rounded-md border border-gray-200">
              <div
                onClick={() => {
                  setType("survey");
                  setDropdownOpen(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Survey
              </div>
              <div
                onClick={() => {
                  setType("poll");
                  setDropdownOpen(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Poll
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Example content using the selected data */}
      <StatusBadge status="active" className="rounded-full px-4 ml-3 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-base font-normal text-gray-600">
              {data?.title || "Employee Satisfaction"}
            </span>
            <span className="text-base font-normal text-gray-600">
              {data?.owner || "HR Manager"}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-base font-normal text-gray-600">
                Start Date
              </span>
              <span className="text-base font-normal text-gray-600">
                {data?.startDate || "05/01/2024"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-base font-normal text-gray-600">
                End Date
              </span>
              <span className="text-base font-normal text-gray-600">
                {data?.endDate || "05/01/2024"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-8">
          <ProgressCircle percentage={50} color="#10b981" label="20/40" />
          <ProgressCircle percentage={37.5} color="#ef4444" label="15/40" />
        </div>
      </div>
    </div>
  );
};
