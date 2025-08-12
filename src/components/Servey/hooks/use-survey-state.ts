import { useState,} from "react";

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
                ? [...prev.selectedUsers, userId]
                : prev.selectedUsers.filter((id) => id !== userId),
        }));
    };

    const handleSettingsChange = (newSettings: Partial<SurveySettings>) => {
        setSettings((prev) => ({ ...prev, ...newSettings }));
    };

    const handleConfirm = () => {
        const savedData = JSON.parse(localStorage.getItem("surveyData") || "null");
        console.log(savedData);

        console.log("Survey confirmed with settings:", settings);

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
        handleConfirm,

    };
};
