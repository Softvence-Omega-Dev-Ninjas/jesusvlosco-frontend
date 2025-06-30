import { Award, Lightbulb, MessageCircle, ThumbsUp } from "lucide-react";
import React, { useState } from "react";
import CommentModal from "./CommentModal";
import { Recognition } from "./dashboard";
import { CommentIcon, LikeIcon, TeamplayerIcon } from "./icons";

export const RecognitionTable: React.FC<{ recognitions: Recognition[] }> = ({
  recognitions,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "team player":
        return <TeamplayerIcon />;
      case "creative":
        return <Lightbulb className="w-6 h-6 text-yellow-500" />;
      default:
        return <Award className="w-6 h-6 text-orange-500" />;
    }
  };

  const getAvatarGroup = (recognition: Recognition) => {
    const teamAvatars = [
      "https://randomuser.me/api/portraits/women/1.jpg",
      "https://randomuser.me/api/portraits/men/2.jpg",
      "https://randomuser.me/api/portraits/women/3.jpg",
      "https://randomuser.me/api/portraits/men/4.jpg",
    ];

    if (
      recognition.from === "Team player" ||
      recognition.type === "Team player"
    ) {
      return (
        <div className="flex items-center -space-x-2">
          {teamAvatars.map((avatar, index) => (
            <div key={index} className="relative">
              <img
                src={avatar}
                alt={`Team member ${index + 1}`}
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
              />
            </div>
          ))}
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white">
            <span className="text-xs font-semibold text-gray-700">+</span>
          </div>
        </div>
      );
    }

    const individualAvatars = [
      "https://randomuser.me/api/portraits/women/5.jpg",
      "https://randomuser.me/api/portraits/men/6.jpg",
      "https://randomuser.me/api/portraits/women/7.jpg",
      "https://randomuser.me/api/portraits/men/8.jpg",
      "https://randomuser.me/api/portraits/women/9.jpg",
    ];

    const randomAvatar =
      individualAvatars[Math.floor(Math.random() * individualAvatars.length)];

    return (
      <div className="flex items-center gap-3">
        <img
          src={randomAvatar}
          alt={recognition.from}
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="text-base font-normal text-[#4E53B1]">
          {recognition.from}
        </span>
      </div>
    );
  };

  const shouldScroll = recognitions.length > 5;

  return (
    <div className="relative rounded-2xl overflow-hidden w-full">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4">
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
          {recognitions.map((recognition) => (
            <div
              key={recognition.id}
              className="px-6 py-4 grid grid-cols-5 gap-4 items-center hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                {getAvatarGroup(recognition)}
              </div>

              <div className="flex items-center gap-4">
                {getTypeIcon(recognition.type)}
                <span className="text-base font-normal text-[#484848]">
                  {recognition.type}
                </span>
              </div>

              <div className="flex items-center">
                <span className="text-base font-normal text-[#484848]">
                  {recognition.message || "-----"}
                </span>
              </div>

              <div className="flex items-center">
                <span className="text-base font-normal text-[#484848]">
                  {recognition.viewer}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex items-center cursor-pointer gap-1 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors">
                  <LikeIcon />
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex relative items-center cursor-pointer gap-1 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <CommentIcon />
                  <span className="text-xs absolute top-0 right-0 text-[#1EBD66] bg-[#D9F0E4] px-1.5 py-0.5 rounded-full">
                    1
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-gray-200">
        {recognitions.map((recognition) => (
          <div
            key={recognition.id}
            className="px-4 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              {getAvatarGroup(recognition)}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {getTypeIcon(recognition.type)}
                  <span className="text-base font-normal text-[#484848]">
                    {recognition.type}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 ml-13">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Message:</span>
                <span className="text-base text-[#484848] font-medium">
                  {recognition.message || "-----"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Viewer:</span>
                <span className="text-base text-[#484848]">
                  {recognition.viewer}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Reactions:</span>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors">
                    <ThumbsUp className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-green-600">1</span>
                  </button>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Slide Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative w-full max-w-xl h-full bg-white shadow-xl overflow-y-auto">
            <button
              className="absolute cursor-pointer top-4 right-4 z-10 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <div className="p-6">
              <CommentModal />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
