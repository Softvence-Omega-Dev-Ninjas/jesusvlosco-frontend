import React from "react";
import { BadgeIcon, Crown, Gem } from "./icons";
import { format } from "date-fns";
import { Award, User, Calendar } from "lucide-react";

interface RecognitionItem {
  id: string;
  type: string;
  title: string;
  message: string;
  meta: {
    createdAt: string;
    performedBy: string;
    recognitionId: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const RecognitionEngagement: React.FC<{
  achievements: RecognitionItem[];
}> = ({ achievements }) => {
  const getIcon = (index: number) => {
    const icons = [Crown, Gem, Gem]; // Crown for first, Gem for others
    const IconComponent = icons[index] || Gem;
    return <IconComponent />;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const shouldScroll = achievements?.length > 3;

  if (!achievements || achievements.length === 0) {
    return (
      <div className="rounded-2xl p-6 border border-gray-200">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <BadgeIcon />
          </div>
          <h3 className="font-semibold text-gray-800 text-lg">
            Recognition & Engagement
          </h3>
        </div>

        {/* Empty State */}
        <div className="text-center py-8">
          <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-sm">No recognitions yet</p>
          <p className="text-gray-400 text-xs mt-1">Achievements will appear here</p>
        </div>
      </div>
    );
  }

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
        <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {achievements.length}
        </span>
      </div>

      {/* Achievement List with conditional scroll */}
      <div className="space-y-4">
        {achievements.map((achievement, index) => (
          <div
            key={achievement.id}
            className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 transition-all duration-200 cursor-pointer border border-orange-100"
          >
            {/* Icon */}
            <div className="flex items-center justify-center flex-shrink-0">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                {getIcon(index)}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Title */}
              <div className="text-orange-800 font-semibold text-sm mb-2 leading-tight">
                {achievement.title}
              </div>

              {/* Message */}
              <div className="text-gray-700 text-xs leading-relaxed mb-3">
                {achievement.message || "Recognition received"}
              </div>

              {/* Meta Information */}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(achievement.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>Recognition #{achievement.meta.recognitionId.slice(-6)}</span>
                </div>
              </div>

              {/* Type Badge */}
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
                  {achievement.type}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {achievements.length > 3 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-center text-xs text-gray-500">
            Showing {achievements.length} recognition{achievements.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};
