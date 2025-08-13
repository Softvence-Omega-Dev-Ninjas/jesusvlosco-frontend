import { FC, useState, useRef, useEffect } from "react";
import { FiRotateCcw, FiSearch } from "react-icons/fi";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { RiDeleteBinLine } from "react-icons/ri";

const options = ["Confirmed", "Unconfirmed", "Canceled", "Checked-in", "Completed"];

const StatusFilterDropdown: FC = () => {
      const [open, setOpen] = useState(false);
      const [search, setSearch] = useState("");
      const [checkedItems, setCheckedItems] = useState<string[]>([]);
      const dropdownRef = useRef<HTMLDivElement | null>(null);

      // Handle click outside
      useEffect(() => {
            const handleClickOutside = (e: MouseEvent) => {
                  if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                        setOpen(false);
                  }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
      }, []);

      const toggleCheck = (value: string) => {
            setCheckedItems(prev =>
                  prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
            );
      };

      const resetFilter = () => setCheckedItems([]);
      const removeFilter = () => setCheckedItems([]);

      const filteredOptions = options.filter(opt => opt.toLowerCase().includes(search.toLowerCase()));
      const allSelected = filteredOptions.length > 0 && filteredOptions.every(opt => checkedItems.includes(opt));

      return (
            <div className="relative inline-block " ref={dropdownRef}>
                  <button
                        onClick={() => setOpen(prev => !prev)}
                        className="text-sm border min-w-max flex border-indigo-300 text-indigo-700 px-3 py-1.5 rounded-full bg-white"
                  >
                        Status  {open ? <HiChevronUp className="w-4 h-4 mmt-1" /> : <HiChevronDown className="w-4 h-4 mt-1" />}
                  </button>

                  {open && (
                        <div className="absolute z-20 mt-2 w-74 bg-white border border-gray-200 shadow-md rounded-lg p-4 space-y-4">
                              {/* Action buttons */}
                              <div className="flex gap-2">
                                    <button
                                          onClick={resetFilter}
                                          className="flex items-center min-w-max gap-1 border border-indigo-300 text-indigo-700 px-3 py-1 rounded-full text-sm"
                                    >
                                          <FiRotateCcw className="w-4 h-4" /> Reset filter
                                    </button>
                                    <button
                                          onClick={removeFilter}
                                          className="flex items-center min-w-max gap-1 border border-indigo-300 text-indigo-700 px-3 py-1 rounded-full text-sm"
                                    >
                                          <RiDeleteBinLine className="w-4 h-4" /> Remove filter
                                    </button>
                              </div>

                              {/* Search box */}
                              <div className="relative">
                                    <input
                                          type="text"
                                          placeholder="Search"
                                          value={search}
                                          onChange={e => setSearch(e.target.value)}
                                          className="w-full border border-gray-300 rounded-md px-3 py-1.5 pl-9 text-sm focus:outline-none"
                                    />
                                    <FiSearch className="absolute top-2.5 left-3 text-gray-400" />
                              </div>

                              {/* Checkbox list */}
                              <div className="space-y-2 text-sm text-gray-700 max-h-48 overflow-y-auto">
                                    <label className="flex items-center gap-2 font-medium">
                                          <input
                                                type="checkbox"
                                                checked={allSelected}
                                                onChange={() =>
                                                      setCheckedItems(prev =>
                                                            allSelected ? prev.filter(v => !filteredOptions.includes(v)) : [...new Set([...prev, ...filteredOptions])]
                                                      )
                                                }
                                          />
                                          Select all
                                    </label>
                                    <hr />
                                    {filteredOptions.map((item, idx) => (
                                          <label key={idx} className="flex items-center gap-2">
                                                <input
                                                      type="checkbox"
                                                      checked={checkedItems.includes(item)}
                                                      onChange={() => toggleCheck(item)}
                                                />
                                                {item}
                                          </label>
                                    ))}
                              </div>
                        </div>
                  )}
            </div>
      );
};

export default StatusFilterDropdown;
