/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetAllSurveysQuery } from "@/store/api/admin/survey/servey";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Survey } from "./SurveyMainPage";
import { FaSpinner } from "react-icons/fa";

const SurveyTable = ({
  setOpenModalType,
  setSelectedSurveyForQuickView,
}: {
  setOpenModalType: React.Dispatch<React.SetStateAction<"filter" | "columns" | "quickView" | "calendar" | "teamMembers" | null>>;
  setSelectedSurveyForQuickView: React.Dispatch<React.SetStateAction<Survey | null>>;
}) => {
  // const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Debounced search term
  // const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setDebouncedSearchTerm(searchTerm);
  //     setCurrentPage(1); // Reset to first page when search changes
  //   }, 500);

  //   return () => clearTimeout(timer);
  // }, [searchTerm]);

  const { data: surveyData, isLoading } = useGetAllSurveysQuery({
    page: currentPage,
    limit: itemsPerPage,
    // search: debouncedSearchTerm || undefined, // Only send if there's a search term
  });

  const surveys = surveyData?.data || [];
  const metadata = surveyData?.metadata || {
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  };

  const columnOptions = [
    { id: "title", label: "Survey title", isVisible: true },
    { id: "createdBy", label: "Created By", isVisible: true },
    { id: "startDate", label: "Start Date", isVisible: true },
    { id: "endDate", label: "End Date", isVisible: true },
    { id: "status", label: "Status", isVisible: true },
    { id: "assignTo", label: "Assign to", isVisible: true },
    { id: "action", label: "Action", isVisible: true },
  ];

  // Function to get appropriate Tailwind classes for status badges
  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "ACTIVE":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "COMPLETED":
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case "DRAFT":
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Pagination helper functions
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < metadata.totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const totalPages = metadata.totalPage;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  // Calculate display range for "Showing X to Y of Z results"
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, metadata.total);

  // if (isLoading) return <TableLoadingSpinner />;

  return (
    <div>
      {/* Search input and filter/date buttons section */}
      {/* <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search entries"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
          />
        </div>
      </div> */}
      {isLoading && (
        <div className="flex items-center justify-center opacity-50 h-44 w-full">
          <FaSpinner className="animate-spin text-4xl" />
        </div>
      )}

      {!isLoading && (
        <div className="rounded-lg shadow-sm border border-gray-200 p-4">
          {/* Survey Table */}
          <div className="w-full overflow-x-auto">
            <table className="min-w-[900px] w-full">
              <thead>
                <tr>
                  {columnOptions.map((column) => (
                    <th
                      key={column.id}
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300"
                    >
                      <div className="flex font-semibold items-center">
                        <div className="text-[#484848]">{column.label}</div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {surveys.map((survey: any) => (
                  <tr key={survey.id} className="hover:bg-gray-50">
                    {columnOptions.map((column) => (
                      <td key={`${survey.id}-${column.id}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {column.id === "title" && <span className="font-normal text-[#484848] text-base capitalize">{survey.title}</span>}
                        {column.id === "createdBy" && survey.createdBY}
                        {column.id === "startDate" && <span className="text-gray-700">{new Date(survey.createdAt).toLocaleDateString("en-US")}</span>}
                        {column.id === "endDate" && <span className="text-gray-700">{new Date(survey.publishTime).toLocaleDateString("en-US")}</span>}
                        {column.id === "status" && <span className={`${getStatusBadge(survey.status)} p-1`}>{survey.status}</span>}
                        {column.id === "assignTo" && (
                          <div className="flex items-center">
                            {survey.assignTo ? (
                              <span className="bg-gray-100 text-[#484848] px-2 py-1 rounded-full text-xs font-medium">{survey.assignedTo}</span>
                            ) : (
                              <button className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium cursor-pointer hover:bg-indigo-200">
                                {survey.assignedTo}
                              </button>
                            )}
                          </div>
                        )}
                        {column.id === "action" && (
                          <div className="flex items-center gap-3">
                            <button
                              className="text-gray-600 cursor-pointer"
                              onClick={() => {
                                setSelectedSurveyForQuickView(survey);
                                setOpenModalType("quickView");
                              }}
                            >
                              <Eye size={24} />
                            </button>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Show message if no surveys found */}
            {surveys.length === 0 && !isLoading && <div className="text-center py-8 text-gray-500">{"No surveys available"}</div>}
          </div>

          {/* Pagination */}
          {metadata.totalPage > 1 && (
            <div className="flex items-center justify-between mt-6 px-2">
              {/* Results info */}
              <div className="text-sm text-gray-700">
                Showing {startIndex} to {endIndex} of {metadata.total} results
              </div>

              {/* Pagination controls */}
              <div className="flex items-center space-x-1">
                {/* Previous button */}
                <button
                  onClick={goToPrevious}
                  disabled={currentPage === 1 || isLoading}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === 1 || isLoading ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Previous
                </button>

                {/* Page numbers */}
                <div className="flex space-x-1">
                  {getPageNumbers().map((pageNumber, index) => (
                    <div key={index}>
                      {pageNumber === "..." ? (
                        <span className="px-3 py-2 text-sm text-gray-500">...</span>
                      ) : (
                        <button
                          onClick={() => goToPage(pageNumber as number)}
                          disabled={isLoading}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            currentPage === pageNumber
                              ? "bg-indigo-600 text-white"
                              : isLoading
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Next button */}
                <button
                  onClick={goToNext}
                  disabled={currentPage === metadata.totalPage || isLoading}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === metadata.totalPage || isLoading
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  Next
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SurveyTable;
