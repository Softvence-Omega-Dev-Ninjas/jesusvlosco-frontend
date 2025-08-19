import React, { useState, useEffect } from "react";
import {  useParams, useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { useGetSurveyByIdQuery, useSubmitSurveyResponseMutation } from "@/store/api/employe/getPollAndSurvey";
import { toast } from "sonner";


const TakeSurvey: React.FC = () => {
  const navigate=useNavigate()
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetSurveyByIdQuery(id!);
  const [submitSurvey] = useSubmitSurveyResponseMutation(); // RTK Query mutation
  const questions = data?.data?.questions || [];
  const totalSteps = 3;

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
    const question =
      currentStep === 1
        ? questions[0]
        : currentStep === 2
        ? questions[1]
        : questions[2];

    if (!question) return false;
    return answers[question.id] && answers[question.id].trim() !== "";
  };

  const handleNextClick = () => {
    if (!isStepValid()) {
      toast.error('please ans this Quesntion')
      return;
    }
    if (currentStep < totalSteps) setCurrentStep((prev) => prev + 1);
  };

  const handlePreviousClick = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmitClick = async () => {
    if (!isStepValid()) {
      toast.error('Please complete the last question before submitting.')
      return;
    }

    // Format answers for API
    const payload = {
      surveyId: id!,
      answers: questions.map((q: any, index: number) => {
        const answerValue = answers[q.id];
        if (index === 0) {
          // SELECT
          const selectedOption = q.options?.find((opt: any) => opt.text === answerValue);
          return selectedOption
            ? { questionId: q.id, options: [{ optionId: selectedOption.id }] }
            : { questionId: q.id, options: [] };
        } else if (index === 1) {
          // OPEN ENDED
          return { questionId: q.id, answerText: answerValue };
        } else if (index === 2) {
          // RATING
          return { questionId: q.id, rate: Number(answerValue) };
        } else {
          return { questionId: q.id, answerText: answerValue };
        }
      }),
    };

    try {
      const response=await submitSurvey(payload).unwrap();
      if(response.success===true){
        toast.success(response.message)
       navigate('/user/survey')
      }else{
        toast.error(response.message)
      }
      
      console.log("Survey submitted successfully:", payload);
    } catch (err) {
      console.error("Failed to submit survey:", err);
      alert("Failed to submit survey. Please try again.");
    }
  };

  const renderStepContent = () => {
    const question =
      currentStep === 1
        ? questions[0]
        : currentStep === 2
        ? questions[1]
        : questions[2];
    if (!question) return null;

    if (currentStep === 1) {
      return (
        <div>
          <p className="text-gray-900 font-semibold mb-2">{question.question}</p>
          <select
            value={answers[question.id] || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
          >
            <option value="">Select your answer...</option>
            {question.options?.map((opt: any) => (
              <option key={opt.id} value={opt.text}>{opt.text}</option>
            ))}
          </select>
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <div>
          <p className="text-gray-900 font-semibold mb-2">{question.question}</p>
          <input
            type="text"
            value={answers[question.id] || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Type your answer..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
          />
        </div>
      );
    }

    if (currentStep === 3) {
      return (
        <div>
          <p className="text-gray-900 font-semibold mb-2">{question.question}</p>
          <select
            value={answers[question.id] || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
          >
            <option value="">Rate from 1 to 5...</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={String(num)}>{num}</option>
            ))}
          </select>
        </div>
      );
    }

    return null;
  };

  if (isLoading) return <div className="flex justify-center items-center min-h-screen"><FaSpinner className="animate-spin text-4xl text-blue-600" /></div>;
  if (error) return <p className="text-center mt-10 text-red-600">Survey not found or already responded</p>;

  const survey = data?.data;

  return (
    <div className="my-6 container mx-auto relative">
      <h1 className="text-2xl font-semibold text-blue-600 mb-4">{survey?.title || "Employee Survey"}</h1>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>Step {currentStep} of {totalSteps} ({Math.round(progress)}%)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-green-600 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Step Content */}
      {renderStepContent()}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          className={`px-6 py-2 rounded-md text-white ${currentStep === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          onClick={handlePreviousClick}
          disabled={currentStep === 1}
        >
          Previous
        </button>

        {currentStep === totalSteps ? (
          <button
            className="px-6 py-2 rounded-md text-white bg-green-600 hover:bg-green-700"
            onClick={handleSubmitClick}
          >
            Submit
          </button>
        ) : (
          <button
            className="px-6 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
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
            <h2 className="text-2xl font-semibold text-blue-600">Survey Submission Complete ✅</h2>
            <button
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
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
