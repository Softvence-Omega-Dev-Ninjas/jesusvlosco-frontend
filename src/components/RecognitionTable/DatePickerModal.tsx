
import { X } from "lucide-react"

interface DateRangePickerProps {
  isOpen: boolean
  onClose: () => void
  fromDate: { day: string; month: string; year: string }
  toDate: { day: string; month: string; year: string }
  onFromDateChange: (date: { day: string; month: string; year: string }) => void
  onToDateChange: (date: { day: string; month: string; year: string }) => void
  onDateClick: (day: number) => void
  isDateInRange: (day: number) => boolean
}

export default function DatePickerModal(
 {
  isOpen,
  onClose,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onDateClick,
  isDateInRange,
}: DateRangePickerProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
     <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-40" onClick={onClose} />

      {/* Slide-in Panel */}
      <div className="fixed right-0 top-0 h-full w-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Select Date Range</h2>
            <button className="p-1 hover:bg-gray-100 rounded transition-colors" onClick={onClose}>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Date Selectors */}
          <div className="space-y-6">
            {/* From Date */}
            <div>
              <label className="text-sm font-medium text-blue-600 mb-3 block">From</label>
              <div className="flex gap-2">
                <select
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm"
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
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={fromDate.month}
                  onChange={(e) => onFromDateChange({ ...fromDate, month: e.target.value })}
                >
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>

                <select
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={fromDate.year}
                  onChange={(e) => onFromDateChange({ ...fromDate, year: e.target.value })}
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={2020 + i} value={String(2020 + i)}>
                      {2020 + i}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* To Date */}
            <div>
              <label className="text-sm font-medium text-blue-600 mb-3 block">To</label>
              <div className="flex gap-2">
                <select
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={toDate.day}
                  onChange={(e) => onToDateChange({ ...toDate, day: e.target.value })}
                >
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                      {String(i + 1).padStart(2, "0")}
                    </option>
                  ))}
                </select>

                <select
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={toDate.month}
                  onChange={(e) => onToDateChange({ ...toDate, month: e.target.value })}
                >
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>

                <select
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={toDate.year}
                  onChange={(e) => onToDateChange({ ...toDate, year: e.target.value })}
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={2020 + i} value={String(2020 + i)}>
                      {2020 + i}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Calendar Grid - Interactive */}
          <div className="mt-8">
            <div className="grid grid-cols-7 gap-1 text-center">
              {/* Calendar Header */}
              {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                <div key={day} className="p-2 text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {/* Previous month days */}
              <div className="p-2 text-sm text-gray-400">28</div>
              <div className="p-2 text-sm text-gray-400">29</div>
              <div className="p-2 text-sm text-gray-400">30</div>
              <div className="p-2 text-sm text-gray-400">31</div>

              {/* Current month days - Interactive */}
              {Array.from({ length: 31 }, (_, i) => {
                const day = i + 1
                const isSelected = isDateInRange(day)
                return (
                  <div
                    key={day}
                    className={`p-2 text-sm cursor-pointer rounded transition-colors ${
                      isSelected ? "bg-orange-400 text-white font-medium" : "hover:bg-gray-100"
                    }`}
                    onClick={() => onDateClick(day)}
                  >
                    {String(day).padStart(2, "0")}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Apply Button */}
          <div className="mt-8">
            <button
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={onClose}
            >
              Apply Date Range
            </button>
          </div>
        </div>
      </div>
    </>
    </>
  )
}
