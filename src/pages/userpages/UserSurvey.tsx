import React, { useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "@/components/UserSurvey/Pagination";

interface Survey {
  id: string;
  title: string;
  createdBy: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Completed";
}

const allSurveys: Survey[] = [
  {
    id: "s001",
    title: "Employee Satisfaction",
    createdBy: "HR Manager",
    startDate: "05/01/2024",
    endDate: "05/15/2025",
    status: "Active",
  },
  {
    id: "s002",
    title: "Workplace Safety",
    createdBy: "Safety Lead",
    startDate: "04/20/2025",
    endDate: "04/20/2025",
    status: "Completed",
  },
  {
    id: "s003",
    title: "Remote Work Feedback",
    createdBy: "Admin Team",
    startDate: "04/20/2025",
    endDate: "04/20/2025",
    status: "Active",
  },
  {
    id: "s004",
    title: "Employee Wellness Check",
    createdBy: "HR Manager",
    startDate: "04/20/2025",
    endDate: "04/20/2025",
    status: "Active",
  },
  {
    id: "s005",
    title: "Diversity & Inclusion feedback",
    createdBy: "HR Manager",
    startDate: "05/01/2024",
    endDate: "05/01/2024",
    status: "Completed",
  },
  {
    id: "s006",
    title: "Team Collaboration Survey",
    createdBy: "HR Manager",
    startDate: "04/20/2025",
    endDate: "04/20/2025",
    status: "Active",
  },
  {
    id: "s007",
    title: "New Policy Awareness",
    createdBy: "HR Manager",
    startDate: "04/20/2025",
    endDate: "04/20/2025",
    status: "Completed",
  },
  {
    id: "s008",
    title: "Employee Engagement Pulse",
    createdBy: "HR Manager",
    startDate: "04/20/2025",
    endDate: "04/20/2025",
    status: "Active",
  },
  ...Array(15)
    .fill(null)
    .map(
      (_, i) =>
        ({
          id: `s${i + 9}`,
          title: `Project Feedback Survey ${i + 1}`,
          createdBy: `Manager ${i % 3}`,
          startDate: "06/01/2025",
          endDate: "06/15/2025",
          status: i % 2 === 0 ? "Active" : "Completed",
        } as Survey)
    ),
];

const ITEMS_PER_PAGE = 8;

const UserSurvey: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSurveys = allSurveys.filter((survey) =>
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

  return (
    <div className="min-h-screen ">
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
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="20"
              height="20"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-[#C8CAE7] rounded-md px-6">
          <table className="min-w-full divide-y divide-primary text-sm ">
            <thead className="">
              <tr>
                {[
                  "Survey title",
                  "Created By",
                  "Start",
                  "End",
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
            <tbody className=" divide-y divide-[#C8CAE7]">
              {currentSurveys.length > 0 ? (
                currentSurveys.map((survey) => (
                  <tr key={survey.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-[#484848] font-medium">
                      {survey.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[#484848]">
                      {survey.createdBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[#484848]">
                      {survey.startDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[#484848]">
                      {survey.endDate}
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
                      {survey.status === "Active" ? (
                        <Link to={`/user/take-survey/${survey.id}`}>
                          <button className="px-4 py-2 rounded-full bg-primary text-white transition">
                            Take Survey
                          </button>
                        </Link>
                      ) : (
                        <button className="px-4 py-2 rounded-full bg-primary text-white transition cursor-not-allowed">
                          Take Survey
                        </button>
                      )}
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
