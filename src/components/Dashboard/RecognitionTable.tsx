/* eslint-disable @typescript-eslint/no-explicit-any */
import SendReactionModal from "@/components/RecognitionTable/SendReactionModal";
import { useGetAllRecognationQuery } from "@/store/api/admin/recognation/recognationApi";
import React, { useState } from "react";
import { PiUserCircleLight } from "react-icons/pi";
import { CommentIcon, LikeIcon } from "./icons";

export const RecognitionTable: React.FC = () => {
  const { data } = useGetAllRecognationQuery(null);
  const [isReactionModalOpen, setIsReactionModalOpen] = useState(false);

  const openReactionModal = () => setIsReactionModalOpen(true);
  const closeReactionModal = () => setIsReactionModalOpen(false);

  const getAvatarGroup = (recognitionUsers: any[]) => {
    if (recognitionUsers.length === 1) {
      const user = recognitionUsers[0]?.user?.profile;
      return (
        <div className="flex items-center gap-3">
          {user?.profileUrl ? (
            <img
              src={user.profileUrl}
              alt={user?.firstName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <PiUserCircleLight size={40} />
          )}
          <span className="text-base font-normal text-[#4E53B1]">
            {user?.firstName} {user?.lastName}
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center -space-x-2">
        {recognitionUsers.slice(0, 3).map((ru, i) => {
          const profile = ru?.user?.profile;
          return profile?.profileUrl ? (
            <img
              key={i}
              src={profile.profileUrl}
              alt={profile?.firstName}
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
            />
          ) : (
            <PiUserCircleLight key={i} size={40} />
          );
        })}
        {recognitionUsers.length > 3 && (
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white">
            <span className="text-xs font-semibold text-gray-700">
              +{recognitionUsers.length - 3}
            </span>
          </div>
        )}
      </div>
    );
  };

  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center p-10">
  //       <LoaderCircle size={40} className="animate-spin text-gray-500" />
  //     </div>
  //   );
  // }

  const recognitions = data?.data?.data || [];
  const shouldScroll = recognitions.length > 5;

  return (
    <div className="relative rounded-2xl overflow-hidden w-full">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#4E53B1]">Recognition</h2>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block border border-gray-200 p-5 rounded-2xl">
        <div
          className={`divide-y divide-gray-300 ${
            shouldScroll ? "max-h-[400px] overflow-y-auto" : ""
          }`}
        >
          <div className="px-5 py-4 grid grid-cols-5 gap-4 text-base font-bold text-[#484848]">
            <div>Sent to</div>
            <div>Type</div>
            <div>Message</div>
            <div>Viewer</div>
            <div>Reaction</div>
          </div>

          {recognitions.map((activity: any, idx: number) => (
            <div
              key={idx}
              className="px-6 py-4 grid grid-cols-5 gap-4 items-center hover:bg-gray-50 transition-colors"
            >
              {/* Sent to */}
              <div>{getAvatarGroup(activity?.recognitionUsers || [])}</div>

              {/* Badge Icon */}
              <div className="flex items-center gap-4">
                {activity?.badge?.iconImage ? (
                  <img
                    src={activity.badge.iconImage}
                    alt={activity?.badge?.category}
                    className="h-8 w-8 object-contain"
                  />
                ) : (
                  <span className="text-gray-500">—</span>
                )}
                <span className="text-base font-normal text-[#484848]">
                  {activity?.badge?.category}
                </span>
              </div>

              {/* Message */}
              <div className="text-base font-normal text-[#484848] break-words">
                {activity?.message || "-----"}
              </div>

              {/* Viewer */}
              <div className="text-base font-normal text-[#484848] break-words">
                {activity?.visibility}
              </div>

              {/* Reactions */}
              <div className="flex items-center gap-2">
                <button className="flex items-center cursor-pointer gap-1 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors">
                  <LikeIcon />
                </button>
                <button
                  onClick={openReactionModal}
                  className="flex relative items-center cursor-pointer gap-1 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <CommentIcon />
                  {activity?.messageCount > 0 && (
                    <span className="text-xs absolute top-0 right-0 text-[#1EBD66] bg-[#D9F0E4] px-1.5 py-0.5 rounded-full">
                      {activity?.messageCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-gray-200 max-h-[80vh] overflow-y-auto px-2">
        {recognitions.map((activity: any, idx: number) => (
          <div key={idx} className="py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              {getAvatarGroup(activity?.recognitionUsers || [])}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {activity?.badge?.iconImage && (
                    <img
                      src={activity.badge.iconImage}
                      alt={activity?.badge?.category}
                      className="h-8 w-8 object-contain"
                    />
                  )}
                  <span className="text-xs font-medium text-[#484848]">
                    {activity?.badge?.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pl-14 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Message:</span>
                <span>{activity?.message || "-----"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Viewer:</span>
                <span>{activity?.visibility}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Reactions:</span>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors">
                    <LikeIcon />
                  </button>
                  <button
                    onClick={openReactionModal}
                    className="relative flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <CommentIcon />
                    {activity?.messageCount > 0 && (
                      <span className="text-[10px] absolute top-0 right-0 text-[#1EBD66] bg-[#D9F0E4] px-1 py-0.5 rounded-full">
                        {activity?.messageCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reaction Modal */}
      {isReactionModalOpen && (
        <SendReactionModal recognation={recognitions[0]} onClose={closeReactionModal} />
      )}
    </div>
  );
};
