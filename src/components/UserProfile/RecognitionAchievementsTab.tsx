// src/components/UserProfile/RecognitionAchievementsTab.tsx
import React from "react";
import {
  RecognitionItem,
  dummyRecognitionAchievements,
} from "./recognitionAchievementsData"; // Adjust path if necessary

interface RecognitionAchievementsTabProps {
  // You might pass 'user' data here if recognitions were part of the user object,
  // but for now, we'll use dummy data directly.
}

const RecognitionAchievementsTab: React.FC<
  RecognitionAchievementsTabProps
> = () => {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {dummyRecognitionAchievements.map((item: RecognitionItem) => (
        <div
          key={item.id}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {item.title}
          </h3>
          <p className="text-sm text-[#4E53B1] mb-2">
            {item.date} <span className="mx-1">•</span> {item.category}
          </p>
          <p className="text-gray-600 text-sm">{item.description}</p>
        </div>
      ))}
    </div>
  );
};

export default RecognitionAchievementsTab;
