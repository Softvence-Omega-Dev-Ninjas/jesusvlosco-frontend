import React from "react";
import { BadgeIcon, Crown, Gem } from "./icons";

interface Achievement {
  id: string;
  title: string;
  date: string;
  recipient: string;
}

export const RecognitionEngagement: React.FC<{
  achievements: Achievement[];
}> = ({ achievements }) => {
  const getIcon = (index: number) => {
    const icons = [Crown, Gem, Gem]; // Crown for first, Gem for others
    const IconComponent = icons[index] || Gem;
    return <IconComponent />;
  };

  const shouldScroll = achievements.length > 3;

  return (
    <div
      className={`rounded-2xl p-6 border border-gray-200 ${
        shouldScroll ? "max-h-[450px] overflow-y-auto" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <BadgeIcon />
        </div>
        <h3 className="font-semibold text-gray-800 text-lg">
          Recognition & Engagement
        </h3>
      </div>

      {/* Achievement List with conditional scroll */}
      <div className="space-y-4">
        {achievements.map((achievement, index) => (
          <div
            key={achievement.id}
            className="flex items-start gap-4 p-3 rounded-lg bg-[#FCF4EBA6] hover:bg-[#FCF4EBA6]/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-center ">
              {getIcon(index)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-orange-700 font-medium text-sm mb-1 leading-tight">
                {achievement.title}
              </div>
              <div className="text-gray-600 text-xs leading-relaxed">
                Badge received by {achievement.recipient} on {achievement.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
