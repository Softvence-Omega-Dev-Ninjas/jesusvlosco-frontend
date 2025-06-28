import { useState } from 'react';

const PublishSettings = () => {
  const [publishOption, setPublishOption] = useState('publishNow'); // 'publishNow' or 'selectDateTime'
  const [selectedDate, setSelectedDate] = useState('21/06/2025'); // Placeholder date in DD/MM/YYYY format
  const [selectedTime, setSelectedTime] = useState('16:40'); // Placeholder time
  const [notifyEmployees, setNotifyEmployees] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('A new update is waiting for you in the XYZ company app');
  const [showOnFeed, setShowOnFeed] = useState(false);
  const [sendReminder, setSendReminder] = useState(false);
  const [reminderDate, setReminderDate] = useState('21/06/2025'); // Placeholder reminder date in DD/MM/YYYY format
  const [reminderTime, setReminderTime] = useState('16:40'); // Placeholder reminder time
  const [showOnFeed2, setShowOnFeed2] = useState(false); // Assuming this is distinct from the first "Show on feed"

  return (
    // Outer container with light gray background matching the image
    <div className="flex justify-center p-4 sm:p-6 lg:p-8 font-sans w-full bg-[#FAFBFF] min-h-screen">
      {/* Main content container with white background and rounded corners, matching the image */}
      <div className="w-full max-w-4xl p-6 sm:p-8 lg:p-10 bg-[#FAFBFF] rounded-xl ">

        {/* Publish Now / Select Date & Time */}
        <div className="mb-10"> {/* Increased bottom margin for spacing as in image */}
          <div className="flex items-center mb-4">
            <input
              type="radio"
              id="publishNow"
              name="publishOption"
              value="publishNow"
              checked={publishOption === 'publishNow'}
              onChange={() => setPublishOption('publishNow')}
              // Styling for radio button to match default form styles, indigo color
              className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 rounded-full cursor-pointer"
            />
            <label htmlFor="publishNow" className="ml-2 text-gray-700 text-base sm:text-lg cursor-pointer">
              Publish now
            </label>
          </div>

          <div className="flex items-center"> {/* Align "Select date & time" with inputs */}
            <input
              type="radio"
              id="selectDateTime"
              name="publishOption"
              value="selectDateTime"
              checked={publishOption === 'selectDateTime'}
              onChange={() => setPublishOption('selectDateTime')}
              // Styling for radio button
              className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 rounded-full cursor-pointer"
            />
            <label htmlFor="selectDateTime" className="ml-2 text-gray-700 text-base sm:text-lg cursor-pointer">
              Select date & time
            </label>
            {publishOption === 'selectDateTime' && (
              <div className="flex items-center ml-4 space-x-2">
                {/* Date Input - now type="text" with a dropdown icon */}
                <div className="relative">
                  <input
                    type="text"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border border-gray-300 rounded-md pr-8 pl-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
                    placeholder="DD/MM/YYYY"
                  />
                  <svg className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
                <span className="text-gray-700">At</span>
                {/* Time Input - now type="text" with a dropdown icon */}
                <div className="relative">
                  <input
                    type="text"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="border border-gray-300 rounded-md pr-8 pl-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
                    placeholder="HH:MM"
                  />
                  <svg className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notify employees via push notification */}
        <div className="mb-10">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="notifyEmployees"
              checked={notifyEmployees}
              onChange={(e) => setNotifyEmployees(e.target.checked)}
              // Styling for checkbox
              className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="notifyEmployees" className="ml-2 text-gray-700 text-base sm:text-lg cursor-pointer">
              Notify employees via push notification
            </label>
          </div>
          {notifyEmployees && (
            <textarea
              // Textarea styling matching the image: full width, light border, rounded, padding
              className="w-full border border-gray-300 rounded-md p-3 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
              rows={3}
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
            />
          )}
        </div>

        {/* Show on feed by XYZ agency - First instance */}
        <div className="mb-10">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showOnFeed"
              checked={showOnFeed}
              onChange={(e) => setShowOnFeed(e.target.checked)}
              // Styling for checkbox
              className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="showOnFeed" className="ml-2 text-gray-700 text-base sm:text-lg cursor-pointer">
              Show on feed by XYZ agency
            </label>
          </div>
        </div>

        {/* Send on reminder if user didn't view by */}
        <div className="mb-10">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="sendReminder"
              checked={sendReminder}
              onChange={(e) => setSendReminder(e.target.checked)}
              // Styling for checkbox
              className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="sendReminder" className="ml-2 text-gray-700 text-base sm:text-lg cursor-pointer">
              Send on reminder if user didn't view by
            </label>
          </div>
          {sendReminder && (
            <div className="flex items-center ml-6 space-x-2"> {/* Indented to match image */}
              {/* Reminder Date Input - now type="text" with a dropdown icon */}
              <div className="relative">
                <input
                  type="text"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  className="border border-gray-300 rounded-md pr-8 pl-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
                  placeholder="DD/MM/YYYY"
                />
                <svg className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              {/* Reminder Time Input - now type="text" with a dropdown icon */}
              <div className="relative">
                <input
                  type="text"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="border border-gray-300 rounded-md pr-8 pl-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
                  placeholder="HH:MM"
                />
                <svg className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Second "Show on feed by XYZ agency" */}
        <div className="mb-10">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showOnFeed2"
              checked={showOnFeed2}
              onChange={(e) => setShowOnFeed2(e.target.checked)}
              // Styling for checkbox
              className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="showOnFeed2" className="ml-2 text-gray-700 text-base sm:text-lg cursor-pointer">
              Show on feed by XYZ agency
            </label>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PublishSettings;
