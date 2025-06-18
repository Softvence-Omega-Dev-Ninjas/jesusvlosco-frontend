import { parseISO } from "date-fns"; // For date formatting
import { CalendarDays } from "lucide-react"; // Icon
import React from "react";
import DatePicker from "react-datepicker";

interface DateInputProps {
  label: string;
  value: Date | null; // Value is now a Date object or null
  onChange: (date: Date | null) => void;
  readOnly?: boolean;
  className?: string;
  name: string;
}

const DateInput: React.FC<DateInputProps> = ({
  label,
  value,
  onChange,
  readOnly = false,
  className = "",
  name,
}) => {
  // Custom input for DatePicker to apply Tailwind styles consistently
  const CustomInput = React.forwardRef<HTMLInputElement, any>(
    ({ value, onClick, readOnly, ...props }, ref) => (
      <div className="relative w-full">
        <input
          {...props}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700
          ${
            readOnly
              ? "bg-gray-50 cursor-default"
              : "bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
          }
          pr-10
        `}
          value={value}
          onClick={onClick}
          readOnly={readOnly}
          ref={ref}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <CalendarDays className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    )
  );

  // DatePicker requires a Date object, so we ensure the value is of that type
  const selectedDate =
    value instanceof Date ? value : value ? parseISO(value.toString()) : null;

  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={name} className="text-sm font-medium text-gray-500 mb-1">
        {label}
      </label>
      <DatePicker
        id={name}
        name={name}
        selected={selectedDate}
        onChange={onChange}
        dateFormat="dd, MMMM yyyy" // Display format
        showYearDropdown
        showMonthDropdown
        dropdownMode="select"
        popperPlacement="bottom-start" // Adjust placement if needed
        customInput={<CustomInput readOnly={readOnly} />}
        readOnly={readOnly} // Disable date picker interaction when readOnly
      />
    </div>
  );
};

export default DateInput;
