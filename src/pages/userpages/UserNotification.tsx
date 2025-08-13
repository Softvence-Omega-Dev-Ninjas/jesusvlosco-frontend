import React, { useState } from "react";


import proparty from "../../assets/Property .png";
import proparty1 from "../../assets/Property 1.png";
import tooltip from "../../assets/tooltip_2 (1).png";
import add from "../../assets/add_task.png";
import mail from "../../assets/mail (1).png";
import user from "../../assets/usernotification.png";
import bell from "../../assets/notifications_active.png";

interface NavigationTabsProps {
  // Optional: if you want to control the active tab from a parent component
  initialActiveTab?: string;
  // Optional: callback when a tab is clicked
  onTabChange?: (tab: string) => void;
}

interface ToggleState {
  email: boolean;
  communication: boolean;
  users: boolean;
  surveyPoll: boolean;
  tasksProjects: boolean;
  scheduling: boolean;
  message: boolean;
  userRegistration: boolean;
}

const UserNotification: React.FC = () => {
  const [settings, setSettings] = useState<ToggleState>({
    email: true,
    communication: true,
    users: true,
    surveyPoll: true,
    tasksProjects: true,
    scheduling: true,
    message: true,
    userRegistration: true,
  });

  const handleToggle = (key: keyof ToggleState) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const Toggle: React.FC<{ isOn: boolean; onToggle: () => void }> = ({
    isOn,
    onToggle,
  }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        isOn ? "bg-primary" : "bg-gray-200" // Reverted to bg-primary
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isOn ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  const SettingItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isOn: boolean;
    onToggle: () => void;
  }> = ({ icon, label, isOn, onToggle }) => (
    <div className="flex items-center justify-between py-4 px-6 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center space-x-3">
        <div className="text-black">{icon}</div>
        <span className="text-black font-medium text-[20px]">{label}</span>
      </div>
      <Toggle isOn={isOn} onToggle={onToggle} />
    </div>
  );

  return (
    <div className="mx-auto space-y-6 py-4 ">
      {/* Main Notification Settings */}
      <div className="rounded-lg border border-gray-200  shadow-sm">
        <div className="px-6 py-4 ">
          <h2 className="text-[24px] font-semibold text-primary">
            Notification Settings
          </h2>{" "}
          {/* Reverted to text-primary */}
        </div>

        <div className="divide-y text-[#484848] px-2 divide-gray-500 ">
          <SettingItem
            icon={<img src={mail} alt="task" className="" />}
            label="Email"
            isOn={settings.email}
            onToggle={() => handleToggle("email")}
          />

          <SettingItem
            icon={<img src={tooltip} alt="task" className="" />}
            label="Communication"
            isOn={settings.communication}
            onToggle={() => handleToggle("communication")}
          />

          <SettingItem
            icon={<img src={user} alt="task" className="" />}
            label="Users"
            isOn={settings.users}
            onToggle={() => handleToggle("users")}
          />

          <SettingItem
            icon={<img src={proparty} alt="task" className="" />}
            label="Survey & Poll"
            isOn={settings.surveyPoll}
            onToggle={() => handleToggle("surveyPoll")}
          />

          <SettingItem
            icon={<img src={add} alt="task" className="" />}
            label="Tasks & Projects"
            isOn={settings.tasksProjects}
            onToggle={() => handleToggle("tasksProjects")}
          />

          <SettingItem
            icon={<img src={proparty1} alt="task" className="" />}
            label="Scheduling"
            isOn={settings.scheduling}
            onToggle={() => handleToggle("scheduling")}
          />

          <SettingItem
            icon={<img src={mail} alt="task" className="" />}
            label="Message"
            isOn={settings.message}
            onToggle={() => handleToggle("message")}
          />
        </div>
      </div>

      {/* User Registration */}
      <div className=" px-3 lg:px-6 rounded-lg border border-gray-200 shadow-sm">
        <div className=" py-2 ">
          <h2 className="text-lg font-semibold text-[#484848]">
            User Registration
          </h2>
        </div>

        <div className="  py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <img src={mail} alt="" />

                  <span className="text-gray-600 font-medium">Email</span>
                </div>
                <div className="flex items-center space-x-2">
                  <img src={bell} alt="" />

                  <span className="text-sm text-gray-600">In-App</span>
                </div>
              </div>
            </div>
            <Toggle
              isOn={settings.userRegistration}
              onToggle={() => handleToggle("userRegistration")}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="bg-primary cursor-pointer text-white py-2 px-6 rounded-lg transition-colors focus:outline-none ">
          {" "}
          {/* Reverted to bg-primary */}
          Save Settings
        </button>
      </div>
    </div>
  );
};

const NavigationTabs: React.FC<NavigationTabsProps> = ({
  initialActiveTab = "Notifications",
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState(initialActiveTab);

  const tabs = [
    "Company Profile",
    "Admin Details",
    "Project Management",
    "Employee Management",
    "API & Integrations",
    "Notifications",
  ];

  const handleClick = (tab: string) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Notifications":
        return <UserNotification />;
      case "Company Profile":
        return (
          <div className="p-4 text-gray-700">
            Company Profile Content (Coming Soon)
          </div>
        );
      case "Admin Details":
        return (
          <div className="p-4 text-gray-700">
            Admin Details Content (Coming Soon)
          </div>
        );
      case "Project Management":
        return (
          <div className="p-4 text-gray-700">
            Project Management Content (Coming Soon)
          </div>
        );
      case "Employee Management":
        return (
          <div className="p-4 text-gray-700">
            Employee Management Content (Coming Soon)
          </div>
        );
      case "API & Integrations":
        return (
          <div className="p-4 text-gray-700">
            API & Integrations Content (Coming Soon)
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen  font-sans antialiased">
      <div className="  ">
        <div className="container mx-auto flex flex-col md:flex-row justify-between   overflow-x-auto whitespace-nowrap border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleClick(tab)}
              className={`relative py-4 px-10  font-medium focus:outline-none transition-colors duration-200
                ${
                  activeTab === tab
                    ? "text-gray-900 border-b border-purple-700" // Active tab styling
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300" // Inactive tab styling
                }`}
            >
              {tab}
              {/* Active tab underline - This is the purple bar below "Notifications" */}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full right-0  bg-purple-700"></div> // Adjust height if needed
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="  md:px-3 mt-6">{renderContent()}</div>
    </div>
  );
};

export default NavigationTabs;
