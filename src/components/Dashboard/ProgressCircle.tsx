import React from "react";

export const ProgressCircle: React.FC<{
  percentage: number;
  color: string;
  label: string;
}> = ({ percentage, color, label }) => {
  const circumference = 2 * Math.PI * 14;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Split the label: e.g. "20/40 user Complete"
  const match = label.match(/^(\d+)(.*)$/);
  const valuePart = match ? match[1] : label;
  const restPart = match ? match[2] : "";

  return (
    <div className="text-center">
      <div className="relative w-[120px] h-[120px] mx-auto mb-2">
        <svg
          className="w-[120px] h-[120px] transform -rotate-90"
          viewBox="0 0 32 32"
        >
          <circle
            cx="16"
            cy="16"
            r="14"
            stroke="#e5e7eb"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <circle
            cx="16"
            cy="16"
            r="14"
            stroke={color}
            strokeWidth="3"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
          <div style={{ color }}>
            {valuePart} <span className="text-[#484848]">{restPart}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
