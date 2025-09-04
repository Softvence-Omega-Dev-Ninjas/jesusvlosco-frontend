/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Calendar, ThumbsUp, MessagesSquare, LoaderCircle } from "lucide-react";
import DatePickerModal from "@/components/RecognitionTable/DatePickerModal";
import SendReactionModal from "@/components/RecognitionTable/SendReactionModal";
import {
  useAddCommentMutation,
  useGetAllRecognationQuery,
} from "@/store/api/admin/recognation/recognationApi";
import { formatDateToMDY } from "@/utils/formatDateToMDY";
import { PiUserCircleLight } from "react-icons/pi";
import Pagination from "@/utils/Pagination";
import TableLoadingSpinner from "@/utils/TableLoadingSpinner";
import { toast } from "sonner";

export default function RecognitionTable() {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  // Get today's date
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const today = new Date();
  const [selectedRecognation, setSelectedRecognation] = useState({});
  console.log({ selectedRecognation });
  
  // Get last day of current month
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [fromDate, setFromDate] = useState({
    day: "01",
    month: monthNames[today.getMonth()],
    year: String(today.getFullYear()),
  });

  const [toDate, setToDate] = useState({
    day: String(lastDayOfMonth.getDate()).padStart(2, "0"),
    month: monthNames[today.getMonth()],
    year: String(today.getFullYear()),
  });
  const toISO = (dateObj: { day: string; month: string; year: string }) =>
    new Date(`${dateObj.day} ${dateObj.month} ${dateObj.year}`).toISOString();

  const [datas, setDatas] = useState({
    fromDate: toISO(fromDate),
    toDate: toISO(toDate),
  });
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const { data, isLoading, isFetching } = useGetAllRecognationQuery({
    page: currentPage,
    limit,
    startDate: datas?.fromDate,
    endDate: datas?.toDate,
  });
  console.log({ isFetching, isLoading });
  const recognation = data?.data?.data;
  const meta = data?.data?.meta;
  console.log({ recognation, meta });

  // Update ISO dates whenever fromDate or toDate changes
  useEffect(() => {
    setDatas({
      fromDate: toISO(fromDate),
      toDate: toISO(toDate),
    });
  }, [fromDate, toDate]);

  console.log(datas);
  const [selectingFrom, setSelectingFrom] = useState(true);

  const handleDateClick = (day: number) => {
    const dayStr = String(day).padStart(2, "0");

    if (selectingFrom) {
      setFromDate({ ...fromDate, day: dayStr });
      setSelectingFrom(false);
    } else {
      if (day < Number.parseInt(fromDate.day)) {
        setToDate({ ...toDate, day: fromDate.day });
        setFromDate({ ...fromDate, day: dayStr });
      } else {
        setToDate({ ...toDate, day: dayStr });
      }
      setSelectingFrom(true);
    }
  };

  const isDateInRange = (day: number) => {
    const fromDay = Number.parseInt(fromDate.day);
    const toDay = Number.parseInt(toDate.day);
    return day >= fromDay && day <= toDay;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // fetch new data here from API using `page`
  };

  // send reaction modul
  const [isReactionModalOpen, setIsReactionModalOpen] = useState(false);

  const openReactionModal = () => setIsReactionModalOpen(!false);
  const closeReactionModal = () => setIsReactionModalOpen(false);
  const [addComment] = useAddCommentMutation();
  const handleLike = async (id: string) => {
    console.log({ id });
    try {
      const result = await addComment({
        recognitionId: id,
        data: { reaction: "LIKE" },
      }).unwrap();
      console.log({ result });
      if (result.success) {
        toast.success("Like added");
      }
    } catch (error: any) {
      console.log({ error });
      toast.error(error?.message);
    }
  };
  return (
    <div>
      {/* <NavLink to={'/send-recognition'}>Send</NavLink> */}
      {/* header section  */}
      <div className="flex flex-col items-center justify-center p-6 md:flex-row md:justify-between md:items-center  ">
        {/* Left side - Title and subtitle */}
        <div className="flex flex-col  ">
          <h1 className="text-2xl text-center md:text-left font-semibold text-[#4E53B1] mb-1">
            Recognition
          </h1>
          <p className="text-gray-600 text-sm">
            Celebrate achievements & keep them motivated
          </p>
        </div>

        {/* Right side - Action buttons */}
        <div className="flex items-center  gap-3 mt-4 md:mt-0">
          <button
            onClick={() => {
              window.location.href = "/admin/send-recognition";
            }}
            className="px-4 cursor-pointer  bg-[#4E53B1] text-white text-sm py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Send recognition
          </button>
          <button
            onClick={() => {
              window.location.href = "/admin/badge-library";
            }}
            className="px-4 py-3 cursor-pointer bg-gray-100 text-gray-700 text-sm  rounded-md hover:bg-gray-200 transition-colors"
          >
            Badge library
          </button>
        </div>
      </div>
      {/* start table here  */}
      <div className="w-full ">
        {/* Date Range Picker */}
        <div className="flex justify-center md:justify-end p-6 bg-gray-50">
          <button
            className="flex items-center cursor-pointer gap-2 text-[#5B5B5B] px-4 py-3 border border-[#C5C5C5] rounded-md  hover:bg-gray-50 transition-colors text-sm"
            onClick={() => setIsDatePickerOpen(true)}
          >
            <Calendar className="w-4 h-4" />
            {fromDate.day} {fromDate.month} to {toDate.day} {toDate.month} {toDate.year}
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto  ">
          <table className="w-full ">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 font-medium text-gray-700 text-sm">
                  Date
                </th>
                <th className="text-center p-4 font-medium text-gray-700 text-sm">
                  Sent to
                </th>
                <th className="text-center p-4 font-medium text-gray-700 text-sm">
                  Type
                </th>
                <th className="text-center p-4 font-medium text-gray-700 text-sm">
                  Message
                </th>
                <th className="text-center p-4 font-medium text-gray-700 text-sm">
                  Viewer
                </th>
                <th className="px-4 p-4 font-medium text-end  text-gray-700 text-sm">
                  Reaction
                </th>
              </tr>
            </thead>
            {isLoading ? (
              <div className=" absolute inset-0 opacity-80 w-full flex justify-center items-center">
                <LoaderCircle size={40} className="animate-spin" />
              </div>
            ) : (
              <tbody className="relative">
                {recognation?.map((activity: any, index: number) => (
                  <tr
                    key={index}
                    className="border-b py-4 border-[#C5C5C5] hover:bg-gray-50"
                  >
                    {/* Date Column */}
                    <td className="p-4 text-gray-600 text-sm">
                      {formatDateToMDY(activity?.createdAt as string)}
                    </td>

                    {/* Sent to Column */}
                    <td className="p-4 ">
                      <div className="flex items-center justify-start gap-3">
                        {activity?.recognitionUsers.length === 1 ? (
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                activity.recognitionUsers[0]?.user?.profile
                                  ?.profileUrl || "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(`${activity.recognitionUsers[0]?.user?.profile.firstName} ${activity.recognitionUsers[0]?.user?.profile.lastName}`)
                              }
                              alt={
                                activity.recognitionUsers[0]?.user?.profile
                                  ?.firstName
                              }
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <span className="text-sm  text-[#4E53B1]">
                              {activity.recognitionUsers[0]?.user?.profile
                                ?.firstName +
                                " " +
                                activity.recognitionUsers[0]?.user?.profile
                                  ?.lastName}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <div className="flex -space-x-2">
                              {activity?.recognitionUsers
                                .slice(0, 3)
                                .map((user: any, userIndex: number) => (
                                  <div>
                                    {user?.profile?.profileUrl ? (
                                      <img
                                        key={userIndex}
                                        src={
                                          user?.profile?.profileUrl ||
                                          "https://ui-avatars.com/api/?name=" +
                                            encodeURIComponent(`${user?.profile?.firstName} ${user?.profile?.lastName}`)
                                        }
                                        alt={user?.profile?.firstName}
                                        className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                      />
                                    ) : (
                                      <PiUserCircleLight size={36} />
                                    )}
                                  </div>
                                ))}
                              {activity.recognitionUsers.length > 3 && (
                                <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center">
                                  <span className="text-gray-600 text-xs ">
                                    +{activity.recognitionUsers.length - 3}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Type Column */}
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {typeof activity?.badge?.iconImage === "string" ? (
                          <img
                            src={activity?.badge?.iconImage || "https://ui-avatars.com/api/?name=" +
                              encodeURIComponent(`${activity?.badge?.title}`)}
                            alt=""
                            className="h-8 w-6"
                          />
                        ) : (
                          activity?.badge?.title
                        )}
                        <span className="text-sm text-gray-700 ml-2">
                          {activity.badge?.category}
                        </span>
                      </div>
                    </td>

                    {/* Message Column */}
                    <td className="p-4 text-gray-600 text-sm text-center">
                      {activity?.message}
                    </td>

                    {/* Viewer Column */}
                    <td className="p-4 text-gray-600 text-center text-sm">
                      {activity?.visibility}
                    </td>

                    {/* Reaction Column */}
                    <td className="p-4 text-end">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => handleLike(activity?.id)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <ThumbsUp className="w-4 h-4 cursor-pointer text-gray-400 hover:text-blue-500" />
                        </button>
                        <span className="text-[#C5C5C5]">|</span>
                        <button
                          className="p-1 hover:bg-gray-100 rounded transition-colors relative"
                          onClick={() => {
                            openReactionModal();
                            setSelectedRecognation(activity);
                          }}
                        >
                          <MessagesSquare className="w-4 h-4 cursor-pointer text-black hover:text-blue-500" />
                          {activity.messageCount > 0 && (
                            <div className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-[#D9F0E4] rounded-full flex items-center justify-center">
                              <span className="text-[#1EBD66] text-xs font-medium leading-none px-1">
                                {activity.messageCount}
                              </span>
                            </div>
                          )}
                        </button>
                      </div>
                    </td>
                    {/* {isReactionModalOpen && <SendReactionModal onClose={closeReactionModal} />} */}
                  </tr>
                ))}
                {!isLoading && isFetching && <TableLoadingSpinner />}
              </tbody>
            )}
          </table>
          {/* Overlay Loader */}

          <Pagination
            currentPage={currentPage}
            totalPages={meta?.totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Date Range Picker Modal */}
        <DatePickerModal
          isOpen={isDatePickerOpen}
          onClose={() => setIsDatePickerOpen(false)}
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          onDateClick={handleDateClick}
          isDateInRange={isDateInRange}
        />
        {/* reaction modal  */}
        {isReactionModalOpen && (
          <SendReactionModal
            recognation={selectedRecognation}
            onClose={closeReactionModal}
          />
        )}
      </div>
    </div>
  );
}
