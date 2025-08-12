import { useState,} from "react";

import { defaultSurveySettings } from "../data/survey-data";
import { SurveySettings } from "../types/survey";
import { useCreateSurveyMutation } from "@/store/api/admin/survey/servey";




const combineDateAndTimeToISO = (dateStr?: string, timeStr?: string) => {
  if (!dateStr || !timeStr) return null; // guard for empty, null, undefined
  const dateTimeString = `${dateStr}T${timeStr}:00`;

  const combined = new Date(dateTimeString);

  if (isNaN(combined.getTime())) {
    return null; // invalid date-time combo
  }

  return combined.toISOString();
};

export const useSurveyState = () => {
    const [createSurvey] = useCreateSurveyMutation();
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
      ? [...(prev.employees || []), userId]   // add userId to employees array
      : (prev.employees || []).filter((id) => id !== userId), // remove userId from employees
  }));
}


    const handleSettingsChange = (newSettings: Partial<SurveySettings>) => {
        setSettings((prev) => ({ ...prev, ...newSettings }));
    };
    let isForAll
    const handleConfirm =async () => {
        const savedData = JSON.parse(localStorage.getItem("surveyData") || "null");
        const savedTitleData = JSON.parse(localStorage.getItem("surveyTitle") || "null");
        
        if(settings.assignBy==="all"){
            isForAll=true
        }else{
            isForAll=false
        }
        const surveyData = {
            title:savedTitleData.title,
            description:savedTitleData.description,
            employees:settings.selectedUsers,
            questions:savedData,
            isForAll:isForAll,
            publishNow:settings.publishNow,
 publishTime: combineDateAndTimeToISO(settings.publishDate, settings.publishTime),
    reminderTime: combineDateAndTimeToISO(settings.reminderDate, settings.reminderTime),
        };
        console.log(surveyData)
        try {
    const result = await createSurvey(surveyData).unwrap();
    console.log("Survey successfully created:", result);
  } catch (err) {
    console.error("Failed to create survey:", err);
  }
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
