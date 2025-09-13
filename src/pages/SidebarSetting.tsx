// import AdminProfile from "@/components/SidebarSetting/AdminProfile";
// import ApiIntregration from "@/components/SidebarSetting/ApiIntregration";
import CompanyDetailsPage from "@/components/SidebarSetting/CompanyDetailsPage";
import EmployeeManagement from "@/components/SidebarSetting/EmployeeManagement";
import Notification from "@/components/SidebarSetting/Notification";
import ProjectManagement from "@/components/SidebarSetting/ProjectManagement";
import { useEffect, useState } from "react";

const SidebarSetting: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(
    localStorage.getItem("activeTab") || "Company Details"
  );

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "Company Details":
        return <CompanyDetailsPage />;
      // case "Admin Profile":
      //   return <AdminProfile />;
      case "Project Management":
        return <ProjectManagement />;
      case "Employee Management":
        return <EmployeeManagement />;
      // case "API & Integrations":
      //   return <ApiIntregration />;
      case "Notifications":
        return <Notification />;
      default:
        return <CompanyDetailsPage />;
    }
  };

  const tabs = [
    // "Admin Profile",
    "Company Details",
    "Project Management",
    "Employee Management",
    // "API & Integrations",
    "Notifications",
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans">
      {/* Header Tabs Container */}
      <div className="mb-6">
        {/* Tab buttons */}
        <div className="flex justify-evenly items-center text-[#484848] w-full">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 transition-colors duration-200 ease-in-out w-full text-center 
                ${
                  activeTab === tab
                    ? "text-[#484848] font-semibold border-b-2 border-[#4E53B1]"
                    : "text-gray-600 hover:text-gray-800"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Divider line */}
        <div className="w-full h-px bg-gray-200"></div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-6">{renderContent()}</div>
    </div>
  );
};

export default SidebarSetting;
