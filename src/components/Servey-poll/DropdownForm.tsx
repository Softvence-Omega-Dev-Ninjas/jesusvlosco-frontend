import { useState } from 'react';

const DropdownForm = () => {
      const [isRequired, setIsRequired] = useState(false);
      const [hasLocationStamp, setHasLocationStamp] = useState(false);
      const [isMultipleSelection, setIsMultipleSelection] = useState(false);

      return (
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                  <h1 className="text-2xl font-bold text-gray-800 mb-4">Dropdown</h1>

                  <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">Question</h2>
                        <p className="text-gray-600 mb-4">Description</p>

                        <h3 className="text-md font-medium text-gray-700 mb-2">Answer</h3>
                        <div className="space-y-2 mb-4">
                              <div className="p-3 border border-gray-300 rounded-md bg-gray-50">option 1</div>
                              <div className="p-3 border border-gray-300 rounded-md bg-gray-50">option 1</div>
                        </div>

                        <button className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
                              <span className="text-xl mr-1">+</span> Add field
                        </button>

                        <div className="space-y-3 mb-6">
                              <label className="flex items-center space-x-2">
                                    <input
                                          type="checkbox"
                                          checked={isRequired}
                                          onChange={() => setIsRequired(!isRequired)}
                                          className="h-4 w-4 text-blue-600 rounded"
                                    />
                                    <span className="text-gray-700">Required</span>
                              </label>

                              <label className="flex items-center space-x-2">
                                    <input
                                          type="checkbox"
                                          checked={hasLocationStamp}
                                          onChange={() => setHasLocationStamp(!hasLocationStamp)}
                                          className="h-4 w-4 text-blue-600 rounded"
                                    />
                                    <span className="text-gray-700">Location stamp capture</span>
                              </label>

                              <label className="flex items-center space-x-2">
                                    <input
                                          type="checkbox"
                                          checked={isMultipleSelection}
                                          onChange={() => setIsMultipleSelection(!isMultipleSelection)}
                                          className="h-4 w-4 text-blue-600 rounded"
                                    />
                                    <span className="text-gray-700">Multiple selection</span>
                              </label>
                        </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                              Confirm
                        </button>
                  </div>
            </div>
      );
};

export default DropdownForm;