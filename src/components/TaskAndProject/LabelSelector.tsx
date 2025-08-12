import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

const labels = ['General Tasks', 'Urgent', 'Bug'];

export default function LabelSelector() {
      const [selectedLabel, setSelectedLabel] = useState<string>('General Tasks');
      const [dropdownOpen, setDropdownOpen] = useState(false);

      const removeLabel = () => setSelectedLabel('');
      const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
      const selectLabel = (label: string) => {
            setSelectedLabel(label);
            setDropdownOpen(false);
      };

      return (
            <div className="mt-1 grid items-center gap-2 w-64 relative">
                  <label className="text-sm text-gray-700 font-medium">Labels</label>

                  <div
                        className="border border-gray-300 rounded-md px-2 py-1 flex items-center justify-between cursor-pointer"
                        onClick={toggleDropdown}
                  >
                        <div className="flex gap-2 items-center flex-wrap">
                              {selectedLabel && (
                                    <span className="bg-[#E0E7FF] text-[#4E53B1] px-3 py-1 rounded-full text-sm flex items-center">
                                          {selectedLabel}
                                          <X
                                                size={14}
                                                className="ml-1 cursor-pointer"
                                                onClick={(e) => {
                                                      e.stopPropagation();
                                                      removeLabel();
                                                }}
                                          />
                                    </span>
                              )}
                        </div>
                        <ChevronDown size={16} className="text-gray-500" />
                  </div>

                  {dropdownOpen && (
                        <div className="absolute top-full mt-1 left-0 w-full bg-white border border-gray-300 rounded-md shadow-md z-10">
                              {labels.map((label) => (
                                    <div
                                          key={label}
                                          onClick={() => selectLabel(label)}
                                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                    >
                                          {label}
                                    </div>
                              ))}
                        </div>
                  )}
            </div>
      );
}
