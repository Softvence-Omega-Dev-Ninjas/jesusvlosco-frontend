
import { useState } from 'react';
import { X, Plus, Paperclip, Trash2 } from 'lucide-react';
import LabelSelector from './LabelSelector';


interface NewTaskModalProps {
    onClose: () => void;
    onTaskDetailsClick: () => void;
}


export default function NewTaskModal({ onClose }: NewTaskModalProps) {
      const [showDetails, setShowDetails] = useState(false);
      


      return (
            <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
                  <div className="bg-white w-full max-w-xl rounded-xl p-6 shadow-xl relative">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-gray-300 pb-3 mb-4">
                              <h2 className="text-lg font-semibold text-[#4E53B1] flex items-center gap-2">
                                    <Plus className="w-4 h-4 text-[#4E53B1]" /> New Task
                              </h2>
                              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5" />
                              </button>
                        </div>

                        {/* Content */}
                        {!showDetails ? (
                              <div className="space-y-6">
                                    
                                    {/* Task Title */}
                                    <div className="flex items-center gap-4">
                                          <label className="w-24 text-gray-700 font-medium">Task Title</label>
                                          <input
                                                type="text"
                                                placeholder="Type Here"
                                                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E53B1]"
                                          />
                                    </div>

                                    {/* Assign To */}
                                    <div className="flex items-center gap-4">
                                          <label className="w-24 text-gray-700 font-medium">Assign to</label>
                                          <select
                                                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E53B1]"
                                          >
                                                <option>Select</option>
                                                <option>Jane Cooper</option>
                                                <option>Robert Fox</option>
                                          </select>
                                    </div>

                                    {/* Add More Details Trigger */}
                                    <div
                                          onClick={() => setShowDetails(true)}
                                          className="flex items-center gap-2 text-[#4E53B1] cursor-pointer"
                                    >
                                          <Plus className="w-4 h-4" />
                                          <span className="text-sm font-medium">Add more details</span>
                                    </div>
                              </div>
                        ) : (
                              <div className="space-y-4">
                                    {/* Task Title */}
                                          <p className='text-sm underline text-[#4E53B1]'>Task Details</p>
                                         
                                    <div>
                                          <label className="text-sm text-gray-700 font-medium">Task Title</label>
                                          <input
                                                type="text"
                                                placeholder=""
                                                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E53B1]"
                                          />
                                    </div>

                                    {/* Description */}
                                    <div>
                                          <label className="text-sm text-gray-700 font-medium">Description</label>
                                          <textarea
                                                placeholder="Type here..."
                                                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-[#4E53B1]"
                                          ></textarea>
                                          <div className="text-right text-xs text-gray-500 pt-1">
                                                <Paperclip className="inline-block w-4 h-4 mr-1" /> Attachment
                                          </div>
                                    </div>

                                    {/* Location */}
                                    <div>
                                          <label className="text-sm text-gray-700 font-medium">Location</label>
                                          <input
                                                type="text"
                                                placeholder="Type location"
                                                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E53B1]"
                                          />
                                    </div>

                                    {/* Start & Due Dates */}
                                    <div className="grid gap-4">
                                          <div className="flex-1">

                                                <div className="flex gap-2 mt-1">
                                                      <label className="text-sm text-gray-500 mt-1 font-medium">Start Date</label>
                                                      <input type="text" defaultValue="22/06/2025" className="border border-gray-300 text-center text-gray-500 rounded-md px-2 py-2 w-30 text-sm" />
                                                      <input type="text" defaultValue="9:00 am" className="border border-gray-300 text-center text-gray-500 rounded-md px-2 py-1 w-28 text-sm" />
                                                </div>
                                          </div>
                                          <div className="flex-1">

                                                <div className="flex gap-2 mt-1">
                                                      <label className="text-sm text-gray-500 mt-1 font-medium">Due Date</label>
                                                      <input type="text" defaultValue="23/06/2025" className="border border-gray-300 ml-2 text-gray-500 rounded-md px-2 py-2 text-center w-30 text-sm" />
                                                      <input type="text" defaultValue="8:00 am" className="border border-gray-300 text-gray-500 rounded-md text-center px-2 py-1 w-28 text-sm" />
                                                </div>
                                          </div>
                                    </div>

                                    {/* Labels */}
                                    <div>


                                          <LabelSelector />
                                    </div>
                              </div>
                        )}

                        {/* Footer */}
                        <div className="mt-6 flex justify-between items-center">
                              <div className="flex gap-4">
                                    <button className="bg-[#4E53B1] hover:bg-[#3f45a0] text-white text-sm font-semibold px-5 py-2 rounded-md">
                                          Publish Task
                                    </button>
                                    <button className="border border-[#4E53B1] text-[#4E53B1] text-sm font-semibold px-5 py-2 rounded-md hover:bg-[#f2f2fc]">
                                          Draft Task
                                    </button>
                              </div>
                              <button className="text-red-500 hover:text-red-700">
                                    <Trash2 className="w-5 h-5" />
                              </button>
                        </div>
                  </div>
            </div>
      );
}
