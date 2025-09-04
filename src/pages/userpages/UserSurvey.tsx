/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Pagination from "@/components/UserSurvey/Pagination";
import { useGetSurveyQuery, useGetPollQuery } from "@/store/api/employe/getPollAndSurvey";
import { FaSpinner } from "react-icons/fa";

interface Item {
  id: string;
  title: string;
  createdBy: string;
  createdAt: string;
  reminderTime: string;
  user: any;
  status: "Active" | "Completed";
  isResponded: boolean;
}

const ITEMS_PER_PAGE = 8;

const UserSurvey: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"survey" | "pool">("survey");
  const [searchTerm, setSearchTerm] = useState("");

  // Survey API with polling for auto-refetch
  const {
    data: surveyData,
    isLoading: surveyLoading,
    error: surveyError,
    refetch: refetchSurveys,
  } = useGetSurveyQuery(
    { page: currentPage, limit: ITEMS_PER_PAGE },
    {
      pollingInterval: 30000, // Auto-refetch every 30 seconds
      skip: activeTab !== "survey", // Skip if not active tab
    }
  );

  // Poll API with polling for auto-refetch
  const {
    data: poolData,
    isLoading: poolLoading,
    error: poolError,
    refetch: refetchPolls,
  } = useGetPollQuery(
    { page: currentPage, limit: ITEMS_PER_PAGE },
    {
      pollingInterval: 30000, // Auto-refetch every 30 seconds
      skip: activeTab !== "pool", // Skip if not active tab
    }
  );

  // Refetch data when tab changes
  useEffect(() => {
    if (activeTab === "survey") {
      refetchSurveys();
    } else {
      refetchPolls();
    }
  }, [activeTab, refetchSurveys, refetchPolls]);

  // Refetch data when page changes
  useEffect(() => {
    if (activeTab === "survey") {
      refetchSurveys();
    } else {
      refetchPolls();
    }
  }, [currentPage, activeTab, refetchSurveys, refetchPolls]);

  // Surveys and polls data
  const surveys: Item[] = surveyData?.data ?? [];
  const pools: Item[] = poolData?.data ?? [];

  const activeData = activeTab === "survey" ? surveys : pools;
  const isLoading = activeTab === "survey" ? surveyLoading : poolLoading;
  const error = activeTab === "survey" ? surveyError : poolError;

  // Filter data based on search term
  const filteredData = activeData.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()));

  // For pagination, we need to handle both client-side and server-side pagination
  // Since the API returns paginated data, we'll use that for the main display
  // but client-side filtering for search
  const totalItems = activeData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // If we're searching, we need to paginate the filtered results client-side
  const displayData = searchTerm ? filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE) : activeData;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-primary mb-4">Available Surveys & Polls</h1>
            <p className="text-sm text-gray-500">View and take all surveys & polls</p>
          </div>
          <div className="relative w-full md:w-96 mt-4 md:mt-0">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-[#D9D9D9] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-300">
          <button
            className={`px-4 py-2 font-medium cursor-pointer ${activeTab === "survey" ? "border-b-2 border-primary text-primary" : "text-gray-600"}`}
            onClick={() => {
              setActiveTab("survey");
              setCurrentPage(1);
            }}
          >
            Surveys
          </button>
          <button
            className={`px-4 py-2 font-medium cursor-pointer ${activeTab === "pool" ? "border-b-2 border-primary text-primary" : "text-gray-600"}`}
            onClick={() => {
              setActiveTab("pool");
              setCurrentPage(1);
            }}
          >
            Polls
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-[#C8CAE7] rounded-md px-6">
          <table className="min-w-full divide-y divide-primary text-sm">
            <thead>
              <tr>
                {["Title", "Created By", "Created At", "End Time", "Status", "Action"].map((text) => (
                  <th key={text} scope="col" className="px-6 py-3 text-left text-xs font-semibold text-[#484848] uppercase tracking-wider">
                    {text}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C8CAE7]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    <FaSpinner className="mx-auto animate-spin text-2xl text-primary" />
                    <p className="mt-2">Loading {activeTab}...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-red-600">
                    Failed to load {activeTab}.
                  </td>
                </tr>
              ) : displayData.length > 0 ? (
                displayData.map((item: Item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-[#484848] font-medium">{item.title || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-[#484848]">{item?.user?.profile?.firstName || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-[#484848]">{formatDate(item.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-[#484848]">{formatDate(item.reminderTime)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${
                          item.status === "Active" ? "bg-[#D2F8E7] text-[#2EBD85]" : "bg-[#FFE9C1] text-[#F4A300]"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/user/take-${activeTab}/${item.id}/assigned`}>
                        <button
                          className={`px-4 py-2 rounded-full transition cursor-pointer ${
                            item.isResponded ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-primary text-white hover:bg-primary-dark"
                          }`}
                          disabled={item.isResponded}
                        >
                          Take
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No {activeTab}s found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {/* {totalPages > 1 && ( */}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        {/* )} */}
      </div>
    </div>
  );
};

export default UserSurvey;
