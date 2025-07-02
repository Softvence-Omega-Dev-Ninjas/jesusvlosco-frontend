import React, { useState } from 'react';

import profile from "../../assets/person.png";
import calendar from "../../assets/calendar_month.png";

const UserPoll: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [, setSubmitted] = useState(false);

  const question = {
    text: `How satisfied are you with the current safety protocols on-site? `,
    options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Unsatisfied', 'Very Unsatisfied'],
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmitClick = () => {
    setSubmitted(true);
    alert('Survey submitted!');
  };

  return (
    <div className="my-6 container mx-auto">
      <div>
        {/* Header */}
        <div className="flex flex-wrap gap-2 items-center mb-6 text-sm text-gray-600">
          <h1 className="text-2xl font-semibold text-primary w-full mb-2">
            Employee Satisfaction Survey
          </h1>
          <div className="flex gap-4 items-center flex-wrap">
            <span className="flex gap-1 items-center">
              <img src={profile} alt="Owner" className="w-5 h-5" />
              Owner: Admin
            </span>
            <span className="flex gap-1 items-center">
              <img src={calendar} alt="Calendar" className="w-5 h-5" />
              Duration: May 1 - May 15, 2025
            </span>
            <span className="font-medium">
              Status: <span className="font-medium text-green-600">Active</span>
            </span>
          </div>
        </div>

       

        {/* Question */}
        <div className="flex items-center my-6">
          <button className="font-bold text-white mr-3 border px-4 rounded-md py-2 bg-primary">
            1
          </button>
          <div>
            <p className="text-gray-900 font-semibold mb-2">{question.text}</p>
            <p className="text-sm text-gray-600">
              Please select one option that best represents your opinion
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-8">
          {question.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center p-3 rounded-lg border cursor-pointer ${
                selectedOption === option
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="satisfaction"
                value={option}
                checked={selectedOption === option}
                onChange={handleOptionChange}
                className="form-radio h-6 w-5 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-4 text-gray-800">{option}</span>
            </label>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            className="w-full py-3 bg-primary text-white font-semibold rounded-md cursor-pointer transition"
            onClick={handleSubmitClick}
          >
            Submit
          </button>
        
            <p className="mt-4 text-primary font-medium text-center">
             Thank you for your votting
            </p>
         
        </div>
      </div>
    </div>
  );
};

export default UserPoll;
