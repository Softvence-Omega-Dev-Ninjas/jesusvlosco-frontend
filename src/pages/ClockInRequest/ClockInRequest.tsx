/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomPagination from "@/components/shared/CustomPagination/CustomPagination";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import usePagination from "@/hooks/usePagination";
import { useGetAllClockInRequestForAdminQuery, useUpdateClockInRequestMutation } from "@/store/api/admin/shift-sheduling";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaSpinner } from "react-icons/fa";
import { toast } from "sonner";

const formatDate = (dateString: any) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (dateString: any) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "text-green-600";
    case "PENDING":
      return "text-yellow-600";
    case "REJECTED":
      return "text-red-600";
    default:
      return "text-gray-500";
  }
};

const ClockInRequest = () => {
  const { currentPage, goToNext, goToPrevious, goToPage, getPageNumbers, metadata } = usePagination({
    noOfItemPerPage: 10,
  });
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [updateClockInStatus] = useUpdateClockInRequestMutation();
  const { data: clockInData, isLoading } = useGetAllClockInRequestForAdminQuery({ currentPage });
  console.log(clockInData);
  // update metadata after API response
  if (clockInData?.metadata && metadata.total !== clockInData.metadata.total) {
    metadata.total = clockInData.metadata.total;
    metadata.totalPage = clockInData.metadata.totalPage;
    metadata.limit = clockInData.metadata.limit;
  }
  const handleAcceptClockInRequest = async (id: string) => {
    console.log(id);
    setIsAccepting(true);
    try {
      const result = await updateClockInStatus({
        id,
        data: {
          isApproved: true,
        },
      }).unwrap();
      console.log(result);
      if (result?.success) {
        toast.success("Clock-in request Accepted!");
      }
    } catch (error: any) {
      console.error("Error publishing task:", error);
      toast.error(error?.data?.message); // Add a toast for failure
    } finally {
      setIsAccepting(false);
    }
  };
  const handleRejectClockInRequest = async (id: string) => {
    setIsRejecting(true);
    try {
      const result = await updateClockInStatus({
        id,
        data: {
          isApproved: false,
        },
      }).unwrap();
      console.log(result);
      if (result?.success) {
        toast.success("Clock-in request rejected successfully!");
      }
    } catch (error: any) {
      console.error("Error publishing task:", error);
      toast.error(error?.data?.message);
      // Add a toast for failure
    } finally {
      setIsRejecting(false);
    }
  };
  return (
    <div className="mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-8">Clock In Request</h1>
      <div className="bg-white shadow-sm rounded-sm overflow-hidden">
        {isLoading && (
          <div className="flex items-center justify-center opacity-50 h-96 w-full">
            <FaSpinner className="animate-spin text-4xl" />
          </div>
        )}
        {!isLoading &&
          (clockInData?.data?.length > 0 ? (
            <div>
              <div className="overflow-x-auto">
                <table className="min-w-full leading-normal">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-5 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Shift Title
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Clock In Date
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Clock In Time
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Clock Out Date
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Clock Out Time
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Employee ID
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {clockInData?.data?.map((item: any) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">{item?.shift?.shiftTitle || "N/A"}</p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">{formatDate(item?.requestedClockInAt)}</p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">{formatTime(item?.requestedClockInAt)}</p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">{formatDate(item?.requestedClockOutAt)}</p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">{formatTime(item?.requestedClockOutAt)}</p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">{item?.location || "N/A"}</p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${getStatusColor(item?.status)}`}>
                            <span
                              aria-hidden="true"
                              className={`absolute inset-0 opacity-50 rounded-full ${
                                item?.status === "APPROVED" ? "bg-green-200" : item?.status === "REJECTED" ? "bg-red-200" : "bg-yellow-200"
                              }`}
                            ></span>
                            <span className="relative">{item?.status || "N/A"}</span>
                          </span>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">{item?.user?.employeeID || "N/A"}</p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                          <div className="relative">
                            <DropdownMenu>
                              <DropdownMenuTrigger className="outline-none hover:scale-105 active:scale-95 duration-700 cursor-pointer">
                                <BsThreeDots className="mt-2" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                side="bottom"
                                className="bg-[#f7fbfe] border-none shadow-md shadow-secondary-bg-light outline-none p-2 flex flex-col gap-2"
                              >
                                <span
                                  className="hover:text-green-700 hover:bg-green-50 border-2 border-[#e9ebec]  py-2 px-5 rounded-lg hover:bg-light-primary-bg dark:hover:bg-dark-secondary-bg font-medium text-sm w-full cursor-pointer flex items-center justify-center"
                                  onClick={() => handleAcceptClockInRequest(item?.id)}
                                >
                                  {isAccepting ? <FaSpinner className="animate-spin" /> : "Accept"}
                                </span>

                                <span
                                  onClick={() => handleRejectClockInRequest(item?.id)}
                                  className="hover:text-red-700 hover:bg-red-50 border-2 border-[#e9ebec]  py-2 px-5 rounded-lg hover:bg-light-primary-bg dark:hover:bg-dark-secondary-bg font-medium text-sm w-full cursor-pointer flex items-center justify-center"
                                >
                                  {isRejecting ? <FaSpinner className="animate-spin" /> : "Reject"}
                                </span>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-end mt-6 px-2 py-6">
                <CustomPagination
                  currentPage={currentPage}
                  totalPages={clockInData?.metadata.totalPage}
                  isLoading={isLoading}
                  getPageNumbers={getPageNumbers}
                  goToPage={goToPage}
                  goToPrevious={goToPrevious}
                  goToNext={goToNext}
                />
              </div>
            </div>
          ) : (
            <div className="text-center my-10">
              <h1>No Clock In request available.</h1>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ClockInRequest;
