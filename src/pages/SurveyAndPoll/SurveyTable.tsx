/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDeleteSurveyMutation, useGetAllSurveysQuery } from "@/store/api/admin/survey/servey";
import { Eye } from "lucide-react";
import { FaSpinner } from "react-icons/fa";
import usePagination from "@/hooks/usePagination";
import { Survey } from "./SurveyMainPage";
import CustomPagination from "@/components/shared/CustomPagination/CustomPagination";
import { MdOutlineDelete } from "react-icons/md";
import { toast } from "sonner";

const SurveyTable = ({
  setOpenModalType,
  setSelectedSurveyForQuickView,
}: {
  setOpenModalType: React.Dispatch<React.SetStateAction<"filter" | "columns" | "quickView" | "calendar" | "teamMembers" | null>>;
  setSelectedSurveyForQuickView: React.Dispatch<React.SetStateAction<Survey | null>>;
}) => {
  const [deleteSurvey] = useDeleteSurveyMutation();
  // pagination hook first
  const { currentPage, goToNext, goToPrevious, goToPage, getPageNumbers, metadata } = usePagination({
    noOfItemPerPage: 10,
  });

  // fetch data with current page
  const {
    data: surveyData,
    isLoading,
    isFetching,
  } = useGetAllSurveysQuery({
    page: currentPage,
  });

  // update metadata after API response
  if (surveyData?.metadata && metadata.total !== surveyData.metadata.total) {
    metadata.total = surveyData.metadata.total;
    metadata.totalPage = surveyData.metadata.totalPage;
    metadata.limit = surveyData.metadata.limit;
  }

  const surveys = surveyData?.data || [];

  const columnOptions = [
    { id: "title", label: "Survey title", isVisible: true },
    { id: "createdBy", label: "Created By", isVisible: true },
    { id: "startDate", label: "Start Date", isVisible: true },
    { id: "endDate", label: "End Date", isVisible: true },
    { id: "status", label: "Status", isVisible: true },
    { id: "assignTo", label: "Assign to", isVisible: true },
    { id: "action", label: "Action", isVisible: true },
  ];

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium capitalize";
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

  const handleDeleteSurvey = async (id: string) => {
    console.log("Survey Id=============>", id);
    try {
      const result = await deleteSurvey(id).unwrap();
      console.log(result);
      if (result?.success) {
        toast.success("Survey deleted successfully!");
      }
    } catch (error: any) {
      console.error("Error deleting survey:", error);
      toast.error(error?.data?.message); // Add a toast for failure
    } finally {
      // setIsOvertimeLoading(false);
    }
  };
  return (
    <div>
      {isLoading ||
        (isFetching && (
          <div className="flex items-center justify-center opacity-50 h-96 w-full">
            <FaSpinner className="animate-spin text-4xl" />
          </div>
        ))}

      {!isLoading && !isFetching && (
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
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {surveys.map((survey: any) => (
                  <tr key={survey.id} className="hover:bg-gray-50">
                    {columnOptions.map((column) => (
                      <td key={`${survey.id}-${column.id}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {column.id === "title" && <span className="text-[#484848] text-base capitalize">{survey.title}</span>}
                        {column.id === "createdBy" && survey.createdBY}
                        {column.id === "startDate" && <span className="text-gray-700">{new Date(survey.createdAt).toLocaleDateString("en-US")}</span>}
                        {column.id === "endDate" && <span className="text-gray-700">{new Date(survey.publishTime).toLocaleDateString("en-US")}</span>}
                        {column.id === "status" && <span className={getStatusBadge(survey.status)}>{survey.status}</span>}
                        {column.id === "assignTo" && (
                          <div className="flex items-center">
                            {survey.assignTo ? (
                              <span className="bg-gray-100 text-[#484848] px-2 py-1 rounded-full text-xs font-medium">{survey.assignedTo}</span>
                            ) : (
                              <button className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium hover:bg-indigo-200">
                                {survey.assignedTo}
                              </button>
                            )}
                          </div>
                        )}
                        {column.id === "action" && (
                          <div className="flex items-center gap-3">
                            <button
                              className="text-gray-600 hover:text-gray-800 cursor-pointer"
                              onClick={() => {
                                setSelectedSurveyForQuickView(survey);
                                setOpenModalType("quickView");
                              }}
                            >
                              <Eye size={20} />
                            </button>
                            <button
                              className="text-red-500 hover:text-red-700 cursor-pointer"
                              onClick={() => {
                                handleDeleteSurvey(survey?.id);
                              }}
                            >
                              <MdOutlineDelete size={20} />
                            </button>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* No data */}
            {surveys.length === 0 && <div className="text-center py-8 text-gray-500">No surveys available</div>}
          </div>
        </div>
      )}
      {/* Pagination */}
      {metadata.totalPage > 1 && (
        <div className="flex items-center justify-end mt-6 px-2 py-6">
          <CustomPagination
            currentPage={currentPage}
            totalPages={metadata.totalPage}
            isLoading={isLoading}
            getPageNumbers={getPageNumbers}
            goToPage={goToPage}
            goToPrevious={goToPrevious}
            goToNext={goToNext}
          />
        </div>
      )}
    </div>
  );
};

export default SurveyTable;
