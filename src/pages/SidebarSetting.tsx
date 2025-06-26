import AdminProfile from "@/components/SidebarSetting/AdminProfile";
import CompanyDetailsPage from "@/components/SidebarSetting/CompanyDetailsPage";
import EmployeeManagement from "@/components/SidebarSetting/EmployeeManagement";
import { useState } from "react";



const SidebarSetting: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Company Details');

  const renderContent = () => {
    switch (activeTab) {
      case 'Company Details':
        return <CompanyDetailsPage></CompanyDetailsPage> ;
      case 'Admin Profile':
        return <AdminProfile></AdminProfile> ;
      case 'Project Management':
        return ;
      case 'Employee Management':
        return <EmployeeManagement></EmployeeManagement>  ;
      case 'API & Integrations':
        return ;
      case 'Notifications':
        return ;
      default:
        return <CompanyDetailsPage></CompanyDetailsPage> ;
    }
  };

  const tabs = [
    'Company Details',
    'Admin Profile',
    'Project Management',
    'Employee Management',
    'API & Integrations',
    'Notifications',
  ];

  return (
    <div className="min-h-screen  p-4 font-sans">
      {/* Header Tabs Container */}
      <div className="mb-6">
  {/* Tab buttons */}
  <div className="flex justify-evenly items-center  font-semibold text-gray-600  w-full">
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`px-4 py-2 transition-colors duration-200 ease-in-out w-full text-center
          ${activeTab === tab
            ? 'text-indigo-700 border-b-2 border-indigo-700'
            : 'text-gray-600 hover:text-gray-800'}
        `}
      >
        {tab}
      </button>
    ))}
  </div>
  {/* Divider line */}
  <div className="w-full h-px bg-gray-200 mt-2"></div>
</div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default SidebarSetting;