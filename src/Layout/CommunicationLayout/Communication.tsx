import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Chat } from "../../pages/Chats";
import { CompanyUpdate } from "../../pages/CompanyUpdate";
import RecognitionTable from "@/pages/RecognitionTable";

export const Communication = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const location = useLocation();

  const renderContent = () => {
    if (location.pathname.includes("/recognition")) {
      return (
        <RecognitionTable></RecognitionTable>
      );
    }

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


    <div className="py-4">


      {/* Conditionally render tab buttons */}
      <div>
        {showTabButtons && (
          <div className="flex flex-col md:flex-row justify-between space-x-2 mb-6">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab("chat")}
                className={`py-1 px-3 md:py-2 md:px-4 whitespace-nowrap md:text-lg rounded-md transition duration-200 ${activeTab === "chat"
                  ? "bg-primary text-white shadow-md"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
              >
                Team Chat
              </button>

              <button
                onClick={() => setActiveTab("community")}
                className={`py-1 px-3 md:py-2 md:px-4 whitespace-nowrap md:text-lg rounded-md transition duration-200 ${activeTab === "community"
                  ? "bg-primary text-white shadow-md"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
              >
                Company Update & announcement
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Conditionally render content based on activeTab or location */}
      <div>{renderContent()}</div>
    </div>
  );
};
