// src/components/UserProfile/UserProfileTabs.tsx
import React, { useState } from "react";
import PersonalInformationTab from "./PersonalInformationTab"; // Adjust path

interface UserProfileTabsProps {
  user: any; // Pass user data for tab content
}

type TabKey =
  | "personalInformation"
  | "recognitionAchievements"
  | "skillsCertifications";

const UserProfileTabs: React.FC<UserProfileTabsProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<TabKey>("personalInformation");

  const renderTabContent = () => {
    switch (activeTab) {
      case "personalInformation":
        return <PersonalInformationTab user={user} />;
      case "recognitionAchievements":
        return (
          <div className="p-6 text-gray-600">
            <h3 className="text-xl font-semibold mb-4">
              Recognition & Achievements
            </h3>
            <p>Content for Recognition & Achievements will go here.</p>
            {/* Add relevant components/data here later */}
          </div>
        );
      case "skillsCertifications":
        return (
          <div className="p-6 text-gray-600">
            <h3 className="text-xl font-semibold mb-4">
              Skills & Certifications
            </h3>
            <p>Content for Skills & Certifications will go here.</p>
            {/* Add relevant components/data here later */}
          </div>
        );
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
            ? "text-indigo-600 before:absolute before:bottom-0 before:left-0 before:w-full before:h-1 before:bg-indigo-600"
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
      <div className="flex justify-start border-b border-gray-200">
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
