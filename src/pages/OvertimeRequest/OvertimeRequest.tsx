/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomPagination from "@/components/shared/CustomPagination/CustomPagination";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import usePagination from "@/hooks/usePagination";
import { useGetAllOvertimeRequestForAdminQuery, useUpdateOvertimeRequestMutation } from "@/store/api/admin/overtime";
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

const OvertimeRequest = () => {
  const { currentPage, goToNext, goToPrevious, goToPage, getPageNumbers } = usePagination({
    noOfItemPerPage: 10,
  });
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [updateOvertimeStatus] = useUpdateOvertimeRequestMutation();
  const { data: overTimeData, isLoading } = useGetAllOvertimeRequestForAdminQuery({ currentPage });
  console.log("====== Over =====>", overTimeData);
  const handleAcceptOvertimeRequest = async (id: string) => {
    console.log(id);
    setIsAccepting(true);
    try {
      const result = await updateOvertimeStatus({
        id,
        data: {
          isApproved: true,
        },
      }).unwrap();
      console.log(result);
      if (result?.success) {
        toast.success("Overtime request Accepted!");
      }
    } catch (error: any) {
      console.error("Error publishing task:", error);
      toast.error(error?.data?.message); // Add a toast for failure
    } finally {
      setIsAccepting(false);
    }
  };
  const handleRejectOvertimeRequest = async (id: string) => {
    setIsRejecting(true);
    try {
      const result = await updateOvertimeStatus({
        id,
        data: {
          isApproved: false,
        },
      }).unwrap();
      console.log(result);
      if (result?.success) {
        toast.success("Overtime request rejected!");
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
        {!isLoading && (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full leading-normal">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Employee ID
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Employee Email
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Overtime Hours
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
                    <th className="px-5 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">
                      Reason
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>

                    <th className="px-5 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {overTimeData?.data?.map((item: any) => (
                    <tr key={item.id} className="hover:bg-gray-50 ">
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{item?.user?.employeeID || "N/A"}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{item?.user?.email || "N/A"}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <span className="text-gray-900 whitespace-no-wrap font-medium bg-slate-100 px-2 py-1 rounded-md ">
                          {item?.timeClock?.overtimeHours || "N/A"} hr
                        </span>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{formatDate(item?.timeClock?.clockInAt)}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{formatTime(item?.timeClock?.clockInAt)}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{formatDate(item?.timeClock?.clockOutAt)}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{formatTime(item?.timeClock?.clockOutAt)}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm w-28">
                        <p className="text-gray-900 whitespace-no-wrap">{item?.reason || "N/A"}</p>
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

                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                        <div className="flex items-center justify-start">
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
                                onClick={() => handleAcceptOvertimeRequest(item?.id)}
                              >
                                {isAccepting ? <FaSpinner className="animate-spin" /> : "Accept"}
                              </span>

                              <span
                                onClick={() => handleRejectOvertimeRequest(item?.id)}
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
                totalPages={overTimeData?.metadata.totalPage}
                isLoading={isLoading}
                getPageNumbers={getPageNumbers}
                goToPage={goToPage}
                goToPrevious={goToPrevious}
                goToNext={goToNext}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OvertimeRequest;
