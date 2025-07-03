
import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface PopupModalProps {
      isOpen: boolean;
      onClose: () => void;
      title: string;
      onSubmit: (e: React.FormEvent) => void;
      children: React.ReactNode;
}

const PopupModal: React.FC<PopupModalProps> = ({
      isOpen,
      onClose,
      title,
      onSubmit,
      children
}) => {
      if (!isOpen) return null;

      return (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                              <h3 className="text-lg font-semibold text-gray-900">
                                    {title}
                              </h3>
                              <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 text-xl font-bold w-6 h-6 flex items-center justify-center cursor-pointer"
                              >
                                    ×
                              </button>
                        </div>

                        {/* Modal Content */}
                        <form onSubmit={onSubmit} className="p-6 space-y-4">
                              {children}
                        </form>
                  </div>
            </div>
      );
};

interface TimeOffRequestModalProps {
      isOpen: boolean;
      onClose: () => void; }

export const TimeOffRequestModal: React.FC<TimeOffRequestModalProps> = ({ isOpen, onClose }) => {
      const [timeOffType, setTimeOffType] = React.useState('sick-leave');
      const [allDayOff, setAllDayOff] = React.useState(true);
      const [note, setNote] = React.useState('');
      const [showDatePicker, setShowDatePicker] = React.useState(false);
      const [startDate, setStartDate] = React.useState<Date | null>(new Date());
      const [endDate, setEndDate] = React.useState<Date | null>(new Date());
      const [startTime, setStartTime] = React.useState('09:00');
      const [endTime, setEndTime] = React.useState('17:00');
      const [showCalendar, setShowCalendar] = React.useState(false);

      const formatDate = (date: Date | null) => {
            if (!date) return '';
            return new Intl.DateTimeFormat('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
            }).format(date);
      };

      const calculateDays = () => {
            if (!startDate || !endDate) return 0;
            const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            return diffDays;
      };

      const handleDateChange = (dates: [Date | null, Date | null]) => {
            const [start, end] = dates;
            setStartDate(start);
            setEndDate(end || start);
      };

      const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            const timeOffData = {
                  timeOffType,
                  allDayOff,
                  startDate: startDate?.toISOString(),
                  endDate: endDate?.toISOString(),
                  startTime: allDayOff ? null : startTime,
                  endTime: allDayOff ? null : endTime,
                  note,
                  totalDays: calculateDays()
            };
            console.log(timeOffData);
            onClose();
      };

      return (
            <PopupModal
                  isOpen={isOpen}
                  onClose={onClose}
                  title="Add time off"
                  onSubmit={handleSubmit}
            >
                  {/* Time off type */}
                  <div>
                        <label
                              htmlFor="time-off-type"
                              className="block text-sm font-medium text-gray-700 mb-2"
                        >
                              Time off type
                        </label>
                        <select
                              id="time-off-type"
                              value={timeOffType}
                              onChange={(e) => setTimeOffType(e.target.value)}
                              className="w-full px-3 py-2 border text-[#4E53B1] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                              <option value="sick-leave">Sick leave</option>
                              <option value="time-off">Time off</option>
                              <option value="casual-leave">Casual leave</option>
                              <option value="unpaid-leave">Unpaid leave</option>
                        </select>
                  </div>

                  {/* All day toggle */}
                  <div className="flex items-center justify-between">
                        <label
                              htmlFor="all-day"
                              className="text-sm font-medium text-gray-700"
                        >
                              All day time off
                        </label>
                        <button
                              type="button"
                              onClick={() => setAllDayOff(!allDayOff)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${allDayOff ? "bg-primary" : "bg-gray-200"
                                    }`}
                        >
                              <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${allDayOff ? "translate-x-6" : "translate-x-1"
                                          }`}
                              />
                        </button>
                  </div>

                  {/* Date picker */}
                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                              Date and time of time off
                        </label>

                        {/* Date range display */}
                        <div className="relative">
                              <div
                                    onClick={() => setShowCalendar(!showCalendar)}
                                    className="cursor-pointer p-2 flex items-center border border-gray-300 rounded-lg justify-between w-full"
                              >
                                    <span className="text-sm text-gray-600">
                                          {startDate && endDate && startDate.getTime() === endDate.getTime()
                                                ? formatDate(startDate)
                                                : `${formatDate(startDate)} - ${formatDate(endDate)}`}
                                    </span>
                                    <div className="flex items-center">
                                          <Calendar className="w-4 h-4 text-gray-500 mr-1" />
                                          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showCalendar ? 'rotate-180' : ''}`} />
                                    </div>
                              </div>

                              {/* Calendar popup */}
                              {showCalendar && (
                                    <div className="absolute z-10 mt-2 bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-full">
                                          <input
                                                type="date"
                                                value={startDate?.toISOString().split('T')[0] || ''}
                                                onChange={(e) => {
                                                      const date = e.target.value ? new Date(e.target.value) : null;
                                                      setStartDate(date);
                                                      if (!endDate || (date && date > endDate)) {
                                                            setEndDate(date);
                                                      }
                                                }}
                                                className="w-full p-2 border border-gray-300 rounded mb-2"
                                          />
                                          <input
                                                type="date"
                                                value={endDate?.toISOString().split('T')[0] || ''}
                                                min={startDate?.toISOString().split('T')[0]}
                                                onChange={(e) => {
                                                      const date = e.target.value ? new Date(e.target.value) : null;
                                                      setEndDate(date);
                                                }}
                                                className="w-full p-2 border border-gray-300 rounded"
                                          />
                                          <div className="flex justify-end mt-2">
                                                <button
                                                      type="button"
                                                      onClick={() => setShowCalendar(false)}
                                                      className="px-3 py-1 bg-primary text-white rounded text-sm"
                                                >
                                                      Apply
                                                </button>
                                          </div>
                                    </div>
                              )}
                        </div>

                        {/* Time range input when not all day */}
                        {!allDayOff && (
                              <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
                                    <div className="w-full">
                                          <label className="block text-xs text-gray-500 mb-1">Start time</label>
                                          <input
                                                type="time"
                                                value={startTime}
                                                onChange={(e) => setStartTime(e.target.value)}
                                                className="border border-gray-300 text-gray-600 rounded-md px-4 py-2 w-full text-center"
                                          />
                                    </div>
                                    <span className="text-sm text-gray-500 mt-5">to</span>
                                    <div className="w-full">
                                          <label className="block text-xs text-gray-500 mb-1">End time</label>
                                          <input
                                                type="time"
                                                value={endTime}
                                                onChange={(e) => setEndTime(e.target.value)}
                                                className="border border-gray-300 text-gray-600 rounded-md px-4 py-2 w-full text-center"
                                          />
                                    </div>
                              </div>
                        )}
                  </div>

                  {/* Total days */}
                  <div className="flex justify-between bg-gray-100 p-2 py-4 rounded-lg items-center">
                        <label className="block text-sm font-medium text-gray-700">
                              Total time off days
                        </label>
                        <div className="text-sm text-gray-600">
                              {calculateDays().toFixed(2)} work days
                        </div>
                  </div>

                  {/* Note */}
                  <div>
                        <label
                              htmlFor="note"
                              className="block text-sm font-medium text-gray-700 mb-2"
                        >
                              Attach a note to your request
                        </label>
                        <textarea
                              id="note"
                              value={note}
                              onChange={(e) => setNote(e.target.value)}
                              placeholder="Add a note..."
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        />
                  </div>

                  {/* Submit button */}
                  <button
                        type="submit"
                        className="bg-green-100 hover:bg-[#1EBD66] text-green-600 hover:text-white py-2 px-8 rounded-full text-sm transition-colors mt-4 cursor-pointer"
                  >
                        Send for approval
                  </button>
            </PopupModal>
      );
};

export default PopupModal;