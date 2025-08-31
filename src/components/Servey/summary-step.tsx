import type React from "react";
import { SurveySettings } from "./types/survey";
import { useNavigate, useLocation } from "react-router-dom";
import { useCreateSurveyMutation } from "@/store/api/admin/survey/servey";
import { useCreatePoolMutation } from "@/store/api/admin/pool/pool";
import { toast } from "sonner";

interface SummaryStepProps {
  settings: SurveySettings;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({ settings }) => {
  const [createSurvey] = useCreateSurveyMutation();
  const [createPool] = useCreatePoolMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const flag = searchParams.get("flag");
  console.log(flag);
  console.log("Settings===========>", settings);
  // const navigate = useNavigate();

  // The passed state
  const pollData = location.state;
  console.log("polllData", pollData);
  const formatDateTime = (date: string, time: string) => {
    if (!date || !time) return "";
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  let isForAll: boolean;
  if (settings.assignBy === "all") {
    isForAll = true;
  } else {
    isForAll = false;
  }
  const handleSurveyPublish = async () => {
    const toastId = toast.loading("Publishing Survey...");
    const savedData = JSON.parse(localStorage.getItem("surveyData") || "null");
    const savedTitleData = JSON.parse(localStorage.getItem("surveyTitle") || "null");

    const surveyData = {
      title: savedTitleData.title,
      description: savedTitleData.description,
      employees: settings.selectedUsers,
      questions: savedData,
      isForAll: isForAll,
      publishNow: settings.publishNow,
      publishTime: settings?.publishNow ? new Date().toISOString() : settings?.publishTime,
      reminderTime: new Date(settings.reminderDate + "T" + settings.reminderTime).toISOString(),
    };
    console.log(surveyData);
    try {
      const result = await createSurvey(surveyData).unwrap();
      if (result?.success === true) {
        toast.success("Survey Published Successfully", { id: toastId });
        navigate("/admin/survey-poll");
      }
    } catch (err) {
      console.error("Failed to create survey:", err);
    }
  };

  const handlePoolPublish = async () => {
    const toastId = toast.loading("Publishing Pool...");
    console.log(settings);
    console.log("polllData", pollData);
    const poolInfo = {
      title: pollData.title,
      description: pollData.description,
      employees: settings.selectedUsers,
      question: pollData.question,
      options: pollData.options,
      isForAll: isForAll,
      showOnFeed: settings.showOnFeed,
      shouldNotify: settings.notifyPushUp,
      publishTime: settings.publishNow ? new Date().toISOString() : settings.publishTime,
      reminderTime: settings.sendReminder ? new Date(`${settings.reminderDate}T${settings.reminderTime}`).toISOString() : null,
    };
    try {
      const result = await createPool(poolInfo).unwrap();
      if (result?.success === true) {
        toast.success("Pool Published Successfully", { id: toastId });
        navigate("/admin/survey-poll");
      }
    } catch (err) {
      console.error("Failed to create survey:", err);
    }
  };
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-0">
      <div className="bg-gray-100 rounded-lg p-6 sm:p-12 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">{flag === "pool" ? "Pool is Live" : "Survey is Live"}</h2>

        <p className="text-gray-600 mb-6">"Your survey is live and ready for participation!"</p>
        <p className="text-gray-600 mb-6">Asset will be published on 21/06/2025 at 16:40</p>
        <p className="text-gray-600 mb-6">User will be notified :</p>
        <p className="text-gray-600 mb-6 border  border-gray-300 py-2 rounded-xl">A new update is waiting for you in the XYZ company app</p>

        <div className="space-y-3 text-sm text-gray-600">
          <p>
            Asset will be published on{" "}
            <span className="font-medium">
              {settings.publishNow ? "now" : formatDateTime(settings.publishDate, settings.publishTime) || "21/06/2025 at 16:40"}
            </span>
          </p>

          {settings.notifyPushUp && (
            <div>
              <p className="font-medium mb-2">User will be notified :</p>
              <div className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 max-w-md mx-auto">
                {settings.notificationText || "A new update is waiting for you in the XYZ company app"}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
        <button
          onClick={() => navigate("/admin/survey-poll")}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors order-1 sm:order-2"
        >
          Cancel
        </button>
        <button
          onClick={flag === "pool" ? handlePoolPublish : handleSurveyPublish}
          className="bg-[#4E53B1] text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors mb-4 sm:mb-0 order-2 sm:order-1"
        >
          {flag === "pool" ? "Confirm Pool" : "Confirm Survey"}
        </button>
      </div>
    </div>
  );
};
