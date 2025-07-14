import React, { useState } from 'react';
import { X, ChevronDown, Plus } from 'lucide-react';

interface AddUnavailabilityModalProps {
      isOpen: boolean;
      onClose: () => void;
      onSubmit: (data: UnavailabilityData) => void;
}

interface UnavailabilityData {
      isAllDay: boolean;
      date: string;
      fromTime: string;
      toTime: string;
      note: string;
}

const AddUnavailabilityModal: React.FC<AddUnavailabilityModalProps> = ({
      isOpen,
      onClose,
      onSubmit
}) => {
      const [isAllDay, setIsAllDay] = useState(false);
      const [date, setDate] = useState('06/25/25');
      const [fromTime, setFromTime] = useState('9:00 am');
      const [toTime, setToTime] = useState('5:00 pm');
      const [note, setNote] = useState('');

      const handleSubmit = () => {
            onSubmit({
                  isAllDay,
                  date,
                  fromTime,
                  toTime,
                  note
            });
      };

      if (!isOpen) return null;

      return (
            <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                              <h2 className="text-lg font-semibold text-gray-900">Add Unavailability</h2>
                              <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                    <X className="w-5 h-5" />
                              </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                              {/* Unavailable all day toggle */}
                              <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">
                                          Unavailable all day
                                    </span>
                                    <button
                                          onClick={() => setIsAllDay(!isAllDay)}
                                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isAllDay ? 'bg-blue-600' : 'bg-gray-300'
                                                }`}
                                    >
                                          <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAllDay ? 'translate-x-6' : 'translate-x-1'
                                                      }`}
                                          />
                                    </button>
                              </div>

                              {/* Date picker */}
                              <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Date</label>
                                    <div className="relative">
                                          <select
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                                          >
                                                <option value="06/25/25">06/25/25</option>
                                                <option value="06/26/25">06/26/25</option>
                                                <option value="06/27/25">06/27/25</option>
                                          </select>
                                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                              </div>

                              {/* Time range */}
                              {!isAllDay && (
                                    <div className="flex items-center gap-4">
                                          <div className="flex-1">
                                                <label className="text-sm font-medium text-gray-700 mb-2 block">From</label>
                                                <input
                                                      type="text"
                                                      value={fromTime}
                                                      onChange={(e) => setFromTime(e.target.value)}
                                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                          </div>

                                          <div className="flex-1">
                                                <label className="text-sm font-medium text-gray-700 mb-2 block">To</label>
                                                <input
                                                      type="text"
                                                      value={toTime}
                                                      onChange={(e) => setToTime(e.target.value)}
                                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                          </div>

                                          <button className="mt-6   hover:text-blue-700 transition-colors">

                                                <span className="text-sm ml-1 flex"><Plus className="w-5 h-5" /> Add Hours</span>
                                          </button>
                                    </div>
                              )}

                              {/* Note */}
                              <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Note</label>
                                    <textarea
                                          value={note}
                                          onChange={(e) => setNote(e.target.value)}
                                          placeholder="Type here..."
                                          rows={4}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    />
                              </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 mt-auto lg:mt-20  border-gray-200">
                              <button
                                    onClick={handleSubmit}
                                    className="w-full bg-red-100 text-red-700 font-medium py-3 px-4 rounded-full hover:bg-red-200 transition-colors"
                              >
                                    Request Time Off
                              </button>
                        </div>
                  </div>
            </div>
      );
};

// Demo component to show the modal
// @ts-ignore
const App: React.FC = () => {
      const [isModalOpen, setIsModalOpen] = useState(true);

      const handleSubmit = (data: UnavailabilityData) => {
            console.log('Submitted data:', data);
            setIsModalOpen(false);
      };

      return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                  <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">
                              Add Unavailability Modal Demo
                        </h1>
                        <button
                              onClick={() => setIsModalOpen(true)}
                              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                              Open Modal
                        </button>
                  </div>

                  <AddUnavailabilityModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleSubmit}
                  />
            </div>
      );
};

export default AddUnavailabilityModal;