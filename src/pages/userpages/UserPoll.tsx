import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetPollByIdQuery,
  useSubmitPollResponseMutation,
} from "@/store/api/employe/getPollAndSurvey";
import { toast } from "sonner";
import profile from "../../assets/person.png";
import calendar from "../../assets/calendar_month.png";

const UserPoll: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // ✅ Poll fetch
  const {
    data: poolResponse,
    isLoading,
    isError,
    refetch,
  } = useGetPollByIdQuery(id!);
  const poll = poolResponse?.data;

  // ✅ Poll submit mutation
  const [submitPollResponse, { isLoading: isSubmitting }] =
    useSubmitPollResponseMutation();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmitClick = async () => {
    if (!selectedOption || !id) {
      toast.error("Please select an option before submitting.");
      return;
    }

    try {
      await submitPollResponse({
        pollId: id,
        optionId: selectedOption,
      }).unwrap();

      setSubmitted(true);
      toast.success("Poll submitted successfully!");

      // Refetch the poll data to get updated information
      setTimeout(() => {
        refetch();
      }, 1000);
    } catch (error: any) {
      console.error("Poll submission failed:", error);

      // Show specific error message if available
      const errorMessage =
        error?.data?.message || "Failed to submit poll. Please try again.";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading poll...</p>
      </div>
    );
  }

  if (isError || !poll) {
    toast.error("Failed to load poll.");
    return (
      <div className="text-center py-10">
        <p className="text-red-500 text-lg">❌ Failed to load poll.</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="my-6 container mx-auto px-4 max-w-2xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex flex-wrap gap-2 items-center mb-6 text-sm text-gray-600">
          <h1 className="text-2xl font-semibold text-primary w-full mb-2">
            {poll.title}
          </h1>
          <div className="flex gap-4 items-center flex-wrap">
            <span className="flex gap-1 items-center">
              <img src={profile} alt="Owner" className="w-5 h-5" />
              Owner: {poll.user?.profile?.firstName || "Admin"}
            </span>
            <span className="flex gap-1 items-center">
              <img src={calendar} alt="Calendar" className="w-5 h-5" />
              Published:{" "}
              {poll.publishTime
                ? new Date(poll.publishTime).toLocaleDateString()
                : "N/A"}
            </span>
            <span className="font-medium">
              Status: <span className="font-medium text-green-600">Active</span>
            </span>
          </div>
        </div>

        {/* Question */}
        <div className="flex items-start my-6">
          <div className="font-bold text-white mr-3 border px-4 rounded-md py-2 bg-primary flex-shrink-0">
            1
          </div>
          <div>
            <p className="text-gray-900 font-semibold mb-2">{poll.question}</p>
            <p className="text-sm text-gray-600">
              Please select one option that best represents your opinion
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-8">
          {poll.options?.map((option: any) => (
            <label
              key={option.id}
              className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                selectedOption === option.id
                  ? "border-primary bg-purple-50 shadow-sm"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input
                type="radio"
                name="poll-option"
                value={option.id}
                checked={selectedOption === option.id}
                onChange={handleOptionChange}
                className="form-radio h-5 w-5 text-purple-600 focus:ring-purple-500"
                disabled={submitted || isSubmitting}
              />
              <span className="ml-4 text-gray-800">{option.option}</span>
            </label>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          {!submitted ? (
            <button
              className="w-full py-3 font-semibold rounded-md transition bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmitClick}
              disabled={isSubmitting || !selectedOption}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </span>
              ) : (
                "Submit"
              )}
            </button>
          ) : (
            <div className="text-center py-4">
              <div className="text-green-500 text-4xl mb-2">✅</div>
              <p className="text-primary font-medium">
                Thank you for your vote!
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Your response has been recorded.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPoll;
