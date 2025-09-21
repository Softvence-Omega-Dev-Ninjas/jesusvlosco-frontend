import React from "react";
import { Send, File } from "lucide-react";

interface TimeSheetSummaryCardsProps {
  paymentData: any;
  handleSubmit: () => void;
  exportToPDF: () => void;
}

const StatBlock = ({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) => (
  <div className="flex flex-col items-center px-4 py-2 bg-white rounded-md shadow-sm border border-gray-200">
    <div className="text-lg lg:text-xl font-semibold text-gray-900">
      {value}
    </div>
    <div className="text-xs lg:text-sm text-gray-500">{label}</div>
  </div>
);

const TimeSheetSummaryCards: React.FC<TimeSheetSummaryCardsProps> = ({
  paymentData,
  handleSubmit,
  exportToPDF,
}) => {
  const totalHours =
    Number(paymentData?.totalRegularHour ?? 0) +
    Number(paymentData?.totalOvertimeHour ?? 0);

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
      {/* Stats Row */}
      <div className="flex flex-wrap items-center gap-4">
        <StatBlock
          value={`${Number(
            paymentData?.payPerHour?.regularPayRate ?? 0
          ).toFixed(2)} $`}
          label="Regular / Hour"
        />
        <StatBlock
          value={`${Number(
            paymentData?.payPerHour?.overTimePayRate ?? 0
          ).toFixed(2)} $`}
          label="Overtime / Hour"
        />
        <StatBlock
          value={`${Number(
            paymentData?.payPerDay?.regularPayRate ?? 0
          ).toFixed(2)} $`}
          label="Regular / Day"
        />
        <StatBlock
          value={`${Number(
            paymentData?.payPerDay?.overTimePayRate ?? 0
          ).toFixed(2)} $`}
          label="Overtime / Day"
        />
        <StatBlock
          value={Number(paymentData?.totalRegularHour ?? 0).toFixed(2)}
          label="Regular Hours"
        />
        <StatBlock
          value={Number(paymentData?.totalOvertimeHour ?? 0).toFixed(2)}
          label="Overtime Hours"
        />
        <StatBlock value={totalHours.toFixed(2)} label="Total Paid Hours" />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Send className="w-4 h-4" />
          <span>Submit</span>
        </button>
        <button
          onClick={exportToPDF}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm"
        >
          <File className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};

export default TimeSheetSummaryCards;
