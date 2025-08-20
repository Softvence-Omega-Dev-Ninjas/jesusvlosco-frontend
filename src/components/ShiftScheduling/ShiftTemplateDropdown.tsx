
import { TShift } from "@/types/shared";
import { formatTimeFromISO } from "@/utils/formatDateToMDY";
import {  useState, useRef, useEffect } from "react";
import { TiEqualsOutline } from "react-icons/ti";


const ShiftTemplateDropdown= ({shiftTemplates}: {shiftTemplates: TShift[]}) => {
      const [open, setOpen] = useState(false);
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

                              {/* Shift Cards */}
                              {shiftTemplates.map((shift: TShift, idx: number) => (
                                    <div
                                          key={idx}
                                          className="bg-indigo-600 text-white rounded-md px-3 py-2 text-sm cursor-pointer hover:bg-indigo-700"
                                    >
                                          <p className="font-semibold">{shift.shiftTitle}</p>
                                          <p className="text-sm">{formatTimeFromISO(shift.startTime ?? "")} - {formatTimeFromISO(shift.endTime ?? "")}</p>
                                    </div>
                              ))}

                              {shiftTemplates.length === 0 && (
                                    <p className="text-sm text-gray-500 text-center">No shifts found.</p>
                              )}
                        </div>
                  )}
            </div>
      );
};

export default ShiftTemplateDropdown;
