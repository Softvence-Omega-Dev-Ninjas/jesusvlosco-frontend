import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Pagination from "@/components/UserSurvey/Pagination";
import { useGetPollAndSurveyQuery } from "@/store/api/employe/getPollAndSurvey";
import { FaSpinner } from "react-icons/fa";

interface Survey {
  id: string;
  title: string;
  createdBy: string;
  createdAt: string; // ISO string
  reminderTime: string;
  user: any;
  status: "Active" | "Completed";
  isResponded: boolean;
}

const ITEMS_PER_PAGE = 8;

const UserSurvey: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error, refetch } = useGetPollAndSurveyQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  // Refetch automatically on mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  const surveys: Survey[] = data?.data ?? [];

  const filteredSurveys = surveys.filter((survey) =>
    survey.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSurveys.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentSurveys = filteredSurveys.slice(startIndex, endIndex);

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
            <h1 className="text-xl md:text-2xl font-bold text-primary mb-4">
              Available Surveys
            </h1>
            <p className="text-sm text-gray-500">
              View and take all surveys & poll.
            </p>
          </div>
          <div className="relative w-full md:w-96 mt-4 md:mt-0">
            <input
              type="text"
              placeholder="Search Survey"
              className="w-full pl-10 pr-4 py-2 border border-[#D9D9D9] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-[#C8CAE7] rounded-md px-6">
          <table className="min-w-full divide-y divide-primary text-sm">
            <thead>
              <tr>
                {[
                  "Survey title",
                  "Created By",
                  "Created At",
                  "End Time",
                  "Status",
                  "Action",
                ].map((text) => (
                  <th
                    key={text}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-[#484848] uppercase tracking-wider"
                  >
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
                    <p className="mt-2">Loading surveys...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-red-600">
                    Failed to load surveys.{" "}
                    <button
                      onClick={() => refetch()}
                      className="underline text-blue-600"
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              ) : currentSurveys.length > 0 ? (
                currentSurveys.map((survey: Survey) => (
                  <tr key={survey.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-[#484848] font-medium">
                      {survey.title || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[#484848]">
                      {survey?.user?.profile?.firstName || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[#484848]">
                      {formatDate(survey.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[#484848]">
                      {formatDate(survey.reminderTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${
                          survey.status === "Active"
                            ? "bg-[#D2F8E7] text-[#2EBD85]"
                            : "bg-[#FFE9C1] text-[#F4A300]"
                        }`}
                      >
                        {survey.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/user/take-survey/${survey.id}`}>
                        <button
                          className={`px-4 py-2 rounded-full transition cursor-pointer ${
                            survey.isResponded
                              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                              : "bg-primary text-white hover:bg-primary-dark"
                          }`}
                          disabled={survey.isResponded}
                        >
                          Take Survey
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No surveys found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredSurveys.length > ITEMS_PER_PAGE && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default UserSurvey;
