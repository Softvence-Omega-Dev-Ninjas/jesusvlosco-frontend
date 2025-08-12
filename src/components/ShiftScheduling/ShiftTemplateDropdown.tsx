import { FC, useState, useRef, useEffect } from "react";
import { TiEqualsOutline } from "react-icons/ti";
import { FiSearch } from "react-icons/fi";

interface Template {
      label: string;
      time: string;
}

const shiftTemplates: Template[] = [
      { label: "Morning Shift", time: "9:00 am - 5:00 pm" },
      { label: "Night Shift", time: "10:00 am - 6:00 pm" },
];

const ShiftTemplateDropdown: FC = () => {
      const [open, setOpen] = useState(false);
      const [search, setSearch] = useState("");
      const dropdownRef = useRef<HTMLDivElement | null>(null);

      useEffect(() => {
            const handleClickOutside = (e: MouseEvent) => {
                  if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                        setOpen(false);
                  }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
      }, []);

      const filtered = shiftTemplates.filter(t =>
            t.label.toLowerCase().includes(search.toLowerCase())
      );

      return (
            <div className="relative inline-block" ref={dropdownRef}>
                  <button
                        className="text-lg text-gray-600"
                        onClick={() => setOpen(prev => !prev)}
                  >
                        <TiEqualsOutline />
                  </button>

                  {open && (
                        <div className="absolute z-20 mt-2 w-60 bg-white border border-gray-200 shadow-md rounded-lg p-3 space-y-3">
                              {/* Search */}
                              <div className="relative">
                                    <input
                                          type="text"
                                          placeholder="Search Templates"
                                          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none"
                                          value={search}
                                          onChange={e => setSearch(e.target.value)}
                                    />
                                    <FiSearch className="absolute top-2.5 left-3 text-gray-400" />
                              </div>

                              {/* Shift Cards */}
                              {filtered.map((template, idx) => (
                                    <div
                                          key={idx}
                                          className="bg-indigo-600 text-white rounded-md px-3 py-2 text-sm cursor-pointer hover:bg-indigo-700"
                                    >
                                          <p className="font-semibold">{template.time}</p>
                                          <p className="text-sm">{template.label}</p>
                                    </div>
                              ))}

                              {filtered.length === 0 && (
                                    <p className="text-sm text-gray-500 text-center">No templates found.</p>
                              )}
                        </div>
                  )}
            </div>
      );
};

export default ShiftTemplateDropdown;
