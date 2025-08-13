import React from "react"

interface ProgressStepsProps {
  currentStep: number
  steps: string[]
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep, steps }) => (
  <div className="flex items-center bg-white px-4 sm:px-14 py-4 sm:py-6 justify-center mb-8 overflow-x-auto">
    {steps.map((step, index) => (
      <React.Fragment key={step}>
        <div className="flex flex-col items-center min-w-[80px] sm:min-w-auto">
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center text-sm font-medium ${
              index <= currentStep ? "bg-[#4E53B1] text-white" : "bg-gray-200 text-gray-500"
            }`}
          />
          <span
            className={`mt-2 text-xs text-center ${
              index === currentStep ? "text-[#4E53B1] font-medium" : "text-gray-500"
            }`}
          >
            {step}
          </span>
        </div>
        {index < steps.length - 1 && (
          <div className={`w-10 sm:w-40 -mt-5 h-0.5 ${index < currentStep ? "bg-[#4E53B1]" : "bg-gray-200"}`} />
        )}
      </React.Fragment>
    ))}
  </div>
)
