import React, { useState } from "react";
import { Plus } from "lucide-react";
import UniversalModal from "@/components/Admin/UniversalModal";
import { Link } from "react-router-dom";
import SurveyTable from "./SurveyTable";
import PollAnalytics from "./PollAnalytics";
import SurveyAnalytics from "./SurveyAnalytics";

// Interface for Survey data structure (unchanged)
export interface Survey {
  id: string;
  title: string;
  createdBy: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Completed" | "Pending";
  assignTo: string;
  createdBY: string;
  description: string;
  surveyType: string;
  publishTime: string;
  createdAt: string; // Added to match the new data structure
}

const SurveyMainPage: React.FC = () => {
  const [openModalType, setOpenModalType] = useState<
    "filter" | "calendar" | "columns" | "quickView" | "teamMembers" | null // Added "teamMembers"
  >(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSurveyForQuickView, setSelectedSurveyForQuickView] = useState<Survey | null>(null);
  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      {/* Universal Modal Overlay - Renders when any modal type is open */}
      {openModalType !== null && (
        <div className="fixed inset-0 bg-black/25 z-40 flex items-center justify-center" onClick={() => setOpenModalType(null)}>
          {/* Prevent clicks inside the modal from closing it */}
          <div onClick={(e) => e.stopPropagation()}>
            {/* Calendar Modal */}
            <UniversalModal
              isOpen={openModalType === "calendar"}
              onClose={() => setOpenModalType(null)}
              modalType="calendar"
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />

            {/* Quick View Modal */}
            <div className="">
              <UniversalModal
                isOpen={openModalType === "quickView"}
                onClose={() => setOpenModalType(null)}
                modalType="quickView"
                surveyData={selectedSurveyForQuickView}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main content container */}
      <div className="mx-auto">
        {/* Header section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-primary">Survey & Poll</h1>
            <Link to={"/admin/survey-poll-page"}>
              <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium cursor-pointer">
                <Plus size={16} />
                Create New
              </button>
            </Link>
          </div>
          <p className="text-[#5B5B5B]">View and manage all surveys & polls. Monitor participation and status at a glance.</p>
        </div>

        <SurveyTable setOpenModalType={setOpenModalType} setSelectedSurveyForQuickView={setSelectedSurveyForQuickView} />

        {/* Recent Surveys & Polls section */}
        <div className={`mb-8`}>
          <div className="flex items-center justify-between my-6">
            <h2 className="text-xl font-bold text-primary">Recent Surveys & Poll</h2>
          </div>

          {/* Survey Statistics cards */}
          <SurveyAnalytics />

          {/* Poll Statistics cards */}
          <PollAnalytics />
        </div>
      </div>
    </div>
  );
};

export default SurveyMainPage;
