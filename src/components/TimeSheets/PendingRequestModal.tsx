import React, { useRef, useState } from "react";
import { ActionIcon } from "../TimeOffRequest/Icons";
import { Chat, ChatConversationModal } from "./ChatConversationModal"; // Import Chat as well
// import { UserIcon } from "./Icons";
import FormatShift from "./FormatShift";
import { useUpdateTimeClockAdminMutation } from "@/store/api/admin/time-clock/timeClockApi";
import { toast } from "sonner";

interface PendingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityData: any;
}

const PendingRequestModal: React.FC<PendingRequestModalProps> = ({
  isOpen,
  onClose,
  activityData,
}) => {
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showChatConversationModal, setShowChatConversationModal] =
    useState(false); // State for the new ChatConversation modal
  const actionBtnRef = useRef<HTMLButtonElement>(null);
  const [selectedId, setSelectedId] = useState("");
  console.log({ selectedId });
  if (!isOpen) return null;
  const dummySelectedChat: Chat = {
    id: "chat-1",
    name: "Robert Fox",
    initials: "RF",
    online: true,
    messages: [
      {
        id: 1,
        sender: "other",
        text: "Hello, I need to discuss my shift on the 18th.",
        avatar: "https://randomuser.me/api/portraits/men/77.jpg",
      },
      {
        id: 2,
        sender: "me",
        text: "Sure, what changes are you looking for?",
        avatar: "https://placehold.co/32x32/4E53B1/ffffff?text=ME",
      },
      {
        id: 3,
        sender: "other",
        text: "I'd like to adjust my end time from 05:00 to 06:00.",
        avatar: "https://randomuser.me/api/portraits/men/77.jpg",
      },
      {
        id: 4,
        sender: "me",
        text: "Understood. I will check the schedule and get back to you.",
        avatar: "https://placehold.co/32x32/4E53B1/ffffff?text=ME",
      },
    ],
  };

  const [updateTimeClock] = useUpdateTimeClockAdminMutation();
  const handleUpdate = async (isApproved: boolean) => {
    if (!selectedId) {
      toast.error("Please select a item");
      return;
    }
    try {
      const result = await updateTimeClock({
        shiftId: selectedId,
        data: { isApproved },
      }).unwrap();
      console.log({ result });
      if (result?.success) {
        toast.success(`Request ${isApproved ? "Approved" : "Rejected"}`);
        setShowActionMenu(false);
        setSelectedId("");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };
  console.log({ selectedId });
  return (
    <div className="w-8/12 bg-white relative">
      {/* className={`${
          isModalOpen ? "opacity-50 pointer-events-none" : ""
        } transition-all duration-300`} */}
      {/* Header */}
      <header className="bg-[#4E53B1]  text-white p-4 rounded-t-lg shadow-md mb-6">
        <h1 className="text-xl font-semibold text-center">Requests</h1>
        <button
          onClick={onClose}
          className="absolute cursor-pointer right-4 top-4 text-white text-2xl font-bold hover:text-gray-200 focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>
      </header>

      {/* Filter and Search Section */}
      <div className=" p-4 mb-6 flex flex-wrap items-center gap-4">
        {/* Pending Dropdown */}
        <div className="relative">
          <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-full leading-tight focus:outline-none focus:bg-white focus:border-indigo-500">
            <option>Pending ({activityData?.length})</option>
            {/* Add more options if needed */}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        {/* From Date Dropdown */}
        <div className="relative">
          <span className="text-gray-700 mr-2">From:</span>
          <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-full leading-tight focus:outline-none focus:bg-white focus:border-indigo-500">
            <option>01/06/2025</option>
            {/* Add more options if needed */}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        {/* To Date Dropdown */}
        <div className="relative">
          <span className="text-gray-700 mr-2">To:</span>
          <select className="appearance-none bg-white  border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-full leading-tight focus:outline-none focus:bg-white focus:border-indigo-500">
            <option>01/07/2025</option>
            <option>01/07/2025</option>
            <option>01/07/2025</option>
            {/* Add more options if needed */}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex-grow flex justify-end">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder=""
              className="w-full bg-gray-100  border-gray-300 rounded-full py-2 pl-10 pr-4 text-gray-700 focus:outline-none  focus:border-indigo-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <button className="absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center text-[#797F8F] font-medium">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        {/* Request Card */}
        {activityData?.map((el: any) => (
          <div className="bg-white p-6 rounded-lg shadow-md flex items-start gap-6 pb-14">
            {/* User Info */}
            <div className="flex flex-col items-center gap-2 w-32">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {
                    ((el?.users[0]?.profile?.firstName[0] as string) +
                      el?.users[0]?.profile?.lastName[0]) as string
                  }
                </span>
              </div>
              <span className="font-semibold text-lg text-[#484848]">
                {el?.users[0]?.profile?.firstName &&
                el?.users[0]?.profile?.lastName
                  ? el?.users[0]?.profile?.firstName +
                    " " +
                    el?.users[0]?.profile?.lastName
                  : "John Doe"}
              </span>
              <span className="text-sm text-[#484848]">Add Shift</span>
              {/* Add onClick handler here */}
              {/* <button
                onClick={() => setShowChatConversationModal(true)}
                className="flex items-center text-[#4E53B1] cursor-pointer text-sm hover:underline"
              >
                <UserIcon />
                Chat with user
              </button> */}
            </div>

            {/* Shift Details */}
            <div className="flex-1 grid grid-cols-3 gap-y-4">
              <div>
                <p className="text-[#484848] text-sm">Shift added:</p>
                <div className="flex items-center justify-between gap-6">
                  <div className="flex flex-col gap-1">
                    <FormatShift start={el?.startTime} end={el?.endTime} />
                    {/* {formatShift(el?.startTime, el?.endTime)} */}
                  </div>
                </div>
              </div>
              <div className="col-span-1">
                <p className="text-[#484848] text-sm">Shift Note:</p>
                <p className="text-gray-700">----------</p>{" "}
                {/* Placeholder for note */}
              </div>
              <div className="col-span-1">
                <p className="text-[#484848] text-sm">Request Note:</p>
                <p className="text-gray-700">----------</p>{" "}
                {/* Placeholder for note */}
              </div>
              <div className="col-start-1 col-span-3">
                <span className="text-[#4E53B1] text-sm cursor-pointer hover:underline">
                  Shift Manager
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="self-center relative">
              <button
                ref={actionBtnRef}
                onClick={() => {
                  setSelectedId(el?.id);
                  setShowActionMenu((prev) => !prev);
                }}
                className="border border-[#4E53B1] text-[#4E53B1] cursor-pointer hover:bg-[#4E53B1] hover:text-white font-semibold py-2 px-4 rounded-full shadow-md flex items-center gap-2 transition-colors duration-200"
              >
                <ActionIcon />
                Action
              </button>
              {/* Mini Modal */}
              {selectedId === el?.id && showActionMenu && (
                <div className="absolute top-full mt-2 right-0 bg-white border border-gray-300 shadow-lg rounded-md p-4 w-64 z-10">
                  <p className="text-sm text-gray-700 mb-2">
                    Attach a comment to user (optional)
                  </p>
                  <textarea
                    rows={3}
                    placeholder="Write a comment..."
                    className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-700 mb-4 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      ref={actionBtnRef}
                      onClick={() => handleUpdate(false)}
                      className="bg-red-500 cursor-pointer text-white px-4 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Decline
                    </button>
                    <button
                      ref={actionBtnRef}
                      onClick={() => handleUpdate(false)}
                      className="bg-green-500 cursor-pointer text-white px-4 py-1 rounded hover:bg-green-600 text-sm"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              )}
              {/* Chat Conversation Modal */}
              <ChatConversationModal
                isOpen={showChatConversationModal}
                onClose={() => setShowChatConversationModal(false)}
                selectedChat={dummySelectedChat}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingRequestModal;
