// import { useState } from "react";

// const PublishSettings = () => {
//   const [publishOption, setPublishOption] = useState("publishNow");
//   const [selectedDate, setSelectedDate] = useState("21/06/2025");
//   const [selectedTime, setSelectedTime] = useState("16:40");
//   const [notifyEmployees, setNotifyEmployees] = useState(false);
//   const [notificationMessage, setNotificationMessage] = useState("A new update is waiting for you in the XYZ company app");
//   const [showOnFeed, setShowOnFeed] = useState(false);
//   const [sendReminder, setSendReminder] = useState(false);
//   const [reminderDate, setReminderDate] = useState("21/06/2025");
//   const [reminderTime, setReminderTime] = useState("16:40");

//   return (
//     <div className="flex justify-center p-4 sm:p-6 lg:p-8 font-sans w-full bg-[#FAFBFF] min-h-screen">
//       <div className="w-full max-w-4xl p-4 sm:p-6 lg:p-8 bg-[#FAFBFF] rounded-xl">
//         {/* Publish Options */}
//         <div className="mb-10 space-y-4">
//           <div className="flex items-center">
//             <input
//               type="radio"
//               id="publishNow"
//               name="publishOption"
//               value="publishNow"
//               checked={publishOption === "publishNow"}
//               onChange={() => setPublishOption("publishNow")}
//               className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 rounded-full cursor-pointer"
//             />
//             <label htmlFor="publishNow" className="ml-2 text-gray-700 text-base sm:text-lg cursor-pointer">
//               Publish now
//             </label>
//           </div>

//           <div className="flex flex-wrap items-center gap-2 sm:gap-4">
//             <input
//               type="radio"
//               id="selectDateTime"
//               name="publishOption"
//               value="selectDateTime"
//               checked={publishOption === "selectDateTime"}
//               onChange={() => setPublishOption("selectDateTime")}
//               className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 rounded-full cursor-pointer"
//             />
//             <label htmlFor="selectDateTime" className="text-gray-700 text-base sm:text-lg cursor-pointer mr-2">
//               Select date & time
//             </label>

//             {publishOption === "selectDateTime" && (
//               <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
//                 {/* Date input */}
//                 <div className="relative w-full sm:w-auto">
//                   <input
//                     type="text"
//                     value={selectedDate}
//                     onChange={(e) => setSelectedDate(e.target.value)}
//                     className="w-full sm:w-auto border border-gray-300 rounded-md pr-8 pl-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                     placeholder="DD/MM/YYYY"
//                   />
//                   <svg
//                     className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </div>

//                 <span className="text-gray-700">at</span>

//                 {/* Time input */}
//                 <div className="relative w-full sm:w-auto">
//                   <input
//                     type="text"
//                     value={selectedTime}
//                     onChange={(e) => setSelectedTime(e.target.value)}
//                     className="w-full sm:w-auto border border-gray-300 rounded-md pr-8 pl-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                     placeholder="HH:MM"
//                   />
//                   <svg
//                     className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Notify employees */}
//         <div className="mb-10">
//           <div className="flex items-center mb-4">
//             <input
//               type="checkbox"
//               id="notifyEmployees"
//               checked={notifyEmployees}
//               onChange={(e) => setNotifyEmployees(e.target.checked)}
//               className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
//             />
//             <label htmlFor="notifyEmployees" className="ml-2 text-gray-700 text-base sm:text-lg cursor-pointer">
//               Notify employees via push notification
//             </label>
//           </div>
//           {notifyEmployees && (
//             <textarea
//               className="w-full border border-gray-300 rounded-md p-3 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
//               rows={3}
//               value={notificationMessage}
//               onChange={(e) => setNotificationMessage(e.target.value)}
//             />
//           )}
//         </div>

//         {/* Show on feed (1st) */}
//         <div className="mb-10">
//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               id="showOnFeed"
//               checked={showOnFeed}
//               onChange={(e) => setShowOnFeed(e.target.checked)}
//               className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
//             />
//             <label htmlFor="showOnFeed" className="ml-2 text-gray-700 text-base sm:text-lg cursor-pointer">
//               Show on feed by XYZ agency
//             </label>
//           </div>
//         </div>

//         {/* Send reminder */}
//         <div className="mb-10">
//           <div className="flex items-center mb-4">
//             <input
//               type="checkbox"
//               id="sendReminder"
//               checked={sendReminder}
//               onChange={(e) => setSendReminder(e.target.checked)}
//               className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
//             />
//             <label htmlFor="sendReminder" className="ml-2 text-gray-700 text-base sm:text-lg cursor-pointer">
//               Send a reminder if user didn't view by
//             </label>
//           </div>
//           {sendReminder && (
//             <div className="flex flex-wrap items-center gap-2 ml-6 w-full sm:w-auto">
//               <div className="relative w-full sm:w-auto">
//                 <input
//                   type="text"
//                   value={reminderDate}
//                   onChange={(e) => setReminderDate(e.target.value)}
//                   className="w-full border border-gray-300 rounded-md pr-8 pl-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                   placeholder="DD/MM/YYYY"
//                 />
//                 <svg
//                   className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                 </svg>
//               </div>
//               <div className="relative w-full sm:w-auto">
//                 <input
//                   type="text"
//                   value={reminderTime}
//                   onChange={(e) => setReminderTime(e.target.value)}
//                   className="w-full border border-gray-300 rounded-md pr-8 pl-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                   placeholder="HH:MM"
//                 />
//                 <svg
//                   className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                 </svg>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Show on feed (2nd) */}
//         {/* <div className="mb-10">
//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               id="showOnFeed2"
//               checked={showOnFeed2}
//               onChange={(e) => setShowOnFeed2(e.target.checked)}
//               className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
//             />
//             <label htmlFor="showOnFeed2" className="ml-2 text-gray-700 text-base sm:text-lg cursor-pointer">
//               Show on feed by XYZ agency
//             </label>
//           </div>
//         </div> */}
//       </div>
//     </div>
//   );
// };

// export default PublishSettings;

import { useState } from "react";

const PublishSettings = () => {
  const [publishOption, setPublishOption] = useState("publishNow");
  const [selectedDate, setSelectedDate] = useState("2025-06-21"); // YYYY-MM-DD
  const [selectedTime, setSelectedTime] = useState("16:40"); // HH:MM
  const [notifyEmployees, setNotifyEmployees] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("A new update is waiting for you in the XYZ company app");
  const [showOnFeed, setShowOnFeed] = useState(false);
  const [sendReminder, setSendReminder] = useState(false);
  const [reminderDate, setReminderDate] = useState("2025-06-21"); // YYYY-MM-DD
  const [reminderTime, setReminderTime] = useState("16:40"); // HH:MM

  return (
    <div className="flex justify-center p-4 sm:p-6 lg:p-8 font-sans w-full bg-[#FAFBFF] min-h-screen">
      <div className="w-full max-w-4xl p-4 sm:p-6 lg:p-8 bg-[#FAFBFF] rounded-xl">
        {/* Publish Options */}
        <div className="mb-10 space-y-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="publishNow"
              name="publishOption"
              value="publishNow"
              checked={publishOption === "publishNow"}
              onChange={() => setPublishOption("publishNow")}
              className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 rounded-full cursor-pointer"
            />
            <label htmlFor="publishNow" className="ml-2 text-gray-700 text-base sm:text-lg cursor-pointer">
              Publish now
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <input
              type="radio"
              id="selectDateTime"
              name="publishOption"
              value="selectDateTime"
              checked={publishOption === "selectDateTime"}
              onChange={() => setPublishOption("selectDateTime")}
              className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 rounded-full cursor-pointer"
            />
            <label htmlFor="selectDateTime" className="text-gray-700 text-base sm:text-lg cursor-pointer mr-2">
              Select date & time
            </label>

            {publishOption === "selectDateTime" && (
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {/* Date input */}
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />

                <span className="text-gray-700">at</span>

                {/* Time input */}
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Notify employees */}
        <div className="mb-10">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="notifyEmployees"
              checked={notifyEmployees}
              onChange={(e) => setNotifyEmployees(e.target.checked)}
              className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="notifyEmployees" className="ml-2 text-gray-700 text-base sm:text-lg cursor-pointer">
              Notify employees via push notification
            </label>
          </div>
          {notifyEmployees && (
            <textarea
              className="w-full border border-gray-300 rounded-md p-3 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
              rows={3}
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
            />
          )}
        </div>

        {/* Show on feed */}
        <div className="mb-10">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showOnFeed"
              checked={showOnFeed}
              onChange={(e) => setShowOnFeed(e.target.checked)}
              className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="showOnFeed" className="ml-2 text-gray-700 text-base sm:text-lg cursor-pointer">
              Show on feed by XYZ agency
            </label>
          </div>
        </div>

        {/* Send reminder */}
        <div className="mb-10">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="sendReminder"
              checked={sendReminder}
              onChange={(e) => setSendReminder(e.target.checked)}
              className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="sendReminder" className="ml-2 text-gray-700 text-base sm:text-lg cursor-pointer">
              Send a reminder if user didn't view by
            </label>
          </div>
          {sendReminder && (
            <div className="flex flex-wrap items-center gap-2 ml-6 w-full sm:w-auto">
              <input
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublishSettings;
