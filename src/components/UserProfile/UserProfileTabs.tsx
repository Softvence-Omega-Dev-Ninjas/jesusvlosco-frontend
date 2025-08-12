import React, { useState } from "react";
import PersonalInformationTab from "./PersonalInformationTab";
import RecognitionAchievementsTab from "./RecognitionAchievementsTab";
import SkillsCertificationsTab from "./SkillsCertificationsTab";

// Re-using the PersonalInfoFormData interface for consistency
interface PersonalInfoFormData {
  firstName: string;
  lastName: string;
  gender: string;
  dob: Date | null; // Changed to Date | null
  email: string;
  phone: string;
  address: string;
  state: string;
  country: string;
  pinCode: string;
  nationality: string;
}

interface UserProfileTabsProps {
  user: PersonalInfoFormData;
  isEditing: boolean;
  onSavePersonalInformation: (updatedUser: PersonalInfoFormData) => void;
  onCancelEdit: () => void;
}

type TabKey =
  | "personalInformation"
  | "recognitionAchievements"
  | "skillsCertifications";

const UserProfileTabs: React.FC<UserProfileTabsProps> = ({
  user,
  isEditing,
  onSavePersonalInformation,
  onCancelEdit,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>("personalInformation");

  const renderTabContent = () => {
    switch (activeTab) {
      case "personalInformation":
        return (
          <PersonalInformationTab
            user={user}
            isEditing={isEditing}
            onSave={onSavePersonalInformation}
            onCancelEdit={onCancelEdit}
          />
        );
      case "recognitionAchievements":
        return <RecognitionAchievementsTab />;
      case "skillsCertifications":
        return <SkillsCertificationsTab />;
      default:
        return null;
    }
  };

  const TabButton: React.FC<{ tabKey: TabKey; label: string }> = ({
    tabKey,
    label,
  }) => (
    <button
      className={`py-3 px-6 text-center font-medium text-lg relative transition-colors duration-200
        ${
          activeTab === tabKey
            ? "text-[#4E53B1] before:absolute before:bottom-0 before:left-0 before:w-full before:h-1 before:bg-[#4E53B1]"
            : "text-gray-600 hover:text-gray-900"
        }
      `}
      onClick={() => setActiveTab(tabKey)}
    >
      {label}
    </button>
  );

  return (
    <div className="mt-6 border-t border-gray-200">
      <div className="flex justify-between px-10 ">
        <TabButton tabKey="personalInformation" label="Personal Information" />
        <TabButton
          tabKey="recognitionAchievements"
          label="Recognition & Achievements"
        />
        <TabButton
          tabKey="skillsCertifications"
          label="Skills & Certifications"
        />
      </div>
      <div className="mt-6">{renderTabContent()}</div>
    </div>
  );
};

export default UserProfileTabs;
