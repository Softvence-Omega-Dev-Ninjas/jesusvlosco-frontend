"use client"

import type React from "react"

interface AssignByStepProps {
  assignBy: "all" | "select"
  onAssignByChange: (value: "all" | "select") => void
}

export const AssignByStep: React.FC<AssignByStepProps> = ({ assignBy, onAssignByChange }) => (
  <div className="max-w-md mx-auto">
    <div className="flex flex-col sm:flex-row gap-4 justify-center p-4 sm:p-20">
      <button
        onClick={() => onAssignByChange("all")}
        className={`px-8 sm:px-16 py-3 sm:py-6 rounded-lg text-sm sm:text-base transition-colors ${
          assignBy === "all"
            ? "bg-[#4E53B1] text-white"
            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
      >
        All
      </button>
      <button
        onClick={() => onAssignByChange("select")}
        className={`px-8 py-3 rounded-lg text-sm sm:text-base transition-colors ${
          assignBy === "select"
            ? "bg-[#4E53B1] text-white min-w-max"
            : "bg-white border border-[#4E53B1] text-[#4E53B1] hover:bg-gray-50 min-w-max"
        }`}
      >
        Select user
      </button>
    </div>
  </div>
)
