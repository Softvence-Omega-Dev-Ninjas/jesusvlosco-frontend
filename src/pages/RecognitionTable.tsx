import type React from "react";
import u1 from "@/assets/u1.png";
import light from "@/assets/light.png";
import light2 from "@/assets/light2.png";

import { useState } from "react";
import { Calendar, ThumbsUp, MessagesSquare } from "lucide-react";
import DatePickerModal from "@/components/RecognitionTable/DatePickerModal";
import SendReactionModal from "@/components/RecognitionTable/SendReactionModal";
import { useGetAllRecognationQuery } from "@/store/api/admin/recognation/recognationApi";

interface Activity {
  date: string;
  sentTo: Array<{ name: string; avatar: string }>;
  type: string;
  typeIcon: React.ReactNode;
  message: string;
  viewer: string;
  hasReactions: boolean;
  messageCount: number;
}

export default function RecognitionTable() {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const {data} = useGetAllRecognationQuery(null)
  console.log({data})
  const [fromDate, setFromDate] = useState({
    day: "01",
    month: "May",
    year: "2025",
  });
  const [toDate, setToDate] = useState({
    day: "08",
    month: "May",
    year: "2025",
  });
  const [selectingFrom, setSelectingFrom] = useState(true);

  const activities: Activity[] = [
    {
      date: "6/19/14",
      sentTo: [
        { name: "User 1", avatar: u1 },
        { name: "User 2", avatar: u1 },
        { name: "User 3", avatar: u1 },
        { name: "User 4", avatar: u1 },
      ],
      type: "Team player",
      typeIcon: light2,
      message: "Well-done team",
      viewer: "All",
      hasReactions: true,
      messageCount: 0,
    },
    {
      date: "9/18/16",
      sentTo: [{ name: "Floyd Miles", avatar: u1 }],
      type: "Creative",
      typeIcon: light,
      message: "-----",
      viewer: "Team A",
      hasReactions: true,
      messageCount: 1,
    },
    {
      date: "9/18/16",
      sentTo: [{ name: "Floyd Miles", avatar: u1 }],
      type: "Creative",
      typeIcon: light,
      message: "-----",
      viewer: "Team A",
      hasReactions: true,
      messageCount: 1,
    },
    {
      date: "9/18/16",
      sentTo: [{ name: "Floyd Miles", avatar: u1 }],
      type: "Creative",
      typeIcon: light,
      message: "-----",
      viewer: "Team A",
      hasReactions: true,
      messageCount: 1,
    },
    {
      date: "9/18/16",
      sentTo: [{ name: "Floyd Miles", avatar: u1 }],
      type: "Creative",
      typeIcon: light,
      message: "-----",
      viewer: "Team A",
      hasReactions: true,
      messageCount: 1,
    },
    {
      date: "9/18/16",
      sentTo: [{ name: "Floyd Miles", avatar: u1 }],
      type: "Creative",
      typeIcon: light,
      message: "-----",
      viewer: "Team A",
      hasReactions: true,
      messageCount: 1,
    },
    {
      date: "9/18/16",
      sentTo: [{ name: "Floyd Miles", avatar: u1 }],
      type: "Creative",
      typeIcon: light,
      message: "-----",
      viewer: "Team A",
      hasReactions: true,
      messageCount: 1,
    },
    {
      date: "9/18/16",
      sentTo: [{ name: "Floyd Miles", avatar: u1 }],
      type: "Creative",
      typeIcon: light,
      message: "-----",
      viewer: "Team A",
      hasReactions: true,
      messageCount: 1,
    },
  ];

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

  // send reaction modul
  const [isReactionModalOpen, setIsReactionModalOpen] = useState(false);

  const openReactionModal = () => setIsReactionModalOpen(!false);
  const closeReactionModal = () => setIsReactionModalOpen(false);

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
          onClick={() => { window.location.href = "/admin/send-recognition"; }}
           className="px-4 cursor-pointer  bg-[#4E53B1] text-white text-sm py-3 rounded-md hover:bg-blue-700 transition-colors">
            Send recognition 
          </button>
          <button
           onClick={() => { window.location.href = "/admin/badge-library"; }}
           className="px-4 py-3 cursor-pointer bg-gray-100 text-gray-700 text-sm  rounded-md hover:bg-gray-200 transition-colors">
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
            {fromDate.day} / 05 to {toDate.day} / 05 ▼
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto ">
          <table className="w-full">
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
            <tbody>
              {activities.map((activity, index) => (
                <tr
                  key={index}
                  className="border-b py-4 border-[#C5C5C5] hover:bg-gray-50"
                >
                  {/* Date Column */}
                  <td className="p-4 text-gray-600 text-sm">{activity.date}</td>

                  {/* Sent to Column */}
                  <td className="p-4 ">
                    <div className="flex items-center justify-center gap-3">
                      {activity.sentTo.length === 1 ? (
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              activity.sentTo[0].avatar || "/placeholder.svg"
                            }
                            alt={activity.sentTo[0].name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="text-sm  text-[#4E53B1]">
                            {activity.sentTo[0].name}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div className="flex -space-x-2">
                            {activity.sentTo
                              .slice(0, 3)
                              .map((user, userIndex) => (
                                <img
                                  key={userIndex}
                                  src={user.avatar || "/placeholder.svg"}
                                  alt={user.name}
                                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                />
                              ))}
                            {activity.sentTo.length > 3 && (
                              <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center">
                                <span className="text-gray-600 text-xs ">
                                  +{activity.sentTo.length - 3}
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
                      {typeof activity.typeIcon === "string" ? (
                        <img src={activity.typeIcon} alt="" />
                      ) : (
                        activity.typeIcon
                      )}
                      <span className="text-sm text-gray-700 ml-2">
                        {activity.type}
                      </span>
                    </div>
                  </td>

                  {/* Message Column */}
                  <td className="p-4 text-gray-600 text-sm text-center">
                    {activity.message}
                  </td>

                  {/* Viewer Column */}
                  <td className="p-4 text-gray-600 text-center text-sm">
                    {activity.viewer}
                  </td>

                  {/* Reaction Column */}
                  <td className="p-4 text-end">
                    <div className="flex items-center gap-1 justify-end">
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <ThumbsUp className="w-4 h-4 cursor-pointer text-gray-400 hover:text-blue-500" />
                      </button>
                      <span className="text-[#C5C5C5]">|</span>
                      <button
                        className="p-1 hover:bg-gray-100 rounded transition-colors relative"
                        onClick={openReactionModal}
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
            </tbody>
          </table>
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
        {isReactionModalOpen && <SendReactionModal onClose={closeReactionModal} />}
      </div>
    </div>
  );
}
