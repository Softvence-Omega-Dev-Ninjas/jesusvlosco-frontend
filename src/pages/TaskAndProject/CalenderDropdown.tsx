interface CalendarDropdownProps {
  selectedRange: string;
  onSelectRange: (range: string) => void;
}

export default function CalendarDropdown({ selectedRange, onSelectRange }: CalendarDropdownProps) {
  return (
    <div className="relative">
      <select
        value={selectedRange}
        onChange={(e) => onSelectRange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#4E53B1] focus:border-transparent"
      >
        <option>May 25 - May 30</option>
        <option>June 1 - June 7</option>
        <option>June 8 - June 14</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
}
