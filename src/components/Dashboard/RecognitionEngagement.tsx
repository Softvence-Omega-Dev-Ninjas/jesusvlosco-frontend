import { Award } from "lucide-react";
import React from "react";
import { Achievement } from "./dashboard";

export const RecognitionEngagement: React.FC<{
  achievements: Achievement[];
}> = ({ achievements }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-indigo-600" />
        <h3 className="font-semibold">Recognition & Engagement</h3>
      </div>

      <div className="space-y-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded transition-colors"
          >
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <Award className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <div className="text-sm font-medium">{achievement.title}</div>
              <div className="text-xs text-gray-500">
                Badge received by {achievement.recipient} on {achievement.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
