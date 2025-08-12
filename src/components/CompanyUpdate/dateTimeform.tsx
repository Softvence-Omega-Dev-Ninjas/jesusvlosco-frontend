import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateTimePicker: React.FC = () => {
  const [publishNow, setPublishNow] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:gap-6 w-full">
      {/* Radio Buttons */}
      <div className="flex gap-4 items-center">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="publish"
            checked={publishNow}
            onChange={() => setPublishNow(true)}
            className="accent-blue-500"
          />
          Publish now
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="publish"
            checked={!publishNow}
            onChange={() => setPublishNow(false)}
            className="accent-blue-500"
          />
          Select date & time
        </label>
      </div>

      {/* Date & Time Picker */}
      {!publishNow && (
        <div className="w-full sm:w-auto">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full sm:w-72 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholderText="Select date & time"
            popperPlacement="bottom-start"
            popperClassName="z-50"
          />
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;
