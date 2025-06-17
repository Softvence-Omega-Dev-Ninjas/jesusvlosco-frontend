import { useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import { Chat } from "../../pages/Chats"; // Assuming this is correct
import { CompanyUpdate } from "../../pages/CompanyUpdate"; // Assuming this is correct
import EmployeeDirectory from "@/components/ChatsComponents/EmployeeDirectory";

export const Communication = () => {
  const [activeTab, setActiveTab] = useState("chat"); // Default to 'chat'
  const location = useLocation(); // Get the current location object
    const renderContent = () => {
        // Check if the current path includes 'recognition'
        // This will allow rendering Recognition specific content when the URL is /communication/recognition
        if (location.pathname.includes('/recognition')) {
            return (
                <div className="p-4 bg-white rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-3">Recognition Content</h2>
                    <p className="text-gray-700">
                        This section displays content specific to Recognition.
                        The tab-switching UI is hidden for this specific route.
                    </p>
                </div>
            );
        }

        // If not on the /recognition path, proceed with tab-switching logic
        if (activeTab === 'chat') {
            return <Chat />;
        } else if (activeTab === 'community') {
            return <CompanyUpdate />;
        }
        return null; // Fallback
    };

    // Determine if the tab buttons should be displayed
    const showTabButtons = !location.pathname.includes('/recognition');

    return (
        <div className="md:p-6 mx-2">
            <h1 className="text-2xl font-bold mb-6">Communication</h1>

            {/* Conditionally render tab buttons */}
            {showTabButtons && (
                <div className="flex flex-col md:flex-row justify-between space-x-2 mb-6">
                    <div className='flex gap-4'>
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`md:py-2 md:px-4 whitespace-nowrap  text-lg rounded-md transition duration-200 ${activeTab === 'chat'
                                ? 'bg-purple-700 text-white shadow-md'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                        >
                            Team Chat
                        </button>

                        <button
                            onClick={() => setActiveTab('community')}
                            className={`md:py-2 md:px-4 whitespace-nowrap text-lg rounded-md transition duration-200 ${activeTab === 'community'
                                ? 'bg-purple-700 text-white shadow-md'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                        >
                            Company Update & announcement
                        </button>
                    </div>

    // If not on the /recognition path, proceed with tab-switching logic
    if (activeTab === "chat") {
      return <Chat />;
    } else if (activeTab === "community") {
      return <CompanyUpdate />;
    }
    return null; // Fallback
  };

  // Determine if the tab buttons should be displayed
  const showTabButtons = !location.pathname.includes("/recognition");

  return (
    <div className="md:p-6 mx-3">
      <h1 className="text-2xl font-bold mb-6">Communication</h1>

      <div className="flex">
        <div className="w-[80%] pr-5">
          {showTabButtons && (
            <div className="flex flex-col md:flex-row justify-between space-x-2 mb-6">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`md:py-2 md:px-4 whitespace-nowrap  text-lg rounded-md transition duration-200 ${
                    activeTab === "chat"
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  Team Chat
                </button>

                <button
                  onClick={() => setActiveTab("community")}
                  className={`md:py-2 md:px-4 whitespace-nowrap text-lg rounded-md transition duration-200 ${
                    activeTab === "community"
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  Company Update & announcement
                </button>
              </div>
            </div>
          )}
          <div>{renderContent()}</div>
        </div>

        <div className="pl-5 border-l border-website-color-border">
          <h1 className="text-xl font-bold">Employee Directory</h1>
          <EmployeeDirectory />
        </div>
      </div>
    </div>
  );
};
