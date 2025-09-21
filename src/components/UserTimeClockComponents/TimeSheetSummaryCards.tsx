import React from "react";
import { Send, File } from "lucide-react";

interface TimeSheetSummaryCardsProps {
  paymentData: any;
  handleSubmit: () => void;
  exportToPDF: () => void;
}

const TimeSheetSummaryCards: React.FC<TimeSheetSummaryCardsProps> = ({
  paymentData,
  handleSubmit,
  exportToPDF,
}) => (
  <div className="flex justify-between items-center gap-5">
    <div className="flex flex-wrap gap-4 lg:gap-6 mb-8 items-center">
      <div className="text-center">
        <div className="text-xl lg:text-2xl font-bold text-gray-900">
          {Number(paymentData?.payPerHour?.regularPayRate ?? 0).toFixed(2)} $
        </div>
        <div className="text-xs lg:text-sm text-gray-600">
          Regular Pay per Hour
        </div>
      </div>
      <div className="text-base lg:text-lg font-medium text-gray-900">|</div>
      <div className="text-center">
        <div className="text-xl lg:text-2xl font-bold text-gray-900">
          {Number(paymentData?.payPerHour?.overTimePayRate ?? 0).toFixed(2)} $
        </div>
        <div className="text-xs lg:text-sm text-gray-600">
          Overtime Pay per Hour
        </div>
      </div>
      <div className="text-base lg:text-lg font-medium text-gray-900">|</div>
      <div className="text-center">
        <div className="text-xl lg:text-2xl font-bold text-gray-900">
          {Number(paymentData?.payPerDay?.regularPayRate ?? 0).toFixed(2)} $
        </div>
        <div className="text-xs lg:text-sm text-gray-600">
          Regular Pay per day
        </div>
      </div>
      <div className="text-base lg:text-lg font-medium text-gray-900">|</div>
      <div className="text-center">
        <div className="text-xl lg:text-2xl font-bold text-gray-900">
          {Number(paymentData?.payPerDay?.overTimePayRate ?? 0).toFixed(2)} $
        </div>
        <div className="text-xs lg:text-sm text-gray-600">
          Overtime Pay per day
        </div>
      </div>
      <div className="text-base lg:text-lg font-medium text-gray-900">|</div>
      <div className="text-center">
        <div className="text-xl lg:text-2xl font-bold text-gray-900">
          {Number(paymentData?.totalRegularHour ?? 0).toFixed(2)}
        </div>
        <div className="text-xs lg:text-sm text-gray-600">
          Regular Total Hours
        </div>
      </div>
      <div className="text-base lg:text-lg font-medium text-gray-900">+</div>
      <div className="text-center">
        <div className="text-xl lg:text-2xl font-bold text-gray-900">
          {Number(paymentData?.totalOvertimeHour ?? 0).toFixed(2)}
        </div>
        <div className="text-xs lg:text-sm text-gray-600">
          Overtime Total Hours
        </div>
      </div>
      <div className="text-base lg:text-lg font-medium text-gray-900">=</div>
      <div className="text-center">
        <div className="text-xl lg:text-2xl font-bold text-gray-900">
          {(
            Number(paymentData?.totalRegularHour ?? 0) +
            Number(paymentData?.totalOvertimeHour ?? 0)
          ).toFixed(2)}
        </div>
        <div className="text-xs lg:text-sm text-gray-600">
          Total Paid Hours
        </div>
      </div>
    </div>
    <div className="flex items-center gap-3 ">
      <button
        onClick={handleSubmit}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
      >
        <Send className="w-4 h-4" />
        <span>Submit</span>
      </button>
      <button
        onClick={exportToPDF}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
      >
        <File className="w-4 h-4" />
        <span>Export</span>
      </button>
    </div>
  </div>
);

export default TimeSheetSummaryCards;