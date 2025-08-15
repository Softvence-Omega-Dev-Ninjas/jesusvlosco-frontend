import { useEffect } from "react";

interface DateRangePickerProps {
  isOpen: boolean;
  onClose: () => void;
  fromDate: { day: string; month: string; year: string };
  toDate: { day: string; month: string; year: string };
  onFromDateChange: (date: { day: string; month: string; year: string }) => void;
  onToDateChange: (date: { day: string; month: string; year: string }) => void;
  onDateClick: (day: number) => void;
  isDateInRange: (day: number) => boolean;
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function DatePickerModal({
  isOpen,
  onClose,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onDateClick,
  isDateInRange,
}: DateRangePickerProps) {
  if (!isOpen) return null;

  const today = new Date();
  const currentYear = today.getFullYear();

  // Update fromDate to May 1st if not already set
  useEffect(() => {
    if (!fromDate.day || !fromDate.month || !fromDate.year) {
      onFromDateChange({ day: "01", month: "May", year: String(currentYear) });
    }
    if (!toDate.day || !toDate.month || !toDate.year) {
      onToDateChange({
        day: String(today.getDate()).padStart(2, "0"),
        month: monthNames[today.getMonth()],
        year: String(currentYear),
      });
    }
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed rounded-2xl right-0 top-1/2 transform -translate-y-1/2 w-[750px] max-h-[90vh] bg-white shadow-xl z-50 overflow-hidden">
        <div className="p-4 m-4 mx-6 border border-[#C5C5C5] rounded-2xl">
          
          {/* Selectors */}
          <div className="flex flex-wrap justify-center items-end gap-3 border-b py-6 pb-4">
            {/* From */}
            <div className="text-xl font-medium text-[#4F46E5]">From</div>
            <select
              className="px-2 py-2 border rounded-md text-sm cursor-pointer"
              value={fromDate.day}
              onChange={(e) => onFromDateChange({ ...fromDate, day: e.target.value })}
            >
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                  {String(i + 1).padStart(2, "0")}
                </option>
              ))}
            </select>
            <select
              className="px-2 py-2 border rounded-md text-sm cursor-pointer"
              value={fromDate.month}
              onChange={(e) => onFromDateChange({ ...fromDate, month: e.target.value })}
            >
              {monthNames.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <select
              className="px-2 py-2 border rounded-md text-sm cursor-pointer"
              value={fromDate.year}
              onChange={(e) => onFromDateChange({ ...fromDate, year: e.target.value })}
            >
              {Array.from({ length: 10 }, (_, i) => (
                <option key={2020 + i} value={String(2020 + i)}>{2020 + i}</option>
              ))}
            </select>

            {/* To */}
            <div className="text-xl font-medium text-[#4F46E5]">To</div>
            <select
              className="px-2 py-2 border rounded-md text-sm cursor-pointer"
              value={toDate.day}
              onChange={(e) => onToDateChange({ ...toDate, day: e.target.value })}
            >
              {Array.from({ length: today.getDate() }, (_, i) => (
                <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                  {String(i + 1).padStart(2, "0")}
                </option>
              ))}
            </select>
            <select
              className="px-2 py-2 border rounded-md text-sm cursor-pointer"
              value={toDate.month}
              onChange={(e) => onToDateChange({ ...toDate, month: e.target.value })}
            >
              {monthNames.slice(4, today.getMonth() + 1).map((month) => ( // May → current month
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <select
              className="px-2 py-2 border rounded-md text-sm cursor-pointer"
              value={toDate.year}
              onChange={(e) => onToDateChange({ ...toDate, year: e.target.value })}
            >
              {Array.from({ length: 10 }, (_, i) => (
                <option key={2020 + i} value={String(2020 + i)}>{2020 + i}</option>
              ))}
            </select>
          </div>

          {/* Calendar */}
          <div className="mt-6 px-2">
            <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 font-medium mb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-2 text-center">
              {[28, 29, 30, 31].map((d) => (
                <div key={d} className="text-sm text-gray-400">{d}</div>
              ))}

              {Array.from({ length: 31 }, (_, i) => {
                const day = i + 1;
                const isSelected = isDateInRange(day);
                return (
                  <div
                    key={day}
                    onClick={() => onDateClick(day)}
                    className={`text-sm cursor-pointer rounded-md w-9 h-9 flex items-center justify-center ${
                      isSelected ? "bg-[#FFBA5C] text-black font-medium" : "hover:bg-gray-100"
                    }`}
                  >
                    {String(day).padStart(2, "0")}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
