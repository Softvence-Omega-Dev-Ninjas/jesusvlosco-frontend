import { useState,} from "react";

import { defaultSurveySettings } from "../data/survey-data";
import { SurveySettings } from "../types/survey";
import { useCreateSurveyMutation } from "@/store/api/admin/survey/servey";



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
            publishTime:new Date(settings.publishDate + "T" + settings.publishTime).toISOString(),
            reminderTime:new Date(settings.reminderDate + "T" + settings.reminderTime).toISOString()
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
