import { AssignByStep } from "@/components/Servey/assign-by-step";
import { mockUsers, surveySteps } from "@/components/Servey/data/survey-data";
import { useSurveyState } from "@/components/Servey/hooks/use-survey-state";
import { ProgressSteps } from "@/components/Servey/progress-steps";
import { PublishSettingsStep } from "@/components/Servey/publish-settings-step";
import { RecipientsStep } from "@/components/Servey/recipients-step";
import { SummaryStep } from "@/components/Servey/summary-step";
import type React from "react";

export const PublishSurvey: React.FC = () => {
  const { currentStep, setCurrentStep, settings, handleNext, handleCancel, handleAssignByChange, handleUserSelectionChange, handleSettingsChange } =
    useSurveyState();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <AssignByStep assignBy={settings.assignBy} onAssignByChange={handleAssignByChange} />;
      case 1:
        if (settings.assignBy === "all") {
          setCurrentStep((prev) => prev + 1);
          return null;
        }
        return (
          <RecipientsStep
            settings={settings}
            users={mockUsers}
            selectedUsers={settings.employees || []}
            onUserSelectionChange={handleUserSelectionChange}
          />
        );
      case 2:
        return <PublishSettingsStep settings={settings} onSettingsChange={handleSettingsChange} />;
      case 3:
        return <SummaryStep settings={settings} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-[#4E53B1] mb-2">Create New Survey & Poll</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Design your survey or poll by adding questions, choosing response types, and setting audience and scheduling options
          </p>
        </div>

        <ProgressSteps currentStep={currentStep} steps={surveySteps} />

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-8 mb-6 sm:mb-8">{renderCurrentStep()}</div>

        {currentStep < 3 && (
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-4">
            <button
              onClick={handleCancel}
              disabled={currentStep === 0}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button onClick={handleNext} className="bg-[#4E53B1] text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors mb-4 sm:mb-0">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublishSurvey;
