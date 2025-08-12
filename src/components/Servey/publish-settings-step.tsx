"use client"

import React from "react"
import { SurveySettings } from "./types/survey"

interface PublishSettingsStepProps {
  settings: SurveySettings
  onSettingsChange: (settings: Partial<SurveySettings>) => void
}

export const PublishSettingsStep: React.FC<PublishSettingsStepProps> = ({ settings, onSettingsChange }) => {
  // Helper: combine date and time to ISO string (UTC)
  const combineDateAndTimeToISO = (dateStr: string, timeStr: string) => {
    if (!dateStr) return "";
    const time = timeStr || "00:00";
    const combined = new Date(`${dateStr}T${time}:00`);
      console.log('combineDateAndTimeToISO')
      console.log(combined.toISOString())
    return combined.toISOString();
  }


  // Extract date (YYYY-MM-DD) and time (HH:mm) from settings.publishTime (ISO string)
  // Fallback to empty string if missing
  const dateValue = settings.publishTime ? settings.publishTime.substring(0, 10) : "";
  const timeValue = settings.publishTime ? settings.publishTime.substring(11, 16) : "";

  return (
    <div className="max-w-8xl mx-auto space-y-8 px-4 sm:px-0">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-20">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="publishOption"
                checked={settings.publishNow}
                onChange={() => onSettingsChange({ publishNow: true })}
                className="text-[#4E53B1] focus:ring-indigo-500"
              />
              <span className="text-gray-900">Publish now</span>
            </label>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="publishOption"
                checked={!settings.publishNow}
                onChange={() => onSettingsChange({ publishNow: false })}
                className="text-[#4E53B1] focus:ring-indigo-500"
              />
              <span className="text-gray-900">Select date & time</span>
            </label>
          </div>
        </div>

        {!settings.publishNow && (
          <div className="ml-0 sm:ml-8 lg:ml-50 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <input
              type="date"
              value={dateValue}
              onChange={(e) => {
                const newDate = e.target.value;
                // Combine new date with current time value
                const isoDateTime = combineDateAndTimeToISO(newDate, timeValue);
                 console.log(isoDateTime)
                onSettingsChange({ publishTime: isoDateTime, publishDate: newDate });
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <span className="text-gray-500 hidden sm:inline">At</span>
            <input
              type="time"
              value={timeValue}
              onChange={(e) => {
                const newTime = e.target.value;
                // Combine current date value with new time
                const isoDateTime = combineDateAndTimeToISO(dateValue, newTime);
                console.log(isoDateTime)
                onSettingsChange({ publishTime: isoDateTime });
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={settings.notifyPushUp}
            onChange={(e) => onSettingsChange({ notifyPushUp: e.target.checked })}
            className="mt-1 rounded border-gray-300 text-[#4E53B1] focus:ring-indigo-500"
          />
          <div className="flex-1">
            <span className="text-gray-900">Notify employees via push up notification</span>
            <div className="mt-2">
              <input
                value={settings.notificationText}
                onChange={(e) => onSettingsChange({ notificationText: e.target.value })}
                placeholder="A new update is waiting for you in the XYZ company app"
                className="w-full px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
          </div>
        </label>
      </div>

      <div className="space-y-4">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.showOnFeed}
            onChange={(e) => onSettingsChange({ showOnFeed: e.target.checked })}
            className="rounded border-gray-300 text-[#4E53B1] focus:ring-indigo-500"
          />
          <span className="text-gray-900">Show on feed by XYZ agency</span>
        </label>
      </div>

      <div className="space-y-4">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.sendReminder}
            onChange={(e) => onSettingsChange({ sendReminder: e.target.checked })}
            className="rounded border-gray-300 text-[#4E53B1] focus:ring-indigo-500"
          />
          <span className="text-gray-900">Send on reminder if user didn't view by</span>
        </label>

        {settings.sendReminder && (
          <div className="ml-0 sm:ml-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <input
              type="date"
              value={settings.reminderDate}
              onChange={(e) => onSettingsChange({ reminderDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="time"
              value={settings.reminderTime}
              onChange={(e) => onSettingsChange({ reminderTime: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.showOnFeedAgency}
            onChange={(e) => onSettingsChange({ showOnFeedAgency: e.target.checked })}
            className="rounded border-gray-300 text-[#4E53B1] focus:ring-indigo-500"
          />
          <span className="text-gray-900">Show on feed by XYZ agency</span>
        </label>
      </div>
    </div>
  )
}
