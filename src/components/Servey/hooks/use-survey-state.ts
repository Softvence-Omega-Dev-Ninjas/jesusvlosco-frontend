import { useState } from "react";

import { defaultSurveySettings } from "../data/survey-data";
import { SurveySettings } from "../types/survey";

export const useSurveyState = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [settings, setSettings] = useState<SurveySettings>(defaultSurveySettings);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleCancel = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAssignByChange = (value: "all" | "select") => {
    setSettings((prev) => ({ ...prev, assignBy: value }));
  };

  const handleUserSelectionChange = (userId: string, selected: boolean) => {
    setSettings((prev) => ({
      ...prev,
      employees: selected
        ? [...(prev.employees || []), userId] // add userId to employees array
        : (prev.employees || []).filter((id) => id !== userId), // remove userId from employees
    }));
  };

  const handleSettingsChange = (newSettings: Partial<SurveySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return {
    currentStep,
    setCurrentStep,
    settings,
    handleNext,
    handleCancel,
    handleAssignByChange,
    handleUserSelectionChange,
    handleSettingsChange,
  };
};
