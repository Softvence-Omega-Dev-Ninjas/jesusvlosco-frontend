import { CalendarDays } from "lucide-react";
import React from "react";
import DatePicker from "react-datepicker";

interface DateInputProps {
  label: string;
  value: Date | null; // Can extend to Date | string | null if needed
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
  // Properly type the forwarded ref and props for the custom input
  const CustomInput = React.forwardRef<
    HTMLInputElement,
    { value?: string; onClick?: () => void; readOnly?: boolean }
  >(({ value, onClick, readOnly, ...props }, ref) => (
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
  ));
  CustomInput.displayName = "CustomInput";

  // Use Date or null only. If you expect string, update prop and parse accordingly.
  const selectedDate = value instanceof Date ? value : null;

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
        dateFormat="dd, MMMM yyyy"
        showYearDropdown
        showMonthDropdown
        dropdownMode="select"
        popperPlacement="bottom-start"
        customInput={<CustomInput readOnly={readOnly} />}
        readOnly={readOnly}
      />
    </div>
  );
};

export default DateInput;
