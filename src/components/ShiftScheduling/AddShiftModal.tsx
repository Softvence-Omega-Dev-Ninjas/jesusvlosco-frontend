import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Calendar as CalendarIcon } from 'lucide-react';



interface AddShiftModalProps {
      onClose: () => void;
}

const AddShiftModal: React.FC<AddShiftModalProps> = ({ onClose }) => {
      const [project, setProject] = useState('Metro Shopping Center');
      const [startDate, setStartDate] = useState<string>('19/06/2025');
      const [endDate, setEndDate] = useState<string>('21/06/2025');
      const [startTime, setStartTime] = useState('09:00');
      const [endTime, setEndTime] = useState('17:00');
      const [managerNote, setManagerNote] = useState('');
      const [showProjectDropdown, setShowProjectDropdown] = useState(false);
      const [showStartDatePicker, setShowStartDatePicker] = useState(false);
      const [showEndDatePicker, setShowEndDatePicker] = useState(false);
      const startDateRef = useRef<HTMLDivElement>(null);
      const endDateRef = useRef<HTMLDivElement>(null);

      const projects = [
            'Metro Shopping Center',
            'Downtown Office Complex',
            'Riverside Mall',
            'Corporate Plaza',
            'Tech Hub Center'
      ];

      // Handle clicks outside date pickers
      useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                  if (startDateRef.current && !startDateRef.current.contains(event.target as Node)) {
                        setShowStartDatePicker(false);
                  }
                  if (endDateRef.current && !endDateRef.current.contains(event.target as Node)) {
                        setShowEndDatePicker(false);
                  }
            };

            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                  document.removeEventListener('mousedown', handleClickOutside);
            };
      }, []);

      const formatDateForInput = (dateStr: string) => {
            const [day, month, year] = dateStr.split('/');
            return `${year}-${month}-${day}`;
      };

      const handleDateChange = (dateStr: string, isStartDate: boolean) => {
            const [year, month, day] = dateStr.split('-');
            const formattedDate = `${day}/${month}/${year}`;

            if (isStartDate) {
                  setStartDate(formattedDate);
                  setShowStartDatePicker(false);

                  // If end date is before new start date, update end date too
                  if (new Date(dateStr) > new Date(formatDateForInput(endDate))) {
                        setEndDate(formattedDate);
                  }
            } else {
                  setEndDate(formattedDate);
                  setShowEndDatePicker(false);
            }
      };

      const calculateHours = () => {
            const [startDay, startMonth, startYear] = startDate.split('/');
            const [endDay, endMonth, endYear] = endDate.split('/');

            const start = new Date(`${startYear}-${startMonth}-${startDay}T${startTime}:00`);
            let end = new Date(`${endYear}-${endMonth}-${endDay}T${endTime}:00`);

            // If end time is earlier than start time, assume it's the next day
            if (end < start) {
                  end = new Date(end.getTime() + 24 * 60 * 60 * 1000);
            }

            const diffMs = end.getTime() - start.getTime();
            const diffHours = diffMs / (1000 * 60 * 60);

            const hours = Math.floor(diffHours);
            const minutes = Math.round((diffHours - hours) * 60);

            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      };

      const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) {
                  onClose();
            }
      };

      return (
            <div
                  className="fixed bg-black/30 inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
                  onClick={handleOutsideClick}
            >
                  <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 border-b-2 border-gray-300 bg-white p-6 pb-0 flex items-center justify-between">
                              <h1 className="text-lg font-medium text-gray-900 mt-2">Add Shift</h1>
                              <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                    <X size={20} />
                              </button>
                        </div>

                        <div className="p-6">
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Left Column - Form */}
                                    <div className="lg:col-span-2 space-y-6">
                                          {/* Project Selection */}
                                          <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                      Project
                                                </label>
                                                <div className="relative">
                                                      <button
                                                            onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                                                            className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                      >
                                                            <span className="text-blue-600">{project}</span>
                                                            <ChevronDown size={16} className="text-gray-400" />
                                                      </button>

                                                      {showProjectDropdown && (
                                                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                                                  {projects.map((proj) => (
                                                                        <button
                                                                              key={proj}
                                                                              onClick={() => {
                                                                                    setProject(proj);
                                                                                    setShowProjectDropdown(false);
                                                                              }}
                                                                              className={`w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none ${proj === project ? 'bg-blue-50 text-blue-600' : ''
                                                                                    }`}
                                                                        >
                                                                              {proj}
                                                                        </button>
                                                                  ))}
                                                            </div>
                                                      )}
                                                </div>
                                          </div>

                                          {/* Date and Time Selection */}
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                                                {/* Start Date/Time */}
                                                <div>
                                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Starts
                                                      </label>
                                                      <div className="flex items-center gap-2">
                                                            <div className="relative flex-1" ref={startDateRef}>
                                                                  <button
                                                                        onClick={() => setShowStartDatePicker(!showStartDatePicker)}
                                                                        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-full bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                  >
                                                                        <span>{startDate}</span>
                                                                        <CalendarIcon size={16} className="text-gray-400" />
                                                                  </button>
                                                                  {showStartDatePicker && (
                                                                        <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2">
                                                                              <input
                                                                                    type="date"
                                                                                    value={formatDateForInput(startDate)}
                                                                                    onChange={(e) => handleDateChange(e.target.value, true)}
                                                                                    className="w-full px-2 py-1 border rounded"
                                                                                    min={formatDateForInput(new Date().toLocaleDateString('en-GB').replace(/\//g, '/'))}
                                                                              />
                                                                        </div>
                                                                  )}
                                                            </div>
                                                            <span className="text-sm text-gray-500 whitespace-nowrap">At:</span>
                                                            <input
                                                                  type="time"
                                                                  value={startTime}
                                                                  onChange={(e) => setStartTime(e.target.value)}
                                                                  className="px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            />
                                                      </div>
                                                </div>

                                                {/* End Date/Time */}
                                                <div>
                                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Ends
                                                      </label>
                                                      <div className="flex items-center gap-2">
                                                            <div className="relative flex-1" ref={endDateRef}>
                                                                  <button
                                                                        onClick={() => setShowEndDatePicker(!showEndDatePicker)}
                                                                        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-full bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                  >
                                                                        <span>{endDate}</span>
                                                                        <CalendarIcon size={16} className="text-gray-400" />
                                                                  </button>
                                                                  {showEndDatePicker && (
                                                                        <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2">
                                                                              <input
                                                                                    type="date"
                                                                                    value={formatDateForInput(endDate)}
                                                                                    onChange={(e) => handleDateChange(e.target.value, false)}
                                                                                    className="w-full px-2 py-1 border rounded"
                                                                                    min={formatDateForInput(startDate)}
                                                                              />
                                                                        </div>
                                                                  )}
                                                            </div>
                                                            <span className="text-sm text-gray-500 whitespace-nowrap">At:</span>
                                                            <input
                                                                  type="time"
                                                                  value={endTime}
                                                                  onChange={(e) => setEndTime(e.target.value)}
                                                                  className="px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            />
                                                      </div>
                                                </div>
                                          </div>

                                          {/* Shift Attachments */}
                                          <div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                                      Shift attachments
                                                </h3>
                                                <textarea
                                                      value={managerNote}
                                                      onChange={(e) => setManagerNote(e.target.value)}
                                                      placeholder="Add manager note"
                                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                                      rows={6}
                                                />
                                          </div>

                                          {/* Submit Button */}
                                          <button
                                                onClick={onClose}
                                                type="submit"
                                                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-medium transition-colors"
                                          >
                                                Send for approval
                                          </button>
                                    </div>

                                    {/* Right Column - Total Hours */}
                                    <div className="lg:col-span-1">
                                          <div className="bg-indigo-100 rounded-lg p-6 text-center h-full lg:h-60 mt-3 flex flex-col justify-center">
                                                <div className="text-sm text-indigo-600 mb-2">Total hours</div>
                                                <div className="text-3xl font-bold text-indigo-800">
                                                      {calculateHours()}
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
      );
}

export default AddShiftModal;