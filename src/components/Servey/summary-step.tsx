"use client"

import type React from "react"
import { SurveySettings } from "./types/survey"


interface SummaryStepProps {
  settings: SurveySettings
  onConfirm: () => void
}

export const SummaryStep: React.FC<SummaryStepProps> = ({ settings, onConfirm }) => {
  const formatDateTime = (date: string, time: string) => {
    if (!date || !time) return ""
    const dateObj = new Date(`${date}T${time}`)
    return dateObj.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-0">
      <div className="bg-gray-100 rounded-lg p-6 sm:p-12 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Survey is Live!</h2>

        <p className="text-gray-600 mb-6">"Your survey is live and ready for participation!"</p>

        <div className="space-y-3 text-sm text-gray-600">
          <p>
            Asset will be published on{" "}
            <span className="font-medium">
              {settings.publishNow
                ? "now"
                : formatDateTime(settings.publishDate, settings.publishTime) || "21/06/2025 at 16:40"}
            </span>
          </p>

          {settings.notifyPushUp && (
            <div>
              <p className="font-medium mb-2">User will be notified :</p>
              <div className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 max-w-md mx-auto">
                {settings.notificationText || "A new update is waiting for you in the XYZ company app"}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
        <button
          onClick={onConfirm}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors order-1 sm:order-2"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="bg-[#4E53B1] text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors mb-4 sm:mb-0 order-2 sm:order-1"
        >
          Confirm survey
        </button>
      </div>
    </div>
  )
}
