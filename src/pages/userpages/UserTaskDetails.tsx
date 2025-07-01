import { useState, useEffect, useCallback } from "react";

import alarm from "@/assets/alarm (1).png";

export default function UserTaskDetails() {
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(9 * 60 * 60); // 9 hours in seconds
//   const [initialTime] = useState(9 * 60 * 60); 
  // Format time from seconds to HH:MM:SS
  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  // Auto-start timer on component mount
  useEffect(() => {
    setIsTimerRunning(true);
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            // Timer completed - you can add notification here
            alert("Task time completed!");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeRemaining]);

  // Toggle timer function
  const toggleTimer = () => {
    if (timeRemaining > 0) {
      setIsTimerRunning(!isTimerRunning);
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="">
          {/* Header */}
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 sm:mb-8">
            Task Details
          </h1>

          {/* Main Task Card */}
          <div className="bg-white rounded-2xl shadow-sm border  border-[#C8CAE7] p-6 sm:p-8">
            {/* Task Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div className="flex-1 ">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                  Website Redesign Project t{" "}
                </h2>
                <div className="flex flex-wrap gap-4 pt-4">
                  <span className="inline-flex items-center px-6 py-2 rounded-full text-sm  bg-[#D9F0E4] text-[#06843F]">
                    General tasks
                  </span>
                  <span className="inline-flex items-center px-6 py-2 rounded-full text-sm  bg-[#4E53B1] text-white">
                    High priority
                  </span>
                </div>
              </div>

              {/* Timer and Start Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6">
                <div className="flex items-center gap-2">
                  <img src={alarm} alt="alam" className="w-8 h-8 mr-2" />

                  <span
                    className={`text-3xl sm:text-4xl font-mono font-bold transition-colors duration-200 ${
                      isTimerRunning
                        ? "text-green-600"
                        : timeRemaining === 0
                        ? "text-red-600"
                        : "text-[#1EBD66]"
                    }`}
                  >
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={toggleTimer}
                    className="px-6 py-3 rounded-lg font-medium transition-colors duration-200 w-full sm:w-auto bg-[#4E53B1] hover:bg-green-700 text-white"
                  >
                    Start Task
                  </button>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="mb-8 border-t border-b border-[#C8CAE7] py-8">
              <h3 className="text-lg font-medium text-[#484848] mb-3">
                Description
              </h3>
              <p className="text-[#5B5B5B] text-md leading-relaxed w-1/2">
                Redesign the company website with a modern look and feel. Focus
                on improving user experience and mobile responsiveness.
              </p>
            </div>

            {/* Assigned To Section */}
            <div className="mb-8 border-b border-[#C8CAE7] pb-8">
              <h3 className="text-lg font-medium text-[#5B5B5B] mb-3">
                Assigned to
              </h3>
              <a
                href="#"
                className="text-[#4E53B1] hover:text-black font-medium transition-colors duration-200"
              >
                Afia Nishat Kanta
              </a>
            </div>

            {/* Time Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8  w-1/2">
              <div>
                <h3 className="text-lg font-medium text-[#484848] mb-3">
                  Start time
                </h3>
                <div className="flex items-center gap-3 text-gray-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>23/06/25 at 05:00</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#484848] mb-3">
                  End time
                </h3>
                <div className="flex items-center gap-3 text-gray-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>27/06/25 at 05:00</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between border-t border-[#C8CAE7] py-6">
              <div className="flex  justify-start items-center pt-6  border-gray-200">
                <label className="inline-flex items-center gap-2 text-[#4E53B1] border  border-[#4E53B1] font-medium px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200">
                  + Add attachment
                  <input
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        console.log("Selected file:", file.name);
                        // You can replace this with upload or preview logic
                      }
                    }}
                  />
                </label>
              </div>
              <button className="px-6 py-3 rounded-lg text-white hover:bg-[#30325e] bg-[#4E53B1]">
                Submit Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
