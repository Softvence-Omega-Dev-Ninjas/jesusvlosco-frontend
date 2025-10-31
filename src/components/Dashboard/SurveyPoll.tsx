import React, { useState } from "react";
import { ProgressCircle } from "./ProgressCircle";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string | null;
  profileUrl: string | null;
  gender: string;
  jobTitle: string;
  department: string;
}

interface User {
  id: string;
  phone: string;
  employeeID: number;
  email: string;
  role: string;
  isLogin: boolean;
  profile: UserProfile;
}

interface SurveyAnalytics {
  surveyId: string;
  title: string;
  description: string;
  createdBy: string;
  totalAssigned: number;
  respondedCount: number;
  responsePercentage: number;
  notRespondedCount: number;
  notResponsePercentage: number;
  respondedUsers: User[];
  notRespondedUsers: User[];
  createdAt: string;
}

interface PollData {
  id: string;
  title: string;
  description: string;
  totalResponse: number;
  options: {
    option: string;
    totalResponse: number;
    responsePercentage: number;
  }[];
}

interface AnalyticsData {
  survey: SurveyAnalytics;
  pool: PollData;
}

interface SurveyPollProps {
  data?: AnalyticsData | { data: AnalyticsData } | null;
}

export const SurveyPoll: React.FC<SurveyPollProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<"survey" | "poll">("survey");

  // Handle different data structures from API
  const analyticsData = data && "data" in data ? data.data : data;
  console.log("=================>", analyticsData);

  // but if data is an empty object, show "No data available" instead of infinite loading.
  if (data === undefined || data === null) {
    return (
      <div className="rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4E53B1] mx-auto mb-4"></div>
            <p className="text-gray-500">Loading survey and poll data...</p>
          </div>
        </div>
      </div>
    );
  }

  // If data is loaded but missing analytics, show "No data available"
  if (!analyticsData) {
    return (
      <div className="rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-gray-500">No survey or poll data available.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#4E53B1]">Survey & Poll Analytics</h2>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("survey")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "survey" ? "bg-white text-[#4E53B1] shadow-sm" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Survey
          </button>
          <button
            onClick={() => setActiveTab("poll")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "poll" ? "bg-white text-[#4E53B1] shadow-sm" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Poll
          </button>
        </div>
      </div>

      {activeTab === "survey" ? <SurveyView survey={analyticsData.survey} /> : <PollView poll={analyticsData.pool} />}
    </div>
  );
};

const SurveyView: React.FC<{ survey: SurveyAnalytics }> = ({ survey }) => {
  // Additional safety check
  if (!survey) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Survey data not available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Survey Header */}
      <div className="border-b border-gray-100 pb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{survey?.title || "Untitled Survey"}</h3>
        <p className="text-sm text-gray-600">{survey?.description || "No description available"}</p>
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          <span>Created by: {survey?.createdBy || "Unknown"}</span>
          <span>Total Assigned: {survey?.totalAssigned || 0}</span>
        </div>
      </div>

      {/* Response Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{survey?.respondedCount || 0}</div>
          <div className="text-sm text-green-700">Responded</div>
          <div className="text-xs text-green-600 mt-1">{survey?.responsePercentage ? survey.responsePercentage.toFixed(1) : 0}% response rate</div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{survey?.notRespondedCount || 0}</div>
          <div className="text-sm text-red-700">Not Responded</div>
          <div className="text-xs text-red-600 mt-1">{survey?.notResponsePercentage ? survey.notResponsePercentage.toFixed(1) : 0}% pending</div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{survey?.totalAssigned || 0}</div>
          <div className="text-sm text-blue-700">Total Assigned</div>
          <div className="text-xs text-blue-600 mt-1">Survey participants</div>
        </div>
      </div>

      {/* Progress Visualization */}
      <div className="flex justify-center">
        <ProgressCircle
          percentage={survey?.responsePercentage || 0}
          color="#10b981"
          label={`${survey?.respondedCount || 0}/${survey?.totalAssigned || 0}`}
        />
      </div>
    </div>
  );
};

const PollView: React.FC<{ poll: PollData }> = ({ poll }) => {
  // Additional safety check
  if (!poll) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Poll data not available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Poll Header */}
      <div className="border-b border-gray-100 pb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{poll?.title || "Untitled Poll"}</h3>
        <p className="text-sm text-gray-600">{poll?.description || "No description available"}</p>
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          <span>Total Responses: {poll?.totalResponse || 0}</span>
        </div>
      </div>

      {/* Poll Options */}
      <div className="space-y-3">
        {poll?.options && poll.options.length > 0 ? (
          poll.options.map((option, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{option?.option || "Unnamed Option"}</span>
                <span className="text-sm text-gray-600">
                  {option?.totalResponse || 0} votes ({option?.responsePercentage ? option.responsePercentage.toFixed(1) : 0}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#4E53B1] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${option?.responsePercentage || 0}%` }}
                ></div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No poll options available</p>
          </div>
        )}
      </div>

      {(!poll?.totalResponse || poll.totalResponse === 0) && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-sm">No responses yet</div>
        </div>
      )}
    </div>
  );
};
