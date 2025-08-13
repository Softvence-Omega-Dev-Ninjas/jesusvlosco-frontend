import { FC, useState, useRef, useEffect } from "react";
import { FiRotateCcw } from "react-icons/fi";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { RiDeleteBinLine } from "react-icons/ri";

const AssignedFilterDropdown: FC = () => {
      const [open, setOpen] = useState(false);
      const [filters, setFilters] = useState({ assigned: false, unassigned: false });

      const dropdownRef = useRef<HTMLDivElement | null>(null);

      // Close dropdown when clicked outside
      useEffect(() => {
            function handleClickOutside(event: MouseEvent) {
                  if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                        setOpen(false);
                  }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
      }, []);

      const resetFilter = () => setFilters({ assigned: false, unassigned: false });
      const removeFilter = () => setFilters({ assigned: false, unassigned: false });

      return (
            <div className="relative inline-block" ref={dropdownRef}>
                  {/* Button that mimics select */}
                  <button
                        onClick={() => setOpen(prev => !prev)}
                        className="text-sm border flex min-w-max border-indigo-300 text-indigo-700 px-3 py-1.5 rounded-full bg-white"
                  >
                        Assigned/Unassigned {open ? <HiChevronUp className="w-4 h-4 mmt-1" /> : <HiChevronDown className="w-4 h-4 mt-1" />}
                  </button>

                  {/* Dropdown Panel */}
                  {open && (
                        <div className="absolute z-20 mt-2 w-80 bg-white border border-gray-200 shadow-md rounded-lg p-4 space-y-4">
                              <div className="flex gap-2">
                                    <button
                                          onClick={resetFilter}
                                          className="flex items-center gap-1 border min-w-max border-indigo-300 text-indigo-700 px-3 py-1 rounded-full text-sm"
                                    >
                                          <FiRotateCcw className="w-4 h-4" /> Reset filter
                                    </button>
                                    <button
                                          onClick={removeFilter}
                                          className="flex items-center gap-1 border min-w-max border-indigo-300 text-indigo-700 px-3 py-1 rounded-full text-sm"
                                    >
                                          <RiDeleteBinLine className="w-4 h-4" /> Remove filter
                                    </button>
                              </div>

                              <div className="space-y-2 text-sm text-gray-700">
                                    <label className="flex items-center gap-2">
                                          <input
                                                type="checkbox"
                                                checked={filters.assigned}
                                                onChange={() => setFilters(f => ({ ...f, assigned: !f.assigned }))}
                                          />
                                          Assigned
                                    </label>
                                    <label className="flex items-center gap-2">
                                          <input
                                                type="checkbox"
                                                checked={filters.unassigned}
                                                onChange={() => setFilters(f => ({ ...f, unassigned: !f.unassigned }))}
                                          />
                                          Unassigned
                                    </label>
                              </div>
                        </div>
                  )}
            </div>
      );
};

export default AssignedFilterDropdown;
