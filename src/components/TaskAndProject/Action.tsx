import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function OptionsDropdownButton() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = () => {
    setIsOpen(false);
    console.log("Delete clicked");
  };

  const handleDuplicate = () => {
    setIsOpen(false);
    console.log("Duplicate clicked");
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-6 py-2 bg-[#4E53B1] text-white text-sm font-medium rounded-md shadow-sm focus:outline-none  focus:ring-offset-2 transition-colors duration-200"
      >
        Actions <ChevronDown className="ml-2 w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute left-1 right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50 ">
          <button
            onClick={handleDelete}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm  hover:bg-red-50"
          >
            Delete
          </button>
          <button
            onClick={handleDuplicate}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Duplicate
          </button>
        </div>
      )}
    </div>
  );
}
