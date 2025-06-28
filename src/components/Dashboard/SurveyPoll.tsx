import React from "react";
import { ProgressCircle } from "./ProgressCircle";
import { StatusBadge } from "./StatusBadge";
import { DownFillIcon } from "./icons";

export const SurveyPoll: React.FC = () => {
  return (
    <div className="rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-[#4E53B1]">Survey and Poll</h2>
        <button className="text-[#4E53B1] cursor-pointer flex items-center gap-1">
          Survey <DownFillIcon></DownFillIcon>
        </button>
      </div>
      <StatusBadge status="active" className="rounded-full px-4 ml-3 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-base font-normal text-gray-600">
              Employee Satisfaction
            </span>
            <span className="text-base font-normal text-gray-600">
              HR Manager
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-base font-normal text-gray-600">
                Start Date
              </span>
              <span className="text-base font-normal text-gray-600">
                05/01/2024
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-base font-normal text-gray-600">
                End Date
              </span>
              <span className="text-base font-normal text-gray-600">
                05/01/2024
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-8">
          <ProgressCircle
            percentage={50}
            color="#10b981"
            label="20/40 user Complete"
          />
          <ProgressCircle
            percentage={37.5}
            color="#ef4444"
            label="15/40 user Complete"
          />
        </div>
      </div>
    </div>
  );
};
