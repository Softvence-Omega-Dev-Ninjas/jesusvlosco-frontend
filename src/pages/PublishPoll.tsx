import { useState } from "react";
import PublishSettings from "./PollComponents/PublishSettings";
import PollSummary from "./PollComponents/PollSummary";

export default function PublishPoll() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    {
      name: "Assign by",
      content: (
        <div className="flex w-full flex-col justify-center items-center h-full sm:flex-row gap-6 overflow-x-auto">
          <button className="px-6 text-xl w-44 py-8 bg-[#4E53B1] text-white rounded-md transition-colors duration-200">All</button>
          <button className="px-6 py-8 bg-white text-[#4E53B1] w-44 border border-[#4E53B1] rounded-md shadow hover:bg-gray-50 transition-colors duration-200">
            Set User
          </button>
        </div>
      ),
    },
    {
      name: "Recipients",
      content: <div className="w-full overflow-x-auto">{/* <PollRecipients /> */}</div>,
    },
    {
      name: "Publish settings",
      content: (
        <div className="w-full overflow-x-auto">
          <PublishSettings />
        </div>
      ),
    },
    {
      name: "Summary",
      content: (
        <div className="w-full overflow-x-auto">
          <PollSummary />
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prevIndex) => prevIndex + 1);
    }
  };

  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="bg-[#FAFBFF] rounded-xl shadow-lg p-6 sm:p-8 lg:p-10 w-full">
        <h1 className="text-2xl sm:text-2xl font-bold text-[#4E53B1] mb-6">Create New Survey & Poll</h1>
        <p className="text-gray-600 mb-8 text-sm sm:text-base">
          Design your survey or poll by adding questions, choosing response types, and setting audience and scheduling options.
        </p>

        <nav
          aria-label="Progress"
          className="mb-12 flex justify-center w-full bg-[#FFFFFF] rounded-t-xl border-b-2 border-[#C5C5C5] pb-5 overflow-x-auto"
        >
          <ol role="list" className="flex items-center justify-between w-full max-w-lg relative">
            <div className="absolute top-1/2 left-[8px] right-[8px] -translate-y-1/2 h-0.5 bg-gray-300"></div>

            {steps.map((step, index) => (
              <li key={step.name} className="flex-1 flex flex-col items-center z-10 relative min-w-fit">
                <div
                  className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full
                                        ${index === currentStepIndex ? "bg-indigo-600" : "bg-gray-400"}
                                    `}
                ></div>
                <p
                  className={`mt-20 text-center text-xl mx-2 font-medium whitespace-nowrap
                                    ${index === currentStepIndex ? "text-indigo-600" : "text-gray-500"}
                                `}
                >
                  {step.name}
                </p>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-10 p-6 bg-white rounded-lg border border-gray-200 min-h-[200px] w-full overflow-x-auto">
          {steps[currentStepIndex].content}
        </div>

        <div className="mt-10 flex flex-wrap justify-end gap-3 bg-[#FFFFFF]">
          {!isLastStep ? (
            <>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={isLastStep}
                className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white
                                    ${isLastStep ? "bg-gray-400 cursor-not-allowed" : "bg-[#4E53B1] hover:bg-[#3D429F]"}
                                `}
              >
                Next
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#4E53B1] hover:bg-[#3D429F]"
              >
                Confirm Poll
              </button>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
