import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import {
  useGetSurveyByIdForEmployeeQuery,
  useSubmitSurveyResponseMutation,
} from "@/store/api/employe/getPollAndSurvey";
import { toast } from "sonner";

const TakeSurvey: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error, isError } = useGetSurveyByIdForEmployeeQuery(
    id!,
    {
      skip: !id,
    }
  );

  // ✅ Submit mutation hook
  const [submitSurveyResponse, { isLoading: isSubmitting }] =
    useSubmitSurveyResponseMutation();

  const survey = data?.data;
  const questions = survey?.questions || [];
  const totalSteps = questions.length;

  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (totalSteps > 0) {
      setProgress((currentStep / totalSteps) * 100);
    }
  }, [currentStep, totalSteps]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const isStepValid = () => {
    const question = questions[currentStep - 1];
    if (!question) return false;
    return answers[question.id] && answers[question.id].trim() !== "";
  };

  const handleNextClick = () => {
    if (!isStepValid()) {
      toast.error("Please answer this question");
      return;
    }
    if (currentStep < totalSteps) setCurrentStep((prev) => prev + 1);
  };

  const handlePreviousClick = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  // ✅ Submit with RTK mutation
  const handleSubmitClick = async () => {
    if (!isStepValid()) {
      toast.error("Please complete the last question before submitting.");
      return;
    }

    const payload = {
      surveyId: id!,
      answers: questions.map((q: any) => {
        const answerValue = answers[q.id];
        switch (q.type) {
          case "SELECT": {
            const selectedOption = q.options?.find(
              (opt: any) => opt.text === answerValue
            );
            return selectedOption
              ? { questionId: q.id, options: [{ optionId: selectedOption.id }] }
              : { questionId: q.id, options: [] };
          }
          case "OPEN_ENDED":
            return { questionId: q.id, answerText: answerValue };
          case "RANGE":
            return { questionId: q.id, rate: Number(answerValue) };
          default:
            return { questionId: q.id, answerText: answerValue };
        }
      }),
    };

    try {
      const res = await submitSurveyResponse(payload).unwrap();

      if (res?.success === true) {
        toast.success(res.message || "Survey submitted successfully");
        setShowModal(true);
        setTimeout(() => navigate("/user/survey"), 2000);
      } else {
        toast.error(res?.message || "Something went wrong.");
      }
    } catch (err: any) {
      console.error("Survey submit failed:", err);
      toast.error(
        err?.data?.message || "Failed to submit survey. Please try again."
      );
    }
  };

  // ✅ Step rendering
  const renderStepContent = () => {
    const question = questions[currentStep - 1];
    if (!question) return null;

    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center mb-4">
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold mr-3">
            {currentStep}
          </span>
          <div>
            <p className="text-gray-900 font-semibold">{question.question}</p>
            <p className="text-sm text-gray-500">
              Please select one option that best represents your opinion
            </p>
          </div>
        </div>

        {/* Options */}
        {question.type === "SELECT" && (
          <div className="space-y-3">
            {question.options?.map((opt: any) => (
              <label
                key={opt.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition
                  ${
                    answers[question.id] === opt.text
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400"
                  }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={opt.text}
                  checked={answers[question.id] === opt.text}
                  onChange={(e) =>
                    handleAnswerChange(question.id, e.target.value)
                  }
                  className="hidden"
                />
                <span className="ml-2">{opt.text}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === "OPEN_ENDED" && (
          <textarea
            value={answers[question.id] || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Type your answer..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-600 focus:ring focus:ring-blue-200 transition mt-3"
          />
        )}

        {question.type === "RANGE" && (
          <div className="space-y-3 mt-3">
            {Array.from(
              { length: question.rangeEnd - question.rangeStart + 1 },
              (_, i) => {
                const value = String(question.rangeStart + i);
                return (
                  <label
                    key={value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition
                      ${
                        answers[question.id] === value
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-300 hover:border-blue-400"
                      }`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={value}
                      checked={answers[question.id] === value}
                      onChange={(e) =>
                        handleAnswerChange(question.id, e.target.value)
                      }
                      className="hidden"
                    />
                    <span className="ml-2">{value}</span>
                  </label>
                );
              }
            )}
          </div>
        )}
      </div>
    );
  };

  // ✅ Loading state
  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );

  // ✅ Error state
  if (isError) {
    console.error("Survey fetch error:", error);
    return (
      <div className="text-center mt-10">
        <p className="text-red-600 mb-4">Survey not found or already responded</p>
        <button 
          onClick={() => navigate("/user/survey")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
        >
          Back to Surveys
        </button>
      </div>
    );
  }

  return (
    <div className="my-6 container mx-auto relative">
      <h1 className="text-2xl font-semibold text-blue-600 mb-4">
        {survey?.title || "Employee Survey"}
      </h1>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>
            Step {currentStep} of {totalSteps} ({Math.round(progress)}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-green-600 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      {renderStepContent()}

      {/* Navigation */}
      <div className="flex items-center justify-between my-6">
        <button
          className={`font-bold text-white border px-6 py-2 rounded-md cursore-pointer ${
            currentStep === 1
              ? "bg-gray-400 cursor-not-allowed border-gray-400"
              : "bg-primary border-primary hover:bg-primary/90"
          }`}
          onClick={handlePreviousClick}
          disabled={currentStep === 1}
        >
          Previous
        </button>

        {currentStep === totalSteps ? (
          <button
            className="font-bold text-white border px-6 py-2 rounded-md bg-green-600 border-green-600 hover:bg-green-700 cursore-pointer"
            onClick={handleSubmitClick}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        ) : (
          <button
            className="font-bold text-white border px-6 py-2 rounded-md bg-primary border-primary hover:bg-primary/90 cursore-pointer"
            onClick={handleNextClick}
          >
            Next
          </button>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/45 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-xl py-10 px-6 w-[450px] text-center">
            <h2 className="text-2xl font-semibold text-blue-600">
              Survey Submission Complete ✅
            </h2>
            <button
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md cursore-pointer"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeSurvey;